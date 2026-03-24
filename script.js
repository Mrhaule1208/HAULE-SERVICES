// script.js
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileBtn = document.querySelector('.mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  const navBtns = document.querySelector('.nav-buttons');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      navBtns.style.display = navBtns.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // Dynamic copyright year
  const yearSpan = document.getElementById('copyright');
  if (yearSpan) {
    yearSpan.innerHTML = `&copy; ${new Date().getFullYear()} Mr. Haule Services. Elimu na Maisha yako tunayasimamia kwa usalama kabisa.`;
  }

  // Form validation and WhatsApp submission
  const form = document.getElementById('serviceForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const service = document.getElementById('serviceSelect').value;
      const details = document.getElementById('details').value.trim();

      // Clear previous errors
      document.querySelectorAll('.error').forEach(el => el.textContent = '');

      let isValid = true;

      // Full name (at least 2 words)
      if (fullName.split(/\s+/).filter(w => w.length > 0).length < 2) {
        document.getElementById('nameError').textContent = 'Full name must contain at least two words';
        isValid = false;
      }

      // Email format
      const emailPattern = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
      if (!emailPattern.test(email)) {
        document.getElementById('emailError').textContent = 'Enter a valid email address';
        isValid = false;
      }

      // Phone format +255XXXXXXXXX
      const phonePattern = /^\+255[0-9]{9}$/;
      if (!phonePattern.test(phone)) {
        document.getElementById('phoneError').textContent = 'Phone must be +255 followed by 9 digits';
        isValid = false;
      }

      if (!service) {
        document.getElementById('serviceError').textContent = 'Please select a service';
        isValid = false;
      }

      if (!isValid) return;

      // Build WhatsApp message
      let message = `📋 *NEW SERVICE REQUEST - Mr. Haule Services*%0A`;
      message += `━━━━━━━━━━━━━━━━━━━━%0A`;
      message += `👤 *Full Name:* ${fullName}%0A`;
      message += `📧 *Email:* ${email}%0A`;
      message += `📞 *Phone:* ${phone}%0A`;
      message += `🛠️ *Service:* ${service}%0A`;
      if (details) message += `📝 *Details:* ${details}%0A`;
      message += `━━━━━━━━━━━━━━━━━━━━%0A`;
      message += `✅ Request sent via website form%0A`;
      message += `⏳ We'll respond within 15 minutes.`;

      const whatsappUrl = `https://wa.me/255625568661?text=${message}`;
      window.open(whatsappUrl, '_blank');

      // 3D toast effect (simple alert)
      alert('✅ Request sent! You will be redirected to WhatsApp to confirm.');

      form.reset();
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});

// Chatbot functions (global)
function toggleChat() {
  const body = document.getElementById('chatbotBody');
  const icon = document.querySelector('.chatbot-header i:last-child');
  if (body.style.display === 'none') {
    body.style.display = 'flex';
    icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
  } else {
    body.style.display = 'none';
    icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
  }
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  const messages = document.getElementById('chatMessages');
  messages.innerHTML += `<div class="message user">${escapeHtml(msg)}</div>`;
  input.value = '';
  messages.scrollTop = messages.scrollHeight;
  setTimeout(() => {
    const reply = getAIResponse(msg.toLowerCase());
    messages.innerHTML += `<div class="message bot">${reply}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }, 500);
}

function getAIResponse(msg) {
  if (msg.includes('heslb')) return "HESLB Support: We help with loan applications, corrections, document verification, and step‑by‑step guidance. Fee TSh 10,000.";
  if (msg.includes('rita')) return "RITA Support: We assist with birth certificates, death certificates, corrections, and tracking. Fee TSh 5,000–10,000.";
  if (msg.includes('nida')) return "NIDA Support: We help with NIDA registration, corrections, and obtaining your NIDA number. Fee TSh 5,000.";
  if (msg.includes('payment') || msg.includes('malipo')) return "Payment methods: VODA LIPA 59183849, TIGO LIPA 45198490, AIRTEL LIPA 65525676, HALOPESA +255625568661. Receiver: AMANI ERASMUCE HAULE.";
  return "Thank you for your message! Please visit our Dashboard or WhatsApp us for more details. Is there a specific service you'd like to know about?";
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initial state (chatbot body visible)
document.getElementById('chatbotBody').style.display = 'flex';