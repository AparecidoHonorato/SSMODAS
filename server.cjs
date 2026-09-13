const express = require('express');
const app = express();

// Permite que o site publicado no GitHub Pages (outra origem) chame esta API.
// Em produção, defina ALLOWED_ORIGIN=https://aparecidohonorato.github.io no Render
// para restringir o acesso só ao seu site (em vez de aceitar qualquer origem).
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.text({ type: 'application/json', limit: '1mb' }));

// Rota de health check — útil pra confirmar no navegador que o serviço subiu no Render
// (o Render também usa isso pra saber que o serviço está saudável).
app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'ssmodas-correios-proxy' });
});

const PORT = process.env.PORT || 3001;
const CORREIOS_WSDL = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx';
const CEP_ORIGEM = '83414700';
const SERVICO_MAP = {
  pac: '04510',
  sedex: '04014',
};

function normalizarPayload(rawBody) {
  try {
    const parsed = JSON.parse(rawBody || '{}');
    return {
      cepDestino: parsed.cepDestino || '',
      servico: parsed.servico || 'pac',
      peso: parsed.peso || 0.5,
      valorDeclarado: parsed.valorDeclarado || 0,
    };
  } catch (erro) {
    return null;
  }
}

app.post('/api/correios/calcular', async (req, res) => {
  try {
    const payload = normalizarPayload(req.body);

    if (!payload) {
      return res.status(400).json({ mensagem: 'Payload inválido.', valor: null, prazo: null });
    }

    const { cepDestino, servico = 'pac', peso = 0.5, valorDeclarado = 0 } = payload;
    const cepLimpo = String(cepDestino || '').replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      return res.status(400).json({ mensagem: 'Informe um CEP válido.', valor: null, prazo: null });
    }

    const codigo = SERVICO_MAP[servico] || SERVICO_MAP.pac;

    const requestBody = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <CalcPrecoPrazo xmlns="http://tempuri.org/">
          <nCdEmpresa></nCdEmpresa>
          <sDsSenha></sDsSenha>
          <nCdServico>${codigo}</nCdServico>
          <sCepOrigem>${CEP_ORIGEM}</sCepOrigem>
          <sCepDestino>${cepLimpo}</sCepDestino>
          <nVlPeso>${Number(peso).toFixed(2)}</nVlPeso>
          <nCdFormato>1</nCdFormato>
          <nVlComprimento>16</nVlComprimento>
          <nVlAltura>4</nVlAltura>
          <nVlLargura>11</nVlLargura>
          <nVlDiametro>0</nVlDiametro>
          <sCdMaoPropria>N</sCdMaoPropria>
          <nVlValorDeclarado>${Number(valorDeclarado).toFixed(2)}</nVlValorDeclarado>
          <sCdAvisoRecebimento>N</sCdAvisoRecebimento>
        </CalcPrecoPrazo>
      </soap:Body>
    </soap:Envelope>`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const resposta = await fetch(CORREIOS_WSDL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: 'http://tempuri.org/CalcPrecoPrazo',
      },
      body: requestBody,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!resposta.ok) {
      return res.status(502).json({ mensagem: 'Falha ao consultar os Correios.', valor: null, prazo: null });
    }

    const xml = await resposta.text();
    const valor = xml.match(/<Valor>(.*?)<\/Valor>/)?.[1]?.replace(',', '.') || '0';
    const prazo = xml.match(/<PrazoEntrega>(.*?)<\/PrazoEntrega>/)?.[1] || '0';
    const erro = xml.match(/<Erro>(.*?)<\/Erro>/)?.[1] || '0';
    const msgErro = xml.match(/<MsgErro>(.*?)<\/MsgErro>/)?.[1];

    if (erro !== '0') {
      return res.status(422).json({ mensagem: msgErro || 'Não foi possível calcular o frete.', valor: null, prazo: null });
    }

    return res.json({
      mensagem: 'Frete calculado com os Correios.',
      valor: Number(valor).toFixed(2),
      prazo: Number(prazo),
      servico,
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao consultar os Correios.', valor: null, prazo: null });
  }
});

app.listen(PORT, () => {
  console.log(`Correios proxy listening on http://localhost:${PORT}`);
});
