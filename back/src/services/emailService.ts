import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const enviarCorreoVerificacion = async (correo: string, token: string) => {
  const linkVerificacion = `http://localhost:3000/api/auth/verificar/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: correo,
    subject: "Verifica tu correo electrónico",
    html: `<p>Haz clic en el siguiente enlace para verificar tu correo: <a href="${linkVerificacion}">${linkVerificacion}</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};
