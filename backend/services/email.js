const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendAppointmentConfirmation = async (email, appointment) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Appointment Confirmation',
      html: `
        <h1>Appointment Confirmed</h1>
        <p>Your appointment has been scheduled for ${appointment.date} at ${appointment.time}</p>
      `
    });
  } catch (error) {
    console.error('Email error:', error);
  }
};

exports.sendAppointmentReminder = async (email, appointment) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Appointment Reminder',
      html: `
        <h1>Appointment Reminder</h1>
        <p>Your appointment is tomorrow at ${appointment.time}</p>
      `
    });
  } catch (error) {
    console.error('Email error:', error);
  }
};