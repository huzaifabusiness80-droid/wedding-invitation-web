/**
 * RSVP Modal & Form Submission Handler
 */
const RSVPController = (() => {
  let modalOverlay = null;
  let rsvpTrigger = null;
  let closeBtn = null;
  let rsvpForm = null;
  let successView = null;
  let formContainer = null;

  function init() {
    modalOverlay = document.getElementById('rsvp-modal');
    rsvpTrigger = document.getElementById('rsvp-seal-trigger');
    closeBtn = document.getElementById('rsvp-close-btn');
    rsvpForm = document.getElementById('wedding-rsvp-form');
    successView = document.getElementById('rsvp-success-view');
    formContainer = document.getElementById('rsvp-form-container');

    if (!modalOverlay) return;

    if (rsvpTrigger) {
      rsvpTrigger.addEventListener('click', openModal);
      rsvpTrigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });

    if (rsvpForm) {
      rsvpForm.addEventListener('submit', handleFormSubmit);
    }
  }

  function openModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(rsvpForm);
    const guestName = formData.get('guest_name');
    const attendance = formData.get('attendance');
    const guestCount = formData.get('guest_count');
    const song = formData.get('song_request');
    const children = formData.get('children_info');
    const message = formData.get('message');

    if (!guestName || !guestName.trim()) {
      alert('Please enter your name.');
      return;
    }

    if (!attendance) {
      alert('Please select whether you will be attending.');
      return;
    }

    const submission = {
      guestName: guestName.trim(),
      attendance,
      guestCount: guestCount || '1',
      song: song || '',
      children: children || '',
      message: message || '',
      submittedAt: new Date().toISOString()
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
      existing.push(submission);
      localStorage.setItem('wedding_rsvps', JSON.stringify(existing));
    } catch (err) {
      console.warn('Could not store RSVP locally:', err);
    }

    // Switch to success view
    if (formContainer && successView) {
      formContainer.style.display = 'none';
      successView.classList.add('active');

      const namePlaceholder = document.getElementById('success-guest-name');
      if (namePlaceholder) {
        namePlaceholder.textContent = guestName;
      }
    }
  }

  return {
    init,
    openModal,
    closeModal
  };
})();
