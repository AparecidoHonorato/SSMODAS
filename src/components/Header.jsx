import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingBag, Search, Menu, ChevronDown, X, Trash2, Info, MapPin, Phone, Navigation, MessageCircle } from 'lucide-react';
import { produtos } from '../data/products';
import { calcularFreteCorreios } from '../services/correios';

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [produtoEmVisualizacao, setProdutoEmVisualizacao] = useState(null);
  const [sacolaAberta, setSacolaAberta] = useState(false);
  const [secaoAberta, setSecaoAberta] = useState(null);
  const [itensNaSacola, setItensNaSacola] = useState([]);
  const [mensagemSacola, setMensagemSacola] = useState('');
  const [modalFreteAberto, setModalFreteAberto] = useState(false);
  const [cepDestino, setCepDestino] = useState('');
  const [servicoFrete, setServicoFrete] = useState('pac');
  const [frete, setFrete] = useState(null);
  const [calculandoFrete, setCalculandoFrete] = useState(false);
  const [erroFrete, setErroFrete] = useState('');

  useEffect(() => {
    const fecharComEscape = (evento) => {
      if (evento.key === 'Escape') {
        setProdutoSelecionado(null);
        setProdutoEmVisualizacao(null);
        setMenuAberto(false);
        setSacolaAberta(false);
        setSecaoAberta(null);
      }
    };
    const abrirSacolaPelaPagina = () => {
      setSacolaAberta(true);
      setMenuAberto(false);
      setSecaoAberta(null);
      setProdutoSelecionado(null);
      setProdutoEmVisualizacao(null);
    };

    window.addEventListener('keydown', fecharComEscape);
    window.addEventListener('open-shopping-bag', abrirSacolaPelaPagina);
    return () => {
      window.removeEventListener('keydown', fecharComEscape);
      window.removeEventListener('open-shopping-bag', abrirSacolaPelaPagina);
    };
  }, []);

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(termoBusca.toLowerCase()),
  );

  const resumoSacola = useMemo(() => {
    return itensNaSacola.reduce((acc, item) => {
      const valor = Number(item.preco.replace('R$ ', '').replace('.', '').replace(',', '.'));
      return {
        total: acc.total + valor,
        quantidade: acc.quantidade + 1,
      };
    }, { total: 0, quantidade: 0 });
  }, [itensNaSacola]);

  const adicionarProduto = (produto) => {
    setItensNaSacola((itens) => [...itens, produto]);
    setProdutoSelecionado(null);
    setProdutoEmVisualizacao(null);
    setSacolaAberta(true);
    setMenuAberto(false);
    setMensagemSacola(`${produto.nome} foi adicionado à sacola.`);
    window.setTimeout(() => setMensagemSacola(''), 3000);
  };

  const removerItem = (indice) => {
    setItensNaSacola((itens) => itens.filter((_, itemIndice) => itemIndice !== indice));
  };

  const consultarFrete = async (evento) => {
    evento.preventDefault();
    const cepLimpo = cepDestino.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      setErroFrete('Informe um CEP com 8 dígitos.');
      return;
    }

    try {
      setCalculandoFrete(true);
      setErroFrete('');
      const dados = await calcularFreteCorreios({
        cepDestino: cepLimpo,
        servico: servicoFrete,
        peso: 0.5,
        valorDeclarado: resumoSacola.total,
      });

      setFrete({
        valor: Number(dados.valor),
        prazo: Number(dados.prazo),
        mensagem: dados.mensagem,
        servico: dados.servico,
      });
      setModalFreteAberto(false);
    } catch (erro) {
      setErroFrete(erro.message || 'Não foi possível calcular o frete.');
    } finally {
      setCalculandoFrete(false);
    }
  };

  const abrirMenu = () => {
    setProdutoSelecionado(null);
    setProdutoEmVisualizacao(null);
    setMenuAberto((aberto) => !aberto);
    setSacolaAberta(false);
    setSecaoAberta(null);
  };

  const abrirSecao = (secao) => {
    setSecaoAberta((atual) => atual === secao ? null : secao);
    setMenuAberto(false);
    setBuscaAberta(false);
    setSacolaAberta(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white">
      <div className="relative mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <button onClick={abrirMenu} className="text-stone-700 md:hidden" aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}>
            {menuAberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2 text-left" aria-label="SSmoment's Moda Moderna">
            <div className="text-2xl leading-none font-serif italic tracking-[-0.12em] text-amber-400" aria-hidden="true">
              S<span className="font-light">/</span>S
            </div>
            <div>
              <h1 className="text-base font-serif tracking-wider text-stone-900 font-bold">SSmoment's</h1>
              <span className="text-[8px] tracking-[0.25em] text-amber-400 uppercase block font-semibold -mt-1">Moda Moderna</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={abrirMenu} className="flex items-center gap-1 text-xs font-semibold text-stone-700 transition-colors hover:text-amber-700" aria-expanded={menuAberto}>
            Menu
            <ChevronDown className={`h-4 w-4 transition-transform ${menuAberto ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => { setBuscaAberta((aberta) => !aberta); setMenuAberto(true); setSacolaAberta(false); }}
            className="text-stone-700 hover:text-amber-700"
            aria-label="Pesquisar produtos"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => { setSacolaAberta((aberta) => !aberta); setMenuAberto(false); }}
            className="relative text-stone-700 hover:text-amber-700"
            aria-label="Abrir sacola"
          >
            <ShoppingBag className="h-5 w-5" />
            {itensNaSacola.length > 0 && (
              <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black">
                {itensNaSacola.length}
              </span>
            )}
          </button>
        </div>

        {sacolaAberta && (
          <button
            type="button"
            onClick={() => setSacolaAberta(false)}
            className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-sm"
            aria-label="Fechar sacola"
          />
        )}

        {(menuAberto || sacolaAberta) && (
          <div className={sacolaAberta
            ? 'fixed right-0 top-0 z-[55] h-screen w-full max-w-md overflow-y-auto border-l border-stone-200 bg-white p-5 shadow-2xl shadow-stone-900/20 transition-transform duration-300'
            : 'absolute right-5 top-[calc(100%+0.5rem)] z-50 max-h-[calc(100vh-6rem)] w-[min(42rem,calc(100vw-2.5rem))] overflow-y-auto rounded-xl border border-stone-200 bg-white p-3 shadow-2xl shadow-stone-900/10'}>
            {sacolaAberta ? (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-600">Sua sacola</p>
                    <span className="text-xs text-stone-500">{resumoSacola.quantidade} item(ns)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSacolaAberta(false)}
                      className="rounded-full p-1 text-stone-500 hover:bg-amber-100 hover:text-stone-900"
                      aria-label="Fechar sacola"
                      title="Fechar sacola"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {itensNaSacola.length === 0 ? (
                  <div className="flex min-h-[18rem] flex-col items-center justify-center">
                    <ShoppingBag className="mb-3 h-10 w-10 text-stone-300" />
                    <p className="py-4 text-center text-sm text-stone-500">Sua sacola está vazia.</p>
                    <button onClick={() => setSacolaAberta(false)} className="rounded-full border border-stone-300 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-stone-700 hover:bg-amber-500 hover:text-white">
                      Ver coleção
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {itensNaSacola.map((produto, indice) => (
                      <div key={`${produto.nome}-${indice}`} className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 p-3">
                        <img src={produto.imagem} alt="" className="h-20 w-16 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-stone-900">{produto.nome}</span>
                          <span className="text-[11px] text-stone-500">{produto.preco}</span>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-stone-700">Qtd 1</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removerItem(indice)}
                          className="rounded p-1 text-stone-400 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Remover ${produto.nome}`}
                          title="Remover produto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <div className="rounded-xl bg-stone-900 p-4 text-white">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">Subtotal</span>
                        <span className="text-lg font-bold text-amber-300">
                          R$ {resumoSacola.total.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-300">Frete</span>
                        <button type="button" onClick={() => setModalFreteAberto(true)} className="rounded-full border border-amber-300 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300 hover:bg-amber-300 hover:text-stone-900">
                          {frete ? `R$ ${frete.valor.toFixed(2).replace('.', ',')}` : 'Calcular CEP'}
                        </button>
                      </div>
                      {frete && (
                        <div className="mt-2 border-t border-white/10 pt-2 text-[11px] text-stone-300">
                          <span>Prazo: {frete.prazo} dia(s)</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between border-t border-stone-200 pt-4">
                      <span className="text-sm font-medium text-stone-600">Total</span>
                      <span className="text-lg font-bold text-stone-900">
                        R$ {(resumoSacola.total + (frete ? frete.valor : 0)).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="rounded-lg border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-800 hover:bg-stone-100">
                        Continuar</button>
                      <a href="https://wa.me/5566996075729?text=Ol%C3%A1%2C%20quero%20finalizar%20meu%20pedido%20da%20SSmoment%27s." target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-3 text-sm font-bold text-black hover:bg-amber-500">
                        <MessageCircle className="h-4 w-4" /> Finalizar pedido
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-3 grid grid-cols-2 gap-2 border-b border-stone-200 pb-3 sm:grid-cols-4">
                  <button onClick={() => setMenuAberto(true)} className="rounded-lg bg-amber-100 px-2 py-2 text-[11px] font-semibold text-amber-800">
                    Menu
                  </button>
                  <button onClick={() => abrirSecao('contato')} className="rounded-lg border border-stone-200 px-2 py-2 text-[11px] font-semibold text-stone-700 hover:border-amber-400 hover:bg-amber-50">
                    Contato
                  </button>
                  <button onClick={() => abrirSecao('sobre')} className="rounded-lg border border-stone-200 px-2 py-2 text-[11px] font-semibold text-stone-700 hover:border-amber-400 hover:bg-amber-50">
                    Quem somos
                  </button>
                  <button onClick={() => abrirSecao('mapa')} className="rounded-lg border border-stone-200 px-2 py-2 text-[11px] font-semibold text-stone-700 hover:border-amber-400 hover:bg-amber-50">
                    Endereço
                  </button>
                </div>
                <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-600">Catálogo para igreja</p>
                <p className="mb-3 px-1 text-xs text-stone-500">Vestidos modestos, elegantes e confortáveis para o culto.</p>
                {produtoSelecionado && (
                  <div className="mb-3 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <img src={produtoSelecionado.imagem} alt={produtoSelecionado.nome} className="h-20 w-16 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-stone-900">{produtoSelecionado.nome}</p>
                      <p className="mt-1 text-xs text-stone-500">Tamanho {produtoSelecionado.tamanho}</p>
                      <p className="mt-1 text-sm font-semibold text-stone-800">{produtoSelecionado.preco}</p>
                    </div>
                    <button
                      onClick={() => adicionarProduto(produtoSelecionado)}
                      className="rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-black hover:bg-amber-500"
                    >
                      Adicionar
                    </button>
                    <button onClick={() => setProdutoSelecionado(null)} className="self-start text-stone-400 hover:text-stone-700" aria-label="Fechar detalhes">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {buscaAberta && (
                  <input
                    autoFocus
                    value={termoBusca}
                    onChange={(evento) => setTermoBusca(evento.target.value)}
                    placeholder="Buscar vestido..."
                    className="mb-3 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-amber-500"
                  />
                )}
                <div className="grid gap-1 sm:grid-cols-2">
                  {produtosFiltrados.map((produto) => (
                    <button
                      key={produto.nome}
                      onClick={() => {
                        setProdutoSelecionado(produto);
                        setProdutoEmVisualizacao(produto);
                      }}
                      className="flex items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-amber-50"
                      aria-label={`Visualizar ${produto.nome}`}
                    >
                      <img src={produto.imagem} alt="" className="h-12 w-12 rounded-lg object-cover" />
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-stone-900">{produto.nome}</span>
                        <span className="mt-1 block text-[11px] text-stone-500">Tam. {produto.tamanho} · {produto.preco}</span>
                      </span>
                    </button>
                  ))}
                </div>
                {produtosFiltrados.length === 0 && <p className="py-4 text-center text-sm text-stone-500">Nenhum vestido encontrado.</p>}
              </div>
            )}
          </div>
        )}

        {secaoAberta && (
          <div className="absolute right-5 top-[calc(100%+0.5rem)] z-50 w-[min(22rem,calc(100vw-2.5rem))] rounded-xl border border-stone-200 bg-white p-4 text-sm shadow-2xl shadow-stone-900/10">
            {secaoAberta === 'contato' && (
              <div>
                <div className="mb-3 flex items-center gap-2 text-amber-700">
                  <Phone className="h-4 w-4" />
                  <h2 className="font-semibold">Entre em contato</h2>
                </div>
                <div className="space-y-2">
                  <a href="https://www.instagram.com/ssmoments_modafeminina?igsh=enlwcGxxc2E2ZDVs" target="_blank" rel="noreferrer" className="block text-stone-700 hover:text-amber-700">Instagram @SSMomentsModaFeminina</a>
                  <a href="https://www.facebook.com/share/1BfPDuGoGB/" target="_blank" rel="noreferrer" className="block text-stone-700 hover:text-amber-700">Facebook da loja</a>
                  <a href="https://wa.me/qr/D4EJVN6LOCLTH1" target="_blank" rel="noreferrer" className="block text-stone-700 hover:text-amber-700">WhatsApp da Stefany</a>
                  <a href="https://wa.me/5566996075729" target="_blank" rel="noreferrer" className="block text-stone-700 hover:text-amber-700">WhatsApp da Stheysse</a>
                  <a href="https://chat.whatsapp.com/HBTa8aMh0pO7TpxIn6Ed90" target="_blank" rel="noreferrer" className="block text-stone-700 hover:text-amber-700">Grupo VIP de pré-vendas</a>
                </div>
              </div>
            )}
            {secaoAberta === 'sobre' && (
              <div>
                <div className="mb-3 flex items-center gap-2 text-amber-700">
                  <Info className="h-4 w-4" />
                  <h2 className="font-semibold">Quem somos</h2>
                </div>
                <p className="leading-relaxed text-stone-600">A SSmoment's cria moda modesta, elegante e confortável para mulheres que querem se vestir com propósito.</p>
              </div>
            )}
            {secaoAberta === 'mapa' && (
              <div>
                <div className="mb-3 flex items-center gap-2 text-amber-700">
                  <MapPin className="h-4 w-4" />
                  <h2 className="font-semibold">Endereço</h2>
                </div>
                <p className="text-stone-600">R. da Carnaúba, 238<br />Parque do Embu, Colombo - PR<br />83414-700</p>
                <p className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
                  <Navigation className="h-4 w-4" /> Como chegar
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <a href="https://www.google.com/maps/dir/?api=1&destination=-25.309629,-49.2130086" target="_blank" rel="noreferrer" className="rounded-lg border border-stone-200 px-2 py-2 text-center text-xs font-semibold text-stone-700 hover:border-amber-400 hover:bg-amber-50">Google Maps</a>
                  <a href="https://www.waze.com/ul?ll=-25.309629%2C-49.2130086&navigate=yes" target="_blank" rel="noreferrer" className="rounded-lg border border-stone-200 px-2 py-2 text-center text-xs font-semibold text-stone-700 hover:border-amber-400 hover:bg-amber-50">Waze</a>
                  <a href="https://maps.apple.com/?ll=-25.309629,-49.2130086&q=SSmoment%27s" target="_blank" rel="noreferrer" className="rounded-lg border border-stone-200 px-2 py-2 text-center text-xs font-semibold text-stone-700 hover:border-amber-400 hover:bg-amber-50">Apple Maps</a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {produtoEmVisualizacao && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/70 p-5 backdrop-blur-sm"
          onClick={() => setProdutoEmVisualizacao(null)}
          role="presentation"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(evento) => evento.stopPropagation()}
          >
            <button
              onClick={() => setProdutoEmVisualizacao(null)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow hover:bg-amber-400"
              aria-label="Fechar visualização"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex max-h-[72vh] items-center justify-center bg-stone-100">
              <img
                src={produtoEmVisualizacao.imagem}
                alt={produtoEmVisualizacao.nome}
                className="max-h-[72vh] w-full object-contain"
              />
            </div>
            <div className="flex items-center justify-between gap-4 p-4">
              <div>
                <h2 className="text-base font-semibold text-stone-900">{produtoEmVisualizacao.nome}</h2>
                <p className="mt-1 text-sm text-stone-500">Tamanho {produtoEmVisualizacao.tamanho} · {produtoEmVisualizacao.preco}</p>
              </div>
              <button
                onClick={() => adicionarProduto(produtoEmVisualizacao)}
                className="shrink-0 rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-black hover:bg-amber-500"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalFreteAberto && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-600">Entrega</span>
                <h3 className="mt-1 font-serif text-2xl font-semibold text-stone-900">Calcular frete</h3>
              </div>
              <button type="button" onClick={() => setModalFreteAberto(false)} className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900" aria-label="Fechar">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={consultarFrete}>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-stone-700">CEP de destino</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cepDestino}
                  onChange={(evento) => setCepDestino(evento.target.value)}
                  placeholder="Ex.: 82510-000"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-stone-700">Serviço dos Correios</label>
                <select
                  value={servicoFrete}
                  onChange={(evento) => setServicoFrete(evento.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-500"
                >
                  <option value="pac">PAC</option>
                  <option value="sedex">SEDEX</option>
                </select>
              </div>

              {erroFrete && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
                  {erroFrete}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setModalFreteAberto(false)} className="flex-1 rounded-xl border border-stone-300 px-4 py-3 text-sm font-black uppercase tracking-[0.22em] text-stone-700 hover:bg-stone-100">
                  Voltar
                </button>
                <button type="submit" disabled={calculandoFrete} className="flex-1 rounded-xl bg-amber-400 px-4 py-3 text-sm font-black uppercase tracking-[0.22em] text-black hover:bg-amber-500 disabled:opacity-70">
                  {calculandoFrete ? 'Calculando...' : 'Calcular'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mensagemSacola && (
        <div className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 rounded-lg bg-stone-900 px-4 py-3 text-center text-sm font-medium text-white shadow-xl">
          {mensagemSacola}
        </div>
      )}
    </header>
  );
}
