const nodemailer = require('nodemailer');

const generateLoginCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendLoginCodeEmail = async (code) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.BLOG_EMAIL,
            pass: process.env.BLOG_EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Čudne priče Blog Login" <${process.env.BLOG_EMAIL}>`,
        to: process.env.BLOG_EMAIL,
        subject: 'Admin Login Code',
        html: `<p>Your admin login code is: <b>${code}</b></p>`
    });
};

module.exports = {
    generateLoginCode,
    sendLoginCodeEmail,
}