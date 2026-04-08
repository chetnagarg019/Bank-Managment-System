import dotenv from "dotenv";
import nodemailer from "nodemailer";
//Nodemailer ek Node.js library hai jo email send karne ke liye use hoti hai.

dotenv.config();

const transporter = nodemailer.createTransport({ //Ye batata hai email kis account se send hoga
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  //Ye general function hai jo kisi ko bhi email bhej sakta hai.
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });
    
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Backend Ledger!";
  const text = `Hello ${name}, \n\n Thank you for registering at Backend Ledger.
    We're excited to have you on board!\n\n Best regards ,\n The Backend Ledger Team`;
  const html = `<p>Hello ${name},</p> <p>Thank you for registering at Backend Ledger.
    We are exicted to have you on board!</p><p>Best Regards,<br>The Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html); //Ye special function hai jo registration ke baad email bhejta hai.
}


async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Successful";

  const text = `Hello ${name},

₹${amount} has been successfully transferred to account ${toAccount}.

If this was not you, please contact support immediately.

Regards,
Backend Ledger Team`;

  const html = `
    <p>Hello ${name},</p>
    <p><strong>₹${amount}</strong> has been successfully transferred to account 
    <b>${toAccount}</b>.</p>
    <p>If this was not you, please contact support immediately.</p>
    <p>Regards,<br/>Backend Ledger Team</p>
  `;

  await sendEmail(userEmail, subject, text, html);
}

export default { sendRegistrationEmail,sendTransactionEmail };
