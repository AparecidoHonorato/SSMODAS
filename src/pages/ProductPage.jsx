import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { fotosSalvas } from '../data/products';

const nomesDestaques = [
  'Vestido Isabela',
  'Vestido Any',
  'Vestido Viviane',
  'Vestido Lara',
  'Vestido Polly',
  'Vestido Gleice Plus',
  'Vestido Katia',
  'Vestido Ketlen Plus',
  'Vestido Ana',
  'Vestido Estela',
  'Vestido Kelly',
];

const destaques = fotosSalvas.map((imagem, indice) => ({
  imagem,
  titulo: nomesDestaques[indice],
}));

export default function ProductPage() {
  const [destaqueAtual, setDestaqueAtual] = useState(0);

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setDestaqueAtual((atual) => (atual + 1) % destaques.length);
    }, 4500);

    return () => window.clearInterval(intervalo);
  }, []);

  const mudarDestaque = (direcao) => {
    setDestaqueAtual((atual) => (atual + direcao + destaques.length) % destaques.length);
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-4xl px-5 pb-10">
      <section className="relative mb-8 mt-0 h-[24rem] w-full overflow-hidden rounded-b-xl bg-stone-900 shadow-[0_24px_45px_-28px_rgba(92,64,35,0.55),inset_0_-100px_100px_-70px_rgba(0,0,0,0.85)] sm:h-[30rem]">
        <img
          src={destaques[destaqueAtual].imagem}
          alt={destaques[destaqueAtual].titulo}
          className="banner-motion h-full w-full object-cover object-top opacity-65 transition-opacity duration-700"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-300">Nova coleção</p>
            <h2 className="max-w-sm text-xl font-medium leading-tight text-white sm:text-2xl">
              {destaques[destaqueAtual].titulo}
            </h2>
          </div>
        </div>
        <button
          type="button"
          onClick={() => mudarDestaque(-1)}
          aria-label="Imagem anterior"
          className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur transition-colors hover:bg-amber-400 hover:text-black"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => mudarDestaque(1)}
          aria-label="Próxima imagem"
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur transition-colors hover:bg-amber-400 hover:text-black"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="absolute bottom-3 right-5 flex gap-1.5" aria-label="Selecionar imagem">
          {destaques.map((destaque, indice) => (
            <button
              key={destaque.imagem}
              type="button"
              onClick={() => setDestaqueAtual(indice)}
              aria-label={`Mostrar imagem ${indice + 1}`}
              className={`h-1.5 rounded-full transition-all ${indice === destaqueAtual ? 'w-5 bg-amber-300' : 'w-1.5 bg-white/60'}`}
            />
          ))}
        </div>
      </section>

      <button
        onClick={() => window.dispatchEvent(new Event('open-shopping-bag'))}
        className="sticky bottom-4 mx-auto mt-5 flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-black shadow-lg shadow-black/30 transition-transform hover:scale-[1.02]"
      >
        <ShoppingBag className="h-4 w-4" />
        Ver sacola
      </button>
    </main>
  );
}
