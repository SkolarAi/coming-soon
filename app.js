window.addEventListener('DOMContentLoaded', () => {
  // Icons + footer year
  if (window.lucide && lucide.createIcons) lucide.createIcons();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Modal logic
  const modal   = document.getElementById('applyModal');
  const openers = [document.getElementById('applyTop'),
                   document.getElementById('applyCta'),
                   document.getElementById('getProspectus')];
  const closeBtn = document.getElementById('closeModal');

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
  };

  openers.forEach(btn => btn && btn.addEventListener('click', () => {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  // AJAX submit with in-panel status + auto-close
  const form   = document.getElementById('applyForm');
  const status = document.getElementById('applyStatus');
  const submit = document.getElementById('applySubmit');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!submit || !status) return form.submit(); // fallback

    status.innerHTML = '';
    submit.disabled = true;
    const originalLabel = submit.textContent;
    submit.textContent = 'Sending…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        status.innerHTML = `
          <div class="notice success">
            ✅ Application submitted! We’ll contact you soon.
          </div>`;
        form.reset();

        setTimeout(() => {
          closeModal();
          status.innerHTML = '';
          submit.disabled = false;
          submit.textContent = originalLabel;
        }, 1600);
      } else {
        const err = await res.json().catch(() => ({}));
        status.innerHTML = `
          <div class="notice error">
            ⚠️ ${err?.errors?.[0]?.message || 'Submission failed. Please try again.'}
          </div>`;
        submit.disabled = false;
        submit.textContent = originalLabel;
      }
    } catch (error) {
      console.error(error);
      status.innerHTML = `
        <div class="notice error">
          ⚠️ Network error. Please try again later.
        </div>`;
      submit.disabled = false;
      submit.textContent = originalLabel;
    }
  });
});
