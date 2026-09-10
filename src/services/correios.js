export async function calcularFreteCorreios({ cepDestino, servico = 'pac', peso = 0.5, valorDeclarado = 0 }) {
  const resposta = await fetch('/api/correios/calcular', {
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
