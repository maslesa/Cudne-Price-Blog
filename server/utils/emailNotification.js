const nodemailer = require('nodemailer');

const sendStoryNotification = async (user, story, storyStatus) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.BLOG_EMAIL,
            pass: process.env.BLOG_EMAIL_PASS,
        },
    })

    await transporter.sendMail({
        from: `"Čudne priče Story Notification" <${process.env.BLOG_EMAIL}>`,
        to: process.env.BLOG_EMAIL,
        subject: `Story ${storyStatus}`,
        html: `<p><b>${user}</b> just <b>${storyStatus}</b> story <b>"${story}"</b></p>`
    })

}

module.exports = {
    sendStoryNotification,
}