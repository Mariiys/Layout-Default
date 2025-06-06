import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Método não permitido');
  }

  const { nome, idade, cidade, motivo, whatsapp, horarios } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'seuemail@gmail.com',
      pass: 'sua_senha_de_app' // use senha de app se for Gmail
    }
  });

  const mailOptions = {
    from: 'seuemail@gmail.com',
    to: 'destino@exemplo.com',
    subject: 'Novo contato do formulário',
    text: `
    Nome: ${nome}
    Idade: ${idade}
    Cidade/País: ${cidade}
    Motivo: ${motivo}
    WhatsApp: ${whatsapp}
    Horários: ${horarios}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('E-mail enviado com sucesso!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao enviar e-mail.');
  }
}





/*Proteja sua senha com variáveis de ambiente
Crie um projeto no Vercel.

Vá em "Settings" > "Environment Variables".

EMAIL_USER: seuemail@gmail.com

EMAIL_PASS: sua senha de app do Gmail

No código, substitua:

js
Copiar
Editar
auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS
}* */