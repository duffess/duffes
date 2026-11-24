// Dados de contato (mesmos de duffes/src/v3/data.ts).
export const WHATSAPP_NUMBER = '5521992217782';
export const WHATSAPP_DISPLAY = '(21) 99221-7782';
export const DEFAULT_WA_MESSAGE = 'Olá! Quero conversar sobre um site para o meu negócio.';
export const DEFAULT_WA_MESSAGE_EN = "Hi! I'd like to talk about a website for my business.";

export function waLink(message = DEFAULT_WA_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const COLORS = {
  creme: '#e8d2b5',
  creme2: '#dec3a0',
  vinho: '#590907',
  vinho2: '#420504',
  tinta: '#1c1a17',
  salvia: '#789575',
  estudio: '#0d0b0a',
};
