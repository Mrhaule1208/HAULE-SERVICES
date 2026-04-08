// ========== MR. HAULE ORGANIZATION - MAIN SCRIPT ==========
let currentLang = 'sw';
let currentUser = null;

// Service Data
const servicesData = {
    sw: [
        { id: 1, name: "🎓 HESLB", desc: "Maombi ya Mkopo, Marekebisho, Uhakiki wa nyaraka", icon: "fa-graduation-cap", color: "#ffffff",
          fullDetails: { overview: "Huduma ya HESLB inakusaidia kufanikiwa kupata mkopo wa elimu ya juu kwa urahisi.", steps: ["Kukusanya nyaraka zote muhimu", "Kukusaidia kujaza fomu za mkopo online", "Kufanya marekebisho ya taarifa", "Kufuatilia status ya maombi yako", "Kukupa mwongozo wa hatua kwa hatua"], requirements: ["Form ya kujiunga chuo", "Vyeti vya darasa la saba na nne", "Barua ya kuzaliwa", "Namba ya NIDA"], price: "Tsh 5,000 - 15,000", contact: "+255 625 568 661" } },
        { id: 2, name: "🪪 NIDA", desc: "Usajili wa NIDA, Marekebisho ya taarifa", icon: "fa-id-card", color: "#ffffff",
          fullDetails: { overview: "Usajili wa NIDA na marekebisho ya taarifa zako.", steps: ["Kukusanya nyaraka muhimu", "Kujaza fomu za usajili", "Kufuatilia usajili wako", "Marekebisho ya taarifa", "Kupata Namba ya NIDA"], requirements: ["Barua ya kuzaliwa", "Kitambulisho cha shule au kazi", "Picha passport size"], price: "Tsh 5,000", contact: "+255 625 568 661" } },
        { id: 3, name: "📄 RITA", desc: "Vyeti vya Kuzaliwa, Kifo, Marekebisho", icon: "fa-file-alt", color: "#ffffff",
          fullDetails: { overview: "Kukusaidia kupata vyeti mbalimbali kutoka RITA.", steps: ["Kujaza fomu za maombi ya cheti", "Kukusanya taarifa za mwombaji", "Kufuatilia maombi", "Kukusaidia marekebisho ya makosa", "Kupata cheti kwa haraka"], requirements: ["Taarifa kamili za mwombaji", "Namba ya nida kwa mzazi"], price: "Tsh 5,000 - 10,000", contact: "+255 625 568 661" } },
        { id: 4, name: "🏫 VYUO", desc: "Maombi ya udahili, Uchaguzi wa kozi", icon: "fa-university", color: "#ffffff",
          fullDetails: { overview: "Kukusaidia kuchagua chuo na kozi sahihi.", steps: ["Tathmini ya alama zako", "Kukusaidia kuchagua kozi", "Kukusaidia kujaza fomu za udahili", "Kufuatilia maombi", "Mwongozo wa usaili"], requirements: ["Vyeti vya darasa la saba, nne, na sita", "Alama za kidato cha sita au nne", "Barua ya kuzaliwa"], price: "Tsh 5000", contact: "+255 625 568 661" } },
        { id: 5, name: "📝 ASSIGNMENTS", desc: "Field Report, Research, Presentations", icon: "fa-pen-fancy", color: "#ffffff",
          fullDetails: { overview: "Kukusaidia kuandika kazi za kitaaluma kwa ubora.", steps: ["Kuelewa mada na mahitaji", "Kukusanya data", "Kuandika rasimu", "Kusahihisha", "Kutoa toleo la mwisho"], requirements: ["Maelekezo ya kazi", "Tarehe ya mwisho"], price: "Kuanzia Tsh 500 kwa page", contact: "+255 625 568 661" } },
        { id: 6, name: "💻 COMPUTER MAINTENANCE", desc: "Kupiga Windows, Kuformat, Antivirus", icon: "fa-laptop-code", color: "#ffffff",
          fullDetails: { overview: "Huduma za matengenezo ya kompyuta na laptop.", steps: ["Kuchunguza tatizo", "Makadirio ya gharama", "Kufanya matengenezo", "Taarifa ya kazi", "Kukufundisha matumizi"], requirements: ["Kompyuta au laptop", "Backup ya data muhimu"], price: "Tsh 15,000 - 60,000", contact: "+255 625 568 661" } },
        { id: 7, name: "🔧 IT SUPPORT", desc: "Kurepair files, Kuongeza speed, Backup", icon: "fa-tools", color: "#ffffff",
          fullDetails: { overview: "Msaada wa kiteknolojia kwa matatizo yote.", steps: ["Kutambua tatizo", "Kutoa suluhisho la haraka", "Kurekebisha files", "Kuongeza speed", "Backup na restore"], requirements: ["Maelezo ya tatizo"], price: "Tsh 10,000 - 40,000", contact: "+255 625 568 661" } },
        { id: 8, name: "📊 FIELD REPORT", desc: "Mwongozo na usaidizi wa Field Report", icon: "fa-chart-line", color: "#ffffff",
          fullDetails: { overview: "Kukusaidia kuandika Field Report bora.", steps: ["Kuelewa eneo la field", "Kukusanya data", "Kuchambua data", "Kuandika report", "Kusahihisha na kukabidhi"], requirements: ["Maelekezo kutoka chuo", "Data au taarifa za field"], price: "Tsh 30,000 - 80,000", contact: "+255 625 568 661" } }
    ],
    en: [
        { id: 1, name: "🎓 HESLB", desc: "Loan Applications, Corrections, Document Verification", icon: "fa-graduation-cap", color: "#ffffff",
          fullDetails: { overview: "HESLB service helps you get higher education loans easily.", steps: ["Collect necessary documents", "Fill online loan forms", "Make corrections", "Track application status", "Step by step guidance"], requirements: ["College admission form", "Primary & secondary certificates", "Birth certificate", "NIDA number"], price: "Tsh 5,000 - 15,000", contact: "+255 625 568 661" } },
        { id: 2, name: "🪪 NIDA", desc: "NIDA Registration, Information Correction", icon: "fa-id-card", color: "#ffffff",
          fullDetails: { overview: "NIDA registration and correction of information.", steps: ["Collect required documents", "Fill registration forms", "Track registration", "Information corrections", "Get NIDA number"], requirements: ["Birth certificate", "School or work ID", "Passport photo"], price: "Tsh 5,000", contact: "+255 625 568 661" } },
        { id: 3, name: "📄 RITA", desc: "Birth Certificates, Death Certificates, Corrections", icon: "fa-file-alt", color: "#ffffff",
          fullDetails: { overview: "Help obtain various certificates from RITA.", steps: ["Fill application forms", "Collect applicant info", "Track applications", "Correct errors", "Get certificate quickly"], requirements: ["Complete applicant info", "Parent's NIDA number"], price: "Tsh 5,000 - 10,000", contact: "+255 625 568 661" } },
        { id: 4, name: "🏫 COLLEGES", desc: "Admission Applications, Course Selection", icon: "fa-university", color: "#ffffff",
          fullDetails: { overview: "Help choose the right college and course.", steps: ["Grade assessment", "Choose suitable courses", "Fill admission forms", "Track applications", "Interview guidance"], requirements: ["Primary & secondary certificates", "A/O-level grades", "Birth certificate"], price: "Tsh 5,000", contact: "+255 625 568 661" } },
        { id: 5, name: "📝 ASSIGNMENTS", desc: "Field Report, Research, Presentations", icon: "fa-pen-fancy", color: "#ffffff",
          fullDetails: { overview: "Help write academic assignments with quality.", steps: ["Understand topic", "Collect data", "Write draft", "Edit and improve", "Submit final"], requirements: ["Assignment instructions", "Deadline"], price: "From Tsh 500 per page", contact: "+255 625 568 661" } },
        { id: 6, name: "💻 COMPUTER MAINTENANCE", desc: "Windows Installation, Format, Antivirus", icon: "fa-laptop-code", color: "#ffffff",
          fullDetails: { overview: "Computer and laptop maintenance services.", steps: ["Diagnose problem", "Cost estimate", "Perform maintenance", "Work report", "Teach proper use"], requirements: ["Computer or laptop", "Backup important data"], price: "Tsh 15,000 - 60,000", contact: "+255 625 568 661" } },
        { id: 7, name: "🔧 IT SUPPORT", desc: "File Repair, Speed Boost, Backup", icon: "fa-tools", color: "#ffffff",
          fullDetails: { overview: "Tech support for all computer problems.", steps: ["Identify problem", "Quick solution", "Repair files", "Speed boost", "Backup & restore"], requirements: ["Problem description"], price: "Tsh 10,000 - 40,000", contact: "+255 625 568 661" } },
        { id: 8, name: "📊 FIELD REPORT", desc: "Guidance and Support for Field Reports", icon: "fa-chart-line", color: "#ffffff",
          fullDetails: { overview: "Help write excellent Field Reports.", steps: ["Understand field location", "Collect field data", "Analyze data", "Write report", "Edit and submit"], requirements: ["College instructions", "Field data"], price: "Tsh 30,000 - 80,000", contact: "+255 625 568 661" } }
    ]
};

// Helper functions
function showToast(msg, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function updateLanguageOnPage() {
    const translations = {
        sw: { home: 'Nyumbani', services: 'Huduma', login: 'Ingia', register: 'Jisajili', dashboard: 'Dashboard', heroDesc: 'Huduma za Kitaaluma na Kiteknolojia kwa uaminifu, haraka na ubora wa hali ya juu.', exploreBtn: 'Gundua Huduma Zetu', ourServices: '📋 HUDUMA ZETU', servicesDesc: 'Chagua huduma unayohitaji, tutakusaidia kwa weledi na uaminifu.', whyUs: '⭐ KWANINI UCHAGUE SISI?', fast: 'Huduma ya haraka ⚡', secure: 'Uaminifu na usiri 🔒', affordable: 'Gharama nafuu 💰', professional: 'Huduma bora na weledi 👨‍💻', clientsServed: 'Wateja Wamehudumiwa', support: 'Msaada wa Muda wote', satisfaction: 'Uridhishaji wa Wateja', contact: 'Wasiliana Nasi', workingHours: 'Saa za Kufungua', footerDesc: 'Kituo cha Huduma za Kitaaluma na Kiteknolojia', close: 'Funga', requestBtn: 'Omba Huduma' },
        en: { home: 'Home', services: 'Services', login: 'Login', register: 'Register', dashboard: 'Dashboard', heroDesc: 'Professional and Technological Services with trust, speed and quality.', exploreBtn: 'Explore Our Services', ourServices: '📋 OUR SERVICES', servicesDesc: 'Choose the service you need, we will help you with professionalism and trust.', whyUs: '⭐ WHY CHOOSE US?', fast: 'Fast Service ⚡', secure: 'Trust and Confidentiality 🔒', affordable: 'Affordable Prices 💰', professional: 'Professional Service 👨‍💻', clientsServed: 'Clients Served', support: '24/7 Support', satisfaction: 'Client Satisfaction', contact: 'Contact Us', workingHours: 'Working Hours', footerDesc: 'Center for Academic and Technological Services', close: 'Close', requestBtn: 'Request Service' }
    };
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.dataset.key;
        if (translations[currentLang][key]) el.textContent = translations[currentLang][key];
    });
}

function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    updateLanguageOnPage();
    // Reload services on home page if needed
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        loadServicesOnHome();
    }
}

function loadServicesOnHome() {
    const servicesGrid = document.getElementById('servicesGrid');
    if (!servicesGrid) return;
    const services = servicesData[currentLang];
    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card" onclick="showServiceDetails(${service.id})">
            <div class="service-icon"><i class="fas ${service.icon}" style="color: ${service.color};"></i></div>
            <h3>${service.name}</h3>
            <p>${service.desc}</p>
            <button class="btn btn-primary" style="margin-top:15px;">${currentLang === 'sw' ? 'Soma Zaidi →' : 'Read More →'}</button>
        </div>
    `).join('');
}

function showServiceDetails(id) {
    const services = servicesData[currentLang];
    const service = services.find(s => s.id === id);
    if (!service) return;
    const d = service.fullDetails;
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div style="text-align:center;">
            <i class="fas ${service.icon}" style="font-size:4rem; color:#fff;"></i>
            <h2>${service.name}</h2>
            <p>${service.desc}</p>
        </div>
        <div class="service-details">
            <h4>📖 ${currentLang === 'sw' ? 'Maelezo' : 'Overview'}</h4>
            <p>${d.overview}</p>
            <h4>📋 ${currentLang === 'sw' ? 'Hatua' : 'Steps'}</h4>
            <ol>${d.steps.map(s => `<li>${s}</li>`).join('')}</ol>
            <h4>📄 ${currentLang === 'sw' ? 'Nyaraka' : 'Requirements'}</h4>
            <ul>${d.requirements.map(r => `<li>${r}</li>`).join('')}</ul>
            <h4>💰 ${currentLang === 'sw' ? 'Gharama' : 'Price'}</h4>
            <p class="price-tag">${d.price}</p>
            <h4>📞 ${currentLang === 'sw' ? 'Wasiliana' : 'Contact'}</h4>
            <p>${d.contact}</p>
        </div>
    `;
    document.getElementById('serviceModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('serviceModal').style.display = 'none';
}

// Auth state observer
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        // Update dashboard if needed
    } else {
        currentUser = null;
    }
});

// Expose global functions
window.setLanguage = setLanguage;
window.showServiceDetails = showServiceDetails;
window.closeModal = closeModal;
window.showToast = showToast;

// Initialize particles
function initParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 60; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 6 + 2;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = Math.random() * 10 + 5 + 's';
        p.style.animationDelay = Math.random() * 10 + 's';
        container.appendChild(p);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    // Progress bar
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const pb = document.getElementById('progressBar');
        if (pb) pb.style.width = scrolled + '%';
    });
    if (document.getElementById('servicesGrid')) loadServicesOnHome();
});