import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Configuração CORS (Cross-Origin Resource Sharing)
  // Permite que seu frontend (que pode estar em um domínio diferente)
  // faça requisições para este backend.
  // Em produção, ajuste o 'Access-Control-Allow-Origin' para o domínio exato do seu frontend.
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Lidar com requisições OPTIONS (pré-voo CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Método não permitido');
  }

  // Desestruturar todos os campos enviados pelo frontend
  const { nome, idade, pais, estado, motivo, whatsapp, horarios, termosAceitos } = req.body;

  // Validação básica dos dados recebidos
  if (!nome || !idade || !pais || !estado || !motivo || !whatsapp || !horarios || !termosAceitos) {
    return res.status(400).send('Todos os campos obrigatórios devem ser preenchidos.');
  }

  // Use variáveis de ambiente para credenciais, como você indicou
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Seu email (configurado no Vercel como EMAIL_USER)
      pass: process.env.EMAIL_PASS  // Sua senha de app (configurada no Vercel como EMAIL_PASS)
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // O remetente será o mesmo email da sua conta de envio
    to: 'destino@exemplo.com', // **Substitua este email pelo seu email de destino real**
    subject: `Novo contato do formulário - ${nome}`, // Assunto mais descritivo
    text: `
    --- Dados do Formulário ---
    Nome: ${nome}
    Idade: ${idade}
    País: ${pais}
    Estado: ${estado}
    Motivo do Contato: ${motivo}
    WhatsApp: ${whatsapp}
    Horários de Disponibilidade: ${horarios}
    Termos e Condições Aceitos: ${termosAceitos ? 'Sim' : 'Não'}
    -------------------------
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('E-mail enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).send('Erro ao enviar e-mail. Por favor, tente novamente mais tarde.');
  }
}