const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const africastalking = require('africastalking');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// User Schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});
const User = mongoose.model('User', userSchema);

// Service Request Schema
const requestSchema = new mongoose.Schema({
    fullname: String,
    phone: String,
    mainService: String,
    subService: String,
    status: { type: String, default: 'Imepokelewa' },
    timestamp: { type: Date, default: Date.now }
});
const ServiceRequest = mongoose.model('ServiceRequest', requestSchema);

// Contact Message Schema
const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});
const ContactMessage = mongoose.model('ContactMessage', messageSchema);

// Africa's Talking SMS
const at = africastalking({
    username: process.env.AT_USERNAME || 'sandbox',
    apiKey: process.env.AT_API_KEY
});
const sms = at.SMS;

async function sendSMS(phone, text) {
    let formatted = phone.replace(/^0+/, '');
    if (!formatted.startsWith('255')) formatted = '255' + formatted;
    try {
        await sms.send({ to: formatted, message: text, from: 'MRHAULE' });
        console.log('SMS sent to', formatted);
    } catch (err) { console.error('SMS error:', err); }
}

// Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// -------------------- API Routes --------------------
// Register
app.post('/api/register', async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;
    if (!firstName || !lastName || !email || !phone || !password) return res.status(400).json({ success: false, message: 'Sehemu zote zinahitajika.' });
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) return res.status(400).json({ success: false, message: 'Barua pepe au namba tayari imesajiliwa.' });
    const user = new User({ firstName, lastName, email, phone, password });
    await user.save();
    // send welcome SMS
    await sendSMS(phone, `Karibu ${firstName} ${lastName}! Umefanikiwa kujiunga na MR. HAULE SERVICES. Sasa unaweza kuomba huduma.`);
    res.json({ success: true, message: 'Usajili umefanikiwa.' });
});

// Login
app.post('/api/login', async (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) return res.status(400).json({ success: false, message: 'Barua pepe/simu na nywila vinahitajika.' });
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user || user.password !== password) return res.status(401).json({ success: false, message: 'Taarifa si sahihi.' });
    res.json({ success: true, message: 'Kuingia kumefanikiwa.', user: { email: user.email, firstName: user.firstName, lastName: user.lastName } });
});

// Forgot Password
app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: true, message: 'Ikiwa barua pepe ipo, tutatuma mwongozo.' });
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    const resetLink = `${process.env.FRONTEND_URL}/reset-password.html?token=${token}&email=${email}`;
    await transporter.sendMail({
        from: `"MR. HAULE SERVICES" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Weka Upya Nywila Yako',
        html: `<h2>Habari ${user.firstName},</h2><p>Bofya kiungo hapa kuweka upya nywila:</p><a href="${resetLink}" style="background:#1E3A8A; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Weka Upya Nywila</a><p>Kiungo kitakuwa halali kwa saa moja.</p>`
    });
    res.json({ success: true, message: 'Mwongozo umetumwa kwa barua pepe.' });
});

// Reset Password
app.post('/api/reset-password', async (req, res) => {
    const { email, token, newPassword } = req.body;
    const user = await User.findOne({ email, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: 'Kiungo si sahihi au kimeisha muda.' });
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ success: true, message: 'Nywila imebadilishwa. Sasa unaweza kuingia.' });
});

// Submit Service Request
app.post('/api/request', async (req, res) => {
    const { fullname, phone, mainService, subService } = req.body;
    if (!fullname || !phone || !mainService || !subService) return res.status(400).json({ success: false, message: 'Taarifa zote zinahitajika.' });
    const request = new ServiceRequest({ fullname, phone, mainService, subService });
    await request.save();
    await sendSMS(phone, `Asante ${fullname}! Ombi lako la ${mainService} (${subService}) limepokelewa. Tutawasiliana nawe kwa haraka.`);
    await sendSMS(process.env.ADMIN_PHONE, `Ombi jipya: ${fullname} (${phone}) ametaka ${mainService} - ${subService}`);
    res.json({ success: true, message: 'Ombi limepokelewa. Utaona SMS ya uthibitisho.' });
});

// Contact Message
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, message } = req.body;
    if (!name || !phone || !message) return res.status(400).json({ success: false, message: 'Jina, simu na ujumbe vinahitajika.' });
    const msg = new ContactMessage({ name, email, phone, message });
    await msg.save();
    await sendSMS(phone, `Asante ${name} kwa kuwasiliana nasi. Tutajibu haraka.`);
    await sendSMS(process.env.ADMIN_PHONE, `Ujumbe mpya: ${name} (${phone}): ${message.substring(0,100)}...`);
    res.json({ success: true, message: 'Ujumbe wako umetumwa. Angalia SMS yako.' });
});

// Get all requests (for admin)
app.get('/api/requests', async (req, res) => {
    const requests = await ServiceRequest.find().sort({ timestamp: -1 });
    res.json(requests);
});

// Update request status
app.put('/api/requests/:id', async (req, res) => {
    const { status } = req.body;
    const updated = await ServiceRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
});

// Delete request
app.delete('/api/requests/:id', async (req, res) => {
    await ServiceRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));