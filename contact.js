import "/assets/site-effects-BGUe-mGV.js";
import "/assets/script-Bqn--cBF.js";
const contactForm = document.querySelector('.contact-form');
const contactStatus = document.querySelector('.contact-form-status');
const draftLink = document.querySelector('.contact-draft-link');
const requiredFields = contactForm?.querySelectorAll('.contact-fields [required]') || [];

function validateField(field) {
  field.setCustomValidity(field.value.trim() ? '' : 'Please complete this field.');
}

function createInquiryDraft(fields) {
  const rows = [
    ['Inquiry type', fields.inquiryType],
    ['Full Name', fields.fullName],
    ['Email', fields.email],
    ['Company', fields.companyName],
    ['Country', fields.country],
    ['How did you hear about us?', fields.referralSource],
    ['Subject', fields.subjectField],
    ['Message', fields.message],
  ];
  const width = Math.max(...rows.map(([label]) => label.length));
  const divider = '-'.repeat(width) + '-+--------------------------------';
  const body = [
    'LIRICH STUDIO — Contact Inquiry', '', divider,
    ...rows.flatMap(([label, value]) => [
      ...value.replace(/\r\n?/g, '\n').split('\n').map((line, index) =>
        `${(index === 0 ? label : '').padEnd(width)} | ${line}`),
      divider,
    ]),
  ].join('\r\n');
  const subject = `[${fields.inquiryType}] ${fields.subjectField.replace(/[\r\n]+/g, ' ')}`;
  return `mailto:info@lirichdesign.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

contactForm?.addEventListener('input', event => {
  if (event.target.matches('.contact-fields [required]')) validateField(event.target);
  draftLink.hidden = true;
  draftLink.removeAttribute('href');
  contactStatus.textContent = '';
});

contactForm?.addEventListener('submit', event => {
  event.preventDefault();
  requiredFields.forEach(validateField);
  if (!contactForm.reportValidity()) return;
  const fields = Object.fromEntries(new FormData(contactForm));
  for (const key of Object.keys(fields)) fields[key] = fields[key].trim();
  draftLink.href = createInquiryDraft(fields);
  draftLink.hidden = false;
  contactStatus.textContent = 'Your email draft includes all your details. Send it from your email app. If it does not open, check your default email app and select Open Email Draft below.';
  draftLink.click();
});
