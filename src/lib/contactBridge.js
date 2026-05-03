/**
 * Cross-component bridge for the Contact form.
 * Lets any CTA pre-fill the "Interesse" select before scrolling to #contact.
 */
const EVENT = 'swn:contact-prefill';

export const prefillContactInterest = (interest) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { interest } }));
};

export const onContactPrefill = (handler) => {
  if (typeof window === 'undefined') return () => {};
  const listener = (e) => handler(e.detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
};
