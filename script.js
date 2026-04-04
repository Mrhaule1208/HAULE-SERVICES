let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
    // Show page function
    window.showPage = function(pageId) {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        if (pageId === 'dashboard' && currentUser) {
            document.getElementById('welcomeMsg').innerText = `Karibu, ${currentUser.displayName || currentUser.email}`;
            loadUserProfile();
        }
        // Update nav buttons
        const registerNav = document.getElementById('registerNav');
        const loginNav = document.getElementById('loginNav');
        const logoutNav = document.getElementById('logoutNav');
        if (pageId === 'dashboard') {
            registerNav.style.display = 'none';
            loginNav.style.display = 'none';
            logoutNav.style.display = 'inline-block';
        } else if (pageId === 'home' || pageId === 'services' || pageId === 'contact' || pageId === 'help') {
            registerNav.style.display = 'inline-block';
            loginNav.style.display = 'inline-block';
            logoutNav.style.display = 'none';
        } else {
            registerNav.style.display = 'inline-block';
            loginNav.style.display = 'inline-block';
            logoutNav.style.display = 'none';
        }
    };

    window.toggleMenu = function() {
        document.getElementById('navLinks').classList.toggle('show');
    };

    // Registration
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const gender = document.getElementById('regGender').value;
        const phone = document.getElementById('regPhone').value;
        const pwd = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirmPassword').value;
        if (pwd !== confirm) return alert('Nywila hazifanani');
        try {
            const userCred = await window.createUserWithEmailAndPassword(window.auth, email, pwd);
            const user = userCred.user;
            await window.setDoc(window.doc(window.db, 'users', user.uid), {
                name, email, gender, phone, uid: user.uid, photoURL: ''
            });
            alert('Usajili umefanikiwa. Tafadhali ingia.');
            showPage('login');
        } catch (err) {
            alert('Hitilafu: ' + err.message);
        }
    });

    // Login
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const identifier = document.getElementById('loginIdentifier').value;
        const password = document.getElementById('loginPassword').value;
        let email = identifier;
        if (!identifier.includes('@')) {
            alert('Tafadhali tumia barua pepe kuingia.');
            return;
        }
        try {
            const userCred = await window.signInWithEmailAndPassword(window.auth, email, password);
            currentUser = userCred.user;
            const userDoc = await window.getDoc(window.doc(window.db, 'users', currentUser.uid));
            if (userDoc.exists()) {
                currentUser.displayName = userDoc.data().name;
                currentUser.phone = userDoc.data().phone;
            }
            showPage('dashboard');
            loadUserProfile();
        } catch (err) {
            alert('Kuingia kulishindwa: ' + err.message);
        }
    });

    window.logout = async () => {
        await window.auth.signOut();
        currentUser = null;
        showPage('home');
    };

    async function loadUserProfile() {
        if (!currentUser) return;
        const docSnap = await window.getDoc(window.doc(window.db, 'users', currentUser.uid));
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('profileName').value = data.name || '';
            document.getElementById('profileEmail').value = data.email || '';
            document.getElementById('profilePhone').value = data.phone || '';
            document.getElementById('orderName').value = data.name || '';
            document.getElementById('orderPhone').value = data.phone || '';
        }
    }

    // Edit profile
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('profileName').value;
        const email = document.getElementById('profileEmail').value;
        const phone = document.getElementById('profilePhone').value;
        const file = document.getElementById('profilePicture').files[0];
        let photoURL = '';
        if (file) {
            const storageRef = window.ref(window.storage, `profilePics/${currentUser.uid}`);
            await window.uploadBytes(storageRef, file);
            photoURL = await window.getDownloadURL(storageRef);
        }
        await window.updateDoc(window.doc(window.db, 'users', currentUser.uid), { name, email, phone, photoURL });
        alert('Profile imehifadhiwa');
        loadUserProfile();
    });

    // Change password
    document.getElementById('passwordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPwd = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmNewPassword').value;
        if (newPwd !== confirm) return alert('Nywila hazifanani');
        await window.updatePassword(currentUser, newPwd);
        alert('Nywila imebadilishwa');
    });

    // Sub-service mapping
    const subServiceMap = {
        'HESLB': ['Maombi ya Mkopo', 'Marekebisho', 'Uhakiki wa Nyaraka'],
        'RITA': ['Cheti cha Kuzaliwa', 'Cheti cha Kifo', 'Marekebisho'],
        'NIDA': ['Usajili Mpya', 'Marekebisho', 'Kupata Namba'],
        'Maombi ya Vyuo': ['Udahili', 'Uchaguzi Kozi', 'Mwongozo'],
        'Huduma za Kitaaluma': ['Field Report', 'Assignments', 'Research', 'Presentations'],
        'Computer Maintenance': ['Windows Installation', 'Antivirus', 'Repair', 'Speed Up']
    };
    document.getElementById('mainService').addEventListener('change', function() {
        const subSelect = document.getElementById('subService');
        const selected = this.value;
        if (selected && subServiceMap[selected]) {
            subSelect.disabled = false;
            subSelect.innerHTML = '<option value="">-- Chagua Huduma Ndogo --</option>' + subServiceMap[selected].map(s => `<option value="${s}">${s}</option>`).join('');
        } else {
            subSelect.disabled = true;
            subSelect.innerHTML = '<option value="">Kwanza chagua huduma kuu</option>';
        }
    });

    // Order submission
    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const mainService = document.getElementById('mainService').value;
        const subService = document.getElementById('subService').value;
        const name = document.getElementById('orderName').value;
        const phone = document.getElementById('orderPhone').value;
        const desc = document.getElementById('orderDesc').value;
        const method = document.getElementById('deliveryMethod').value;
        const message = `Jina: ${name}\nSimu: ${phone}\nHuduma: ${mainService} - ${subService}\nMaelezo: ${desc}`;
        if (method === 'whatsapp') {
            const waUrl = `https://wa.me/255625568661?text=${encodeURIComponent(message)}`;
            window.open(waUrl, '_blank');
        } else {
            // EmailJS
            const templateParams = {
                user_name: name,
                user_phone: phone,
                service_name: `${mainService} - ${subService}`,
                message: desc,
                to_email: 'hamanierasmuce@gmail.com'
            };
            try {
                await emailjs.send('service_81kt9sf', 'template_37mnvci', templateParams);
                alert('Oda imetumwa kwa email. Tutawasiliana nayo.');
            } catch (err) {
                alert('Hitilafu katika kutuma email: ' + err);
            }
        }
    });

    // Gemini AI Chatbot
    let model = null;
    async function initGemini() {
        const apiKey = 'AIzaSyD06Otbu0abFJUNXm108EIfYq02BChkLC8';
        const { GoogleGenerativeAI } = await import('https://cdn.jsdelivr.net/npm/@google/generative-ai@0.21.0/dist/index.min.js');
        const genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
    initGemini();

    document.getElementById('chatSend').addEventListener('click', async () => {
        const input = document.getElementById('chatInput');
        const question = input.value.trim();
        if (!question) return;
        const chatDiv = document.getElementById('chatMessages');
        chatDiv.innerHTML += `<div class="user-msg">🧑: ${question}</div>`;
        input.value = '';
        if (!model) {
            chatDiv.innerHTML += `<div class="bot-msg">🤖: Samahani, AI haijaanzishwa. Hakikisha una API key sahihi.</div>`;
            chatDiv.scrollTop = chatDiv.scrollHeight;
            return;
        }
        try {
            const result = await model.generateContent(question);
            const answer = result.response.text();
            chatDiv.innerHTML += `<div class="bot-msg">🤖: ${answer}</div>`;
        } catch (err) {
            chatDiv.innerHTML += `<div class="bot-msg">🤖: Hitilafu ya AI: ${err.message}</div>`;
        }
        chatDiv.scrollTop = chatDiv.scrollHeight;
    });

    document.getElementById('chatbotBtn').addEventListener('click', () => {
        const win = document.getElementById('chatbotWindow');
        win.style.display = win.style.display === 'flex' ? 'none' : 'flex';
    });

    document.getElementById('whatsappBtn').addEventListener('click', () => {
        window.open('https://wa.me/255625568661', '_blank');
    });

    window.showDashboardSection = function(sectionId) {
        document.querySelectorAll('.dashboard-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
    };

    // Auto-login check
    window.auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            const docSnap = await window.getDoc(window.doc(window.db, 'users', currentUser.uid));
            if (docSnap.exists()) currentUser.displayName = docSnap.data().name;
            showPage('dashboard');
        } else {
            currentUser = null;
            if (document.getElementById('dashboard').classList.contains('active')) showPage('home');
        }
    });
});