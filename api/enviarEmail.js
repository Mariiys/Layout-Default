import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Método não permitido');
  }

  const { nome, idade, pais, estado, motivo, whatsapp, horarios, termosAceitos } = req.body;

  if (!nome || !idade || !pais || !estado || !motivo || !whatsapp || !horarios || !termosAceitos) {
    return res.status(400).send('Todos os campos obrigatórios devem ser preenchidos.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'destino@exemplo.com', 
    subject: `Novo contato Levemente Conecte - ${nome}`,
    text: `
    Nome: ${nome}
    Idade: ${idade}
    País: ${pais}
    Estado: ${estado}
    Motivo: ${motivo}
    WhatsApp: ${whatsapp}
    Horários: ${horarios}
    Termos Aceitos: ${termosAceitos ? 'Sim' : 'Não'}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ message: 'Erro ao enviar e-mail. Por favor, tente novamente mais tarde.' });
  }
}
