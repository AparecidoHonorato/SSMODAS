import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  return (
    <a
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-2xl shadow-emerald-900/30 transition-transform duration-300 hover:scale-110 hover:bg-[#1fb85a]"
      href="https://wa.me/5566996075729?text=Ol%C3%A1%2C%20quero%20conferir%20as%20cole%C3%A7%C3%B5es%20da%20SSmoment%27s."
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com a loja no WhatsApp"
      title="Falar com a loja no WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
