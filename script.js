// ========== MR. HAULE ORGANIZATION - MAIN SCRIPT ==========
// Premium Features: 3D Popups, Animations, Firebase Integration, Language Switcher

// ========== SERVICE DATA ==========
const servicesData = {
    sw: [
        { id: 1, name: "🎓 HESLB", desc: "Maombi ya Mkopo, Marekebisho, Uhakiki wa nyaraka", icon: "fa-graduation-cap", color: "#00ffff" },
        { id: 2, name: "🪪 NIDA", desc: "Usajili wa NIDA, Marekebisho ya taarifa", icon: "fa-id-card", color: "#00ff88" },
        { id: 3, name: "📄 RITA", desc: "Vyeti vya Kuzaliwa, Kifo, Marekebisho", icon: "fa-file-alt", color: "#ffd700" },
        { id: 4, name: "🏫 VYUO", desc: "Maombi ya udahili, Uchaguzi wa kozi", icon: "fa-university", color: "#ff6b6b" },
        { id: 5, name: "📝 ASSIGNMENTS", desc: "Field Report, Research, Presentations", icon: "fa-pen-fancy", color: "#c084fc" },
        { id: 6, name: "💻 COMPUTER MAINTENANCE", desc: "Kupiga Windows, Kuformat, Antivirus", icon: "fa-laptop-code", color: "#f97316" },
        { id: 7, name: "🔧 IT SUPPORT", desc: "Kurepair files, Kuongeza speed, Backup", icon: "fa-tools", color: "#ec4899" },
        { id: 8, name: "📊 FIELD REPORT", desc: "Mwongozo na usaidizi wa Field Report", icon: "fa-chart-line", color: "#14b8a6" }
    ],
    en: [
        { id: 1, name: "🎓 HESLB", desc: "Loan Applications, Corrections, Document Verification", icon: "fa-graduation-cap", color: "#00ffff" },
        { id: 2, name: "🪪 NIDA", desc: "NIDA Registration, Information Correction", icon: "fa-id-card", color: "#00ff88" },
        { id: 3, name: "📄 RITA", desc: "Birth Certificates, Death Certificates, Corrections", icon: "fa-file-alt", color: "#ffd700" },
        { id: 4, name: "🏫 COLLEGES", desc: "Admission Applications, Course Selection", icon: "fa-university", color: "#ff6b6b" },
        { id: 5, name: "📝 ASSIGNMENTS", desc: "Field Report, Research, Presentations", icon: "fa-pen-fancy", color: "#c084fc" },
        { id: 6, name: "💻 COMPUTER MAINTENANCE", desc: "Windows Installation, Format, Antivirus", icon: "fa-laptop-code", color: "#f97316" },
        { id: 7, name: "🔧 IT SUPPORT", desc: "File Repair, Speed Boost, Backup", icon: "fa-tools", color: "#ec4899" },
        { id: 8, name: "📊 FIELD REPORT", desc: "Guidance and Support for Field Reports", icon: "fa-chart-line", color: "#14b8a6" }
    ]
};

// ========== GLOBAL VARIABLES ==========
let currentLang = 'sw';
let currentUser = null;

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initParticleBackground();
    initScrollProgress();
    initLanguageSwitcher();
    loadServices();
    initTypingAnimation();
    checkAuthStatus();
    initMobileMenu();
});

// ========== PARTICLE BACKGROUND (3D Effect) ==========
function initParticleBackground() {
    const canvas = document.getElementById('particles-bg');
    if(!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particles = [];
    const particleCount = 80;
    
    for(let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.8,
            speedY: (Math.random() - 0.5) * 0.8,
            opacity: Math.random() * 0.5 + 0.2,
            color: `hsl(${Math.random() * 60 + 180}, 100%, 60%)`
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            
            if(p.x < 0) p.x = canvas.width;
            if(p.x > canvas.width) p.x = 0;
            if(p.y < 0) p.y = canvas.height;
            if(p.y > canvas.height) p.y = 0;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // Add glow effect
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ========== SCROLL PROGRESS BAR ==========
function initScrollProgress() {
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById('progressBar');
        if(progressBar) progressBar.style.width = scrolled + '%';
    });
}

// ========== LANGUAGE SWITCHER ==========
function initLanguageSwitcher() {
    const langBtns = document.querySelectorAll('.lang-btn');
    
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentLang = btn.dataset.lang;
            
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update all elements with data-key
            document.querySelectorAll('[data-key]').forEach(el => {
                const key = el.dataset.key;
                const translation = getTranslation(key);
                if(translation) el.textContent = translation;
            });
            
            // Reload services with new language
            loadServices();
            
            // Store language preference
            localStorage.setItem('preferredLang', currentLang);
        });
    });
    
    // Load saved language
    const savedLang = localStorage.getItem('preferredLang');
    if(savedLang && savedLang !== currentLang) {
        document.querySelector(`.lang-btn[data-lang="${savedLang}"]`)?.click();
    }
}

function getTranslation(key) {
    const translations = {
        sw: {
            home: 'Nyumbani', services: 'Huduma', login: 'Ingia', register: 'Jisajili',
            dashboard: 'Dashboard', heroDesc: 'Huduma za Kitaaluma na Kiteknolojia kwa uaminifu, haraka na ubora wa hali ya juu.',
            exploreBtn: 'Gundua Huduma Zetu', ourServices: '📋 HUDUMA ZETU',
            servicesDesc: 'Chagua huduma unayohitaji, tutakusaidia kwa weledi na uaminifu.',
            whyUs: '⭐ KWANINI UCHAGUE SISI?', fast: 'Huduma ya haraka ⚡',
            secure: 'Uaminifu na usiri 🔒', affordable: 'Gharama nafuu 💰',
            professional: 'Huduma bora na weledi 👨‍💻',
            clientsServed: 'Wateja Wamehudumiwa', support: 'Msaada wa Muda wote',
            satisfaction: 'Uridhishaji wa Wateja', contact: 'Wasiliana Nasi',
            workingHours: 'Saa za Kufungua', close: 'Funga', requestBtn: 'Omba Huduma'
        },
        en: {
            home: 'Home', services: 'Services', login: 'Login', register: 'Register',
            dashboard: 'Dashboard', heroDesc: 'Professional and Technological Services with trust, speed and quality.',
            exploreBtn: 'Explore Our Services', ourServices: '📋 OUR SERVICES',
            servicesDesc: 'Choose the service you need, we will help you with professionalism and trust.',
            whyUs: '⭐ WHY CHOOSE US?', fast: 'Fast Service ⚡',
            secure: 'Trust and Confidentiality 🔒', affordable: 'Affordable Prices 💰',
            professional: 'Professional Service 👨‍💻',
            clientsServed: 'Clients Served', support: '24/7 Support',
            satisfaction: 'Client Satisfaction', contact: 'Contact Us',
            workingHours: 'Working Hours', close: 'Close', requestBtn: 'Request Service'
        }
    };
    
    return translations[currentLang]?.[key] || key;
}

// ========== LOAD SERVICES ==========
function loadServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    if(!servicesGrid) return;
    
    const services = servicesData[currentLang] || servicesData.sw;
    
    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card" onclick="showServiceModal(${service.id})">
            <div class="service-icon">
                <i class="fas ${service.icon}" style="color: ${service.color}; font-size: 2.5rem;"></i>
            </div>
            <h3>${service.name}</h3>
            <p>${service.desc}</p>
            <button class="btn btn-primary" style="margin-top: 15px; padding: 8px 20px; font-size: 0.9rem;">
                ${currentLang === 'sw' ? 'Omba Sasa →' : 'Apply Now →'}
            </button>
        </div>
    `).join('');
}

// ========== 3D SERVICE MODAL ==========
function showServiceModal(serviceId) {
    const services = servicesData[currentLang] || servicesData.sw;
    const service = services.find(s => s.id === serviceId);
    
    if(!service) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.style.animation = 'fadeIn 0.3s ease';
    
    modal.innerHTML = `
        <div class="modal-content" style="text-align: center; max-width: 450px;">
            <i class="fas ${service.icon}" style="font-size: 4rem; color: ${service.color}; margin-bottom: 15px;"></i>
            <h3 style="color: ${service.color};">${service.name}</h3>
            <p style="margin: 20px 0; line-height: 1.6;">${service.desc}</p>
            
            ${currentUser ? `
                <form id="serviceRequestForm">
                    <textarea id="requestDetails" placeholder="${currentLang === 'sw' ? 'Maelezo ya ziada (hiari)' : 'Additional details (optional)'}" 
                              style="width: 100%; padding: 12px; margin: 10px 0; background: rgba(255,255,255,0.1); border-radius: 12px; color: #fff;"></textarea>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        <i class="fas fa-paper-plane"></i> ${currentLang === 'sw' ? 'Tuma Ombi' : 'Submit Request'}
                    </button>
                </form>
            ` : `
                <p style="margin: 20px 0; color: #ffd700;">
                    <i class="fas fa-lock"></i> ${currentLang === 'sw' ? 'Tafadhali ingia kwanza ili kuomba huduma' : 'Please login first to request service'}
                </p>
                <button class="btn btn-primary" onclick="window.location.href='login.html'">
                    <i class="fas fa-sign-in-alt"></i> ${currentLang === 'sw' ? 'Ingia Sasa' : 'Login Now'}
                </button>
            `}
            
            <button class="btn btn-secondary" style="margin-top: 10px;" onclick="this.closest('.modal').remove()">
                <i class="fas fa-times"></i> ${currentLang === 'sw' ? 'Funga' : 'Close'}
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle service request form submission
    const form = modal.querySelector('#serviceRequestForm');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const details = modal.querySelector('#requestDetails')?.value || '';
            
            // Save request to localStorage
            const requests = JSON.parse(localStorage.getItem('serviceRequests') || '[]');
            requests.push({
                serviceId: service.id,
                serviceName: service.name,
                details: details,
                date: new Date().toLocaleString(),
                status: 'Pending'
            });
            localStorage.setItem('serviceRequests', JSON.stringify(requests));
            
            modal.remove();
            showToast3D(currentLang === 'sw' ? '✅ Ombi limepokelewa! Tutawasiliana nawe hivi karibuni.' : '✅ Request received! We will contact you soon.');
        });
    }
}

// ========== 3D TOAST NOTIFICATION ==========
function showToast3D(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    toast.style.transform = 'translateX(400px)';
    toast.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    document.body.appendChild(toast);
    
    setTimeout(() => { toast.style.transform = 'translateX(0)'; }, 10);
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== TYPING ANIMATION ==========
function initTypingAnimation() {
    const typingElement = document.getElementById('typingText');
    if(!typingElement) return;
    
    const phrases = {
        sw: ['MR. HAULE ORGANIZATION', 'Huduma za Kitaaluma', 'Huduma za Kiteknolojia', 'Ubora Kila Siku'],
        en: ['MR. HAULE ORGANIZATION', 'Academic Services', 'Technology Services', 'Quality Every Day']
    };
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        const currentPhrases = phrases[currentLang] || phrases.sw;
        const currentPhrase = currentPhrases[phraseIndex];
        
        if(isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if(!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
            return;
        }
        
        if(isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % currentPhrases.length;
            setTimeout(typeEffect, 500);
            return;
        }
        
        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
    
    typeEffect();
}

// ========== CHECK AUTH STATUS ==========
function checkAuthStatus() {
    // Check if user is logged in from localStorage/sessionStorage
    const loggedIn = localStorage.getItem('userLoggedIn') || sessionStorage.getItem('userLoggedIn');
    if(loggedIn === 'true') {
        currentUser = {
            email: localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail'),
            name: localStorage.getItem('userName') || sessionStorage.getItem('userName')
        };
    }
}

// ========== SCROLL TO SERVICES ==========
function scrollToServices() {
    const servicesSection = document.getElementById('servicesSection');
    if(servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ========== MOBILE MENU ==========
function initMobileMenu() {
    // Add mobile menu toggle for small screens
    const navMenu = document.querySelector('.nav-menu');
    if(navMenu && window.innerWidth <= 768) {
        const menuBtn = document.createElement('button');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.style.cssText = 'background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer;';
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
        
        const headerContent = document.querySelector('.header-content');
        if(headerContent && !document.querySelector('.menu-toggle')) {
            menuBtn.classList.add('menu-toggle');
            headerContent.appendChild(menuBtn);
        }
    }
}

// ========== EXPOSE GLOBAL FUNCTIONS ==========
window.showServiceModal = showServiceModal;
window.scrollToServices = scrollToServices;
window.showToast3D = showToast3D;
window.closeModal = function() {
    const modal = document.querySelector('.modal');
    if(modal) modal.remove();
};
window.requestService = function() {
    const modal = document.querySelector('.modal');
    if(modal) {
        const form = modal.querySelector('#serviceRequestForm');
        if(form) {
            const event = new Event('submit');
            form.dispatchEvent(event);
        }
    }
};

// ========== SMOOTH SCROLL FOR ALL LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if(href && href !== '#') {
            const target = document.querySelector(href);
            if(target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

console.log('✅ MR. HAULE ORGANIZATION - Website Imepakia Vizuri!');