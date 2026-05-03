/**
 * Single source of truth for SWN Studio contact channels.
 * Update once, applied everywhere.
 */
export const WHATSAPP_NUMBER = '5511999999999'; // TODO: substituir pelo nº real
export const EMAIL = 'contato@swnstudio.com';
export const INSTAGRAM = 'https://instagram.com/swnstudio';
export const LINKEDIN  = 'https://linkedin.com/company/swnstudio';
export const YOUTUBE   = 'https://youtube.com/@swnstudio';
export const SITE_URL  = 'https://swnstudio.com';

export const buildWhatsAppLink = (text = '') => {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
};
