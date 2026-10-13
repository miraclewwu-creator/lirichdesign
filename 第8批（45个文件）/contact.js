const contactForm = document.querySelector('.contact-form');
const contactStatus = document.querySelector('.contact-form-status');
const draftLink = document.querySelector('.contact-draft-link');

contactForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const fields = new FormData(contactForm);
  const subject = `[${fields.get('inquiryType')}] ${fields.get('subjectField')}`;
  const body = [
    `Name: ${fields.get('fullName')}`, `Email: ${fields.get('email')}`,
    `Company: ${fields.get('companyName') || '—'}`, `Country: ${fields.get('country')}`,
    `Referral: ${fields.get('referralSource') || '—'}`, '', fields.get('message') || '',
  ].join('\n');
  draftLink.href = `mailto:info@lirichdesign.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  draftLink.hidden = false;
  contactStatus.textContent = 'Your draft is ready. Open it in your email app and send it there. Nothing has been sent from this website. If no email app opens, email info@lirichdesign.com directly.';
  draftLink.focus();
});
