// On page load
document.addEventListener('DOMContentLoaded', () => {
    
    // Floating WhatsApp already in HTML

    // Login Button Function
    document.querySelectorAll('.btn-login').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert("🔐 Karibu Ingia\n\nHuduma ya Login itaongezwa hivi karibuni.\nKwa sasa wasiliana na Bw. Haule moja kwa moja.");
        });
    });

    // Register Button Function
    document.querySelectorAll('.btn-register').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert("📝 Jiandikishe Bure\n\nAkaunti ya kujiandikisha itaongezwa hivi karibuni.\nTafadhali wasiliana nasi kupitia WhatsApp.");
        });
    });
});

// ... (code ya zamani ibaki)
function sendToWhatsApp(e) {
    e.preventDefault();

    const name = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const service = document.getElementById('serviceType').value;
    const details = document.getElementById('details').value;
    const location = document.getElementById('location').value || "Haijatajwa";

    if (!name || !phone || !service || !details) {
        alert("Tafadhali jaza sehemu zote zinazohitajika (*)");
        return;
    }

    const message = `Habari Bw. Haule,%0A%0A` +
                    `Jina: ${name}%0A` +
                    `Namba: ${phone}%0A` +
                    `Huduma: ${service}%0A` +
                    `Maelezo: ${details}%0A` +
                    `Eneo: ${location}%0A%0A` +
                    `Tafadhali nisaidie haraka. Asante!`;

    const whatsappURL = `https://wa.me/255625568661?text=${message}`;
    window.open(whatsappURL, '_blank');

    // Optional: Clear form after sending
    document.getElementById('serviceForm').reset();
}