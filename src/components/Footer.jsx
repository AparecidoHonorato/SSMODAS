import React from 'react';
import { Clock3, Globe, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-[#f8f3ea] text-stone-700">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-serif italic tracking-[-0.12em] text-amber-500" aria-hidden="true">
                S<span className="font-light">/</span>S
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold tracking-[0.12em] text-stone-900">SSmoment's</h2>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber-600">Moda Moderna</span>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-stone-500">
              Moda modesta, elegante e confortável para seus momentos especiais.
            </p>
          </section>

          <section>
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-stone-900">Loja</h3>
            <ul className="space-y-3 text-sm">
              <li><a className="hover:text-amber-700" href="#">Coleções</a></li>
              <li><a className="hover:text-amber-700" href="#">Lookbook</a></li>
              <li><a className="hover:text-amber-700" href="#">Guia de tamanhos</a></li>
              <li><a className="hover:text-amber-700" href="#">Promoções</a></li>
            </ul>
          </section>

          <section>
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-stone-900">Atendimento</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-700" />
                <a className="hover:text-amber-700" href="tel:+5566996075729">+55 (66) 99607-5729</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-700" />
                <span>R. da Carnaúba, 238<br />Colombo - PR</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-amber-700" />
                <span>Segunda a Sábado<br />08h30 - 18h30</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-stone-900">Redes sociais</h3>
            <div className="flex gap-3">
              <a className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 transition hover:bg-amber-500 hover:text-white" href="https://www.instagram.com/ssmoments_modafeminina" target="_blank" rel="noreferrer" aria-label="Instagram">
                <Globe className="h-4 w-4" />
              </a>
              <a className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 transition hover:bg-amber-500 hover:text-white" href="https://www.facebook.com/share/1BfPDuGoGB/" target="_blank" rel="noreferrer" aria-label="Facebook">
                <Mail className="h-4 w-4" />
              </a>
              <a className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 transition hover:bg-amber-500 hover:text-white" href="https://wa.me/5566996075729" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
            <a className="mt-5 inline-flex rounded-full border border-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-800 transition hover:bg-amber-500 hover:text-white" href="https://wa.me/5566996075729?text=Ol%C3%A1%2C%20quero%20conferir%20as%20cole%C3%A7%C3%B5es%20da%20SSmoment%27s.">
              Falar no WhatsApp
            </a>
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-stone-200 pt-6 text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 md:flex-row md:items-center md:justify-between">
          <span>© 2026 SSmoment's · Moda Moderna</span>
          <span>Atendimento online e loja física</span>
        </div>
      </div>
    </footer>
  );
}
