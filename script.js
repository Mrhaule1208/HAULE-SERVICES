let currentUser = null;
let model = null;

function showModal(message) {
    const modal = document.getElementById('customModal');
    const msgSpan = document.getElementById('modalMessage');
    msgSpan.innerText = message;
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('closeCustomModal').addEventListener('click', () => {
        document.getElementById('customModal').style.display = 'none';
    });
    document.getElementById('closeSupportModal').addEventListener('click', () => {
        document.getElementById('supportModal').style.display = 'none';
    });

    document.getElementById('supportBtn').addEventListener('click', () => {
        document.getElementById('supportModal').style.display = 'flex';
    });
    document.getElementById('openChatbotFromSupport').addEventListener('click', () => {
        document.getElementById('supportModal').style.display = 'none';
        document.getElementById('chatbotWindow').style.display = 'flex';
    });

    window.showPage = function(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        if (pageId === 'dashboard' && currentUser) {
            document.getElementById('welcomeMsg').innerText = `Karibu, ${currentUser.displayName || currentUser.email}`;
            loadUserProfile();
        }
        const regNav = document.getElementById('registerNav');
        const loginNav = document.getElementById('loginNav');
        const logoutNav = document.getElementById('logoutNav');
        if (pageId === 'dashboard') {
            regNav.style.display = 'none';
            loginNav.style.display = 'none';
            logoutNav.style.display = 'inline-block';
        } else {
            regNav.style.display = 'inline-block';
            loginNav.style.display = 'inline-block';
            logoutNav.style.display = 'none';
        }
    };

    window.toggleMenu = function() {
        document.getElementById('navLinks').classList.toggle('show');
    };

    // Register
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const gender = document.getElementById('regGender').value;
        const phone = document.getElementById('regPhone').value;
        const pwd = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirmPassword').value;
        if (pwd !== confirm) return showModal('❌ Nywila hazifanani!');
        try {
            const userCred = await window.createUserWithEmailAndPassword(window.auth, email, pwd);
            await window.setDoc(window.doc(window.db, 'users', userCred.user.uid), {
                name, email, gender, phone, uid: userCred.user.uid, photoURL: ''
            });
            showModal('✅ Usajili umefanikiwa! Ingia sasa.');
            showPage('login');
        } catch (err) {
            showModal('❌ ' + err.message);
        }
    });

    // Login
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        try {
            const userCred = await window.signInWithEmailAndPassword(window.auth, email, password);
            currentUser = userCred.user;
            const userDoc = await window.getDoc(window.doc(window.db, 'users', currentUser.uid));
            if (userDoc.exists()) currentUser.displayName = userDoc.data().name;
            showModal('✅ Kuingia kumefanikiwa!');
            showPage('dashboard');
            loadUserProfile();
        } catch (err) {
            showModal('❌ ' + err.message);
        }
    });

    // Forgot password
    document.getElementById('forgotPasswordBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        const email = prompt("Ingiza barua pepe uliyojisajili:");
        if (email && email.includes('@')) {
            try {
                await window.sendPasswordResetEmail(window.auth, email);
                showModal('✅ Tuma barua ya kurejesha nywila imetumwa. Angalia email yako.');
            } catch (err) {
                showModal('❌ ' + err.message);
            }
        } else {
            showModal('❌ Barua pepe si sahihi.');
        }
    });

    window.logout = async () => {
        await window.auth.signOut();
        currentUser = null;
        showModal('✅ Umefanikiwa kutoka.');
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
        showModal('✅ Profile imehifadhiwa.');
        loadUserProfile();
    });

    // Change password
    document.getElementById('passwordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPwd = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmNewPassword').value;
        if (newPwd !== confirm) return showModal('❌ Nywila mpya hazifanani.');
        await window.updatePassword(currentUser, newPwd);
        showModal('✅ Nywila imebadilishwa.');
    });

    // Sub-service mapping (kwa ajili ya maonyesho tu – hatutakiwi kuwa na sub kwa huduma zote, lakini tuliweka kwa baadhi)
    const subMap = {
        'HESLB': ['Maombi ya Mkopo', 'Marekebisho', 'Uhakiki'],
        'RITA': ['Cheti cha Kuzaliwa', 'Cheti cha Kifo', 'Marekebisho'],
        'NIDA': ['Usajili Mpya', 'Marekebisho', 'Kupata Namba'],
        'Maombi ya Vyuo': ['Udahili', 'Uchaguzi Kozi', 'Mwongozo'],
        'Huduma za Kitaaluma': ['Field Report', 'Assignments', 'Research', 'Presentations'],
        'Computer Maintenance': ['Windows', 'Antivirus', 'Repair', 'Speed Up'],
        'Tin Number': ['Usajili wa TIN', 'Marekebisho TIN'],
        'Loss Report': ['Taarifa ya Kupoteza', 'Cheti cha Kupoteza']
    };
    document.getElementById('mainService').addEventListener('change', function() {
        const sub = document.getElementById('subService');
        const val = this.value;
        if (val && subMap[val]) {
            sub.disabled = false;
            sub.innerHTML = '<option value="">-- Chagua Ndogo --</option>' + subMap[val].map(s => `<option value="${s}">${s}</option>`).join('');
        } else {
            sub.disabled = true;
            sub.innerHTML = '<option value="">Kwanza chagua kuu</option>';
        }
    });

    // Order submission (email inapokea taarifa zote pamoja na bei)
    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const main = document.getElementById('mainService').value;
        const sub = document.getElementById('subService').value;
        const name = document.getElementById('orderName').value;
        const phone = document.getElementById('orderPhone').value;
        const desc = document.getElementById('orderDesc').value;
        const method = document.getElementById('deliveryMethod').value;
        
        // Pata bei kutoka kwenye selected option
        const mainOption = document.getElementById('mainService').options[document.getElementById('mainService').selectedIndex];
        const priceText = mainOption.text.split(' - ')[1] || 'Itajadiliwa';
        
        const message = `Jina: ${name}\nSimu: ${phone}\nHuduma Kuu: ${main}\nHuduma Ndogo: ${sub || 'Hakuna'}\nBei: ${priceText}\nMaelezo: ${desc}`;
        
        if (method === 'whatsapp') {
            window.open(`https://wa.me/255625568661?text=${encodeURIComponent(message)}`, '_blank');
            showModal('✅ Fungua WhatsApp na tuma ujumbe.');
        } else {
            try {
                await emailjs.send('service_81kt9sf', 'template_37mnvci', {
                    user_name: name,
                    user_phone: phone,
                    service_name: `${main} - ${sub || 'Hakuna'} (Bei: ${priceText})`,
                    message: desc,
                    to_email: 'hamanierasmuce@gmail.com'
                });
                showModal('✅ Oda imetumwa kwa email. Tutawasiliana nayo.');
            } catch (err) {
                showModal('❌ Hitilafu: ' + err);
            }
        }
    });

    // Gemini AI
    async function initGemini() {
        const apiKey = 'AIzaSyCs5tUiyFTG8uAJiteOsU2Xdi7SZ5wc1p4';
        const { GoogleGenerativeAI } = await import('https://cdn.jsdelivr.net/npm/@google/generative-ai@0.21.0/dist/index.min.js');
        model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-1.5-flash" });
    }
    initGemini();

    document.getElementById('chatSend').addEventListener('click', async () => {
        const input = document.getElementById('chatInput');
        const q = input.value.trim();
        if (!q) return;
        const chatDiv = document.getElementById('chatMessages');
        chatDiv.innerHTML += `<div class="user-msg">🧑: ${q}</div>`;
        input.value = '';
        if (!model) {
            chatDiv.innerHTML += `<div class="bot-msg">🤖: AI haijaanzishwa.</div>`;
            return;
        }
        try {
            const res = await model.generateContent(q);
            chatDiv.innerHTML += `<div class="bot-msg">🤖: ${res.response.text()}</div>`;
        } catch (err) {
            chatDiv.innerHTML += `<div class="bot-msg">🤖: Hitilafu: ${err.message}</div>`;
        }
        chatDiv.scrollTop = chatDiv.scrollHeight;
    });

    document.getElementById('chatbotBtn').addEventListener('click', () => {
        const win = document.getElementById('chatbotWindow');
        win.style.display = win.style.display === 'flex' ? 'none' : 'flex';
    });
    document.getElementById('whatsappContactBtn').addEventListener('click', () => {
        window.open('https://wa.me/255625568661', '_blank');
    });

    window.showDashboardSection = function(section) {
        document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
        document.getElementById(section).classList.add('active');
    };

    window.auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            const snap = await window.getDoc(window.doc(window.db, 'users', currentUser.uid));
            if (snap.exists()) currentUser.displayName = snap.data().name;
            showPage('dashboard');
        } else {
            currentUser = null;
            if (document.getElementById('dashboard').classList.contains('active')) showPage('home');
        }
    });
});