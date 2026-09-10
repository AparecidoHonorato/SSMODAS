const imagemLocal = (nome) => `${import.meta.env.BASE_URL}${encodeURIComponent(nome)}`;

export const fotosSalvas = [
  'WhatsApp Image 2026-09-10 at 17.20.12.jpeg',
  'WhatsApp Image 2026-09-10 at 17.20.12 (1).jpeg',
  'WhatsApp Image 2026-09-10 at 17.20.12 (2).jpeg',
  'WhatsApp Image 2026-09-10 at 17.20.12 (3).jpeg',
  'WhatsApp Image 2026-09-10 at 17.20.12 (4).jpeg',
  'WhatsApp Image 2026-09-10 at 17.20.12 (5).jpeg',
  'WhatsApp Image 2026-09-10 at 17.20.13.jpeg',
  'WhatsApp Image 2026-09-10 at 17.20.13 (1).jpeg',
  'WhatsApp Image 2026-09-10 at 17.20.13 (2).jpeg',
  'WhatsApp Image 2026-09-10 at 17.20.13 (3).jpeg',
  'WhatsApp Image 2026-09-10 at 17.20.14.jpeg',
].map(imagemLocal);

export const produtos = [
  { nome: 'Vestido Isabela', tamanho: 'M', preco: 'R$ 146,99', imagem: fotosSalvas[0] },
  { nome: 'Vestido Any', tamanho: 'M', preco: 'R$ 146,99', imagem: fotosSalvas[1] },
  { nome: 'Vestido Viviane', tamanho: '44', preco: 'R$ 175,99', imagem: fotosSalvas[2] },
  { nome: 'Vestido Lara', tamanho: '48', preco: 'R$ 175,99', imagem: fotosSalvas[3] },
  { nome: 'Vestido Polly', tamanho: '46', preco: 'R$ 181,99', imagem: fotosSalvas[4] },
  { nome: 'Vestido Gleice plus', tamanho: '52', preco: 'R$ 185,99', imagem: fotosSalvas[5] },
  { nome: 'Vestido Katia', tamanho: '44', preco: 'R$ 181,99', imagem: fotosSalvas[6] },
  { nome: 'Vestido Ketlen Plus', tamanho: '52', preco: 'R$ 191,99', imagem: fotosSalvas[7] },
  { nome: 'Vestido Ana', tamanho: '46', preco: 'R$ 191,99', imagem: fotosSalvas[8] },
  { nome: 'Vestido Estela', tamanho: '44', preco: 'R$ 191,99', imagem: fotosSalvas[9] },
  { nome: 'Vestido Kelly', tamanho: '48', preco: 'R$ 191,99', imagem: fotosSalvas[10] },
];
