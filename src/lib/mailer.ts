import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | null = null;

export function getTransporter(): Transporter {
  if (transporter) return transporter;

  const port = Number(process.env.SMTP_PORT ?? 465);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
}

export function fromHeader(): string {
  const name = process.env.EMAIL_SENDER_NAME || "Portfolio";
  const address = process.env.EMAIL_USER;
  return `"${name}" <${address}>`;
}
