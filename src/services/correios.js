// Em produção (GitHub Pages) não existe proxy — a chamada precisa ir direto
// pra URL do backend no Render. Em dev, deixe VITE_API_URL vazio no seu .env
// e o proxy configurado em vite.config.js continua funcionando normalmente.
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function calcularFreteCorreios({ cepDestino, servico = 'pac', peso = 0.5, valorDeclarado = 0 }) {
  const resposta = await fetch(`${API_BASE_URL}/api/correios/calcular`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cepDestino, servico, peso, valorDeclarado }),
  });

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({ mensagem: 'Não foi possível calcular o frete.' }));
    throw new Error(erro.mensagem || 'Não foi possível calcular o frete.');
  }

  return resposta.json();
}