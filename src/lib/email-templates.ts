export type SupportedLocale = "en" | "bn" | "no";

interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const BRAND = "Apu Das — Portfolio";
const ACCENT = "#6d5ef8";

function wrap(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#f3f3f7;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e6e6ec;">
            <tr>
              <td style="background:${ACCENT};padding:20px 28px;">
                <span style="color:#ffffff;font-weight:700;font-size:16px;letter-spacing:-0.01em;">${BRAND}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 12px;font-size:19px;color:#0f0f14;">${title}</h1>
                ${bodyHtml}
              </td>
            </tr>
          </table>
          <p style="color:#9797a8;font-size:12px;margin-top:16px;">Sent automatically from apuorgho.com — please don't reply to this address.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

const OTP_COPY: Record<SupportedLocale, { subject: string; greeting: (n: string) => string; body: string; expiry: string }> = {
  en: {
    subject: "Your verification code for apuorgho.com",
    greeting: (n) => `Hi ${n},`,
    body: "Use this code to confirm it's really you before your message is sent:",
    expiry: "This code expires in 10 minutes. If you didn't request this, you can ignore it.",
  },
  bn: {
    subject: "apuorgho.com-এর জন্য আপনার ভেরিফিকেশন কোড",
    greeting: (n) => `হাই ${n},`,
    body: "আপনার বার্তা পাঠানোর আগে এটি সত্যিই আপনি কিনা নিশ্চিত করতে এই কোডটি ব্যবহার করুন:",
    expiry: "এই কোডটি ১০ মিনিটের মধ্যে মেয়াদোত্তীর্ণ হবে। যদি আপনি এটি অনুরোধ না করে থাকেন, তবে এটি উপেক্ষা করতে পারেন।",
  },
  no: {
    subject: "Din verifiseringskode for apuorgho.com",
    greeting: (n) => `Hei ${n},`,
    body: "Bruk denne koden for å bekrefte at det virkelig er deg før meldingen din sendes:",
    expiry: "Koden utløper om 10 minutter. Hvis du ikke ba om dette, kan du se bort fra den.",
  },
};

export function otpEmailTemplate({
  name,
  otp,
  locale,
}: {
  name: string;
  otp: string;
  locale: SupportedLocale;
}): EmailContent {
  const copy = OTP_COPY[locale] ?? OTP_COPY.en;
  const safeName = escapeHtml(name);

  const html = wrap(
    copy.subject,
    `<p style="color:#5b5b68;font-size:14px;line-height:1.6;">${copy.greeting(safeName)}</p>
     <p style="color:#5b5b68;font-size:14px;line-height:1.6;">${copy.body}</p>
     <p style="text-align:center;margin:24px 0;">
       <span style="display:inline-block;font-size:32px;font-weight:700;letter-spacing:0.3em;color:${ACCENT};background:#efecff;padding:14px 22px;border-radius:14px;">${otp}</span>
     </p>
     <p style="color:#9797a8;font-size:13px;line-height:1.6;">${copy.expiry}</p>`
  );

  const text = `${copy.greeting(name)}\n\n${copy.body}\n\n${otp}\n\n${copy.expiry}`;

  return { subject: copy.subject, html, text };
}

const CONFIRM_COPY: Record<SupportedLocale, { subject: string; greeting: (n: string) => string; body: string; signature: string }> = {
  en: {
    subject: "Thanks for reaching out — message received",
    greeting: (n) => `Hi ${n},`,
    body: "Thanks for your message — it's verified and landed in my inbox. I'll get back to you soon.",
    signature: "— Apu Das",
  },
  bn: {
    subject: "যোগাযোগের জন্য ধন্যবাদ — বার্তা পৌঁছেছে",
    greeting: (n) => `হাই ${n},`,
    body: "আপনার বার্তার জন্য ধন্যবাদ — এটি যাচাই করা হয়েছে এবং আমার ইনবক্সে পৌঁছেছে। শীঘ্রই আপনার সাথে যোগাযোগ করবো।",
    signature: "— অপু দাস",
  },
  no: {
    subject: "Takk for at du tok kontakt — meldingen er mottatt",
    greeting: (n) => `Hei ${n},`,
    body: "Takk for meldingen din — den er verifisert og har landet i innboksen min. Jeg svarer deg så snart som mulig.",
    signature: "— Apu Das",
  },
};

export function confirmationTemplate({
  name,
  locale,
}: {
  name: string;
  locale: SupportedLocale;
}): EmailContent {
  const copy = CONFIRM_COPY[locale] ?? CONFIRM_COPY.en;
  const safeName = escapeHtml(name);

  const html = wrap(
    copy.subject,
    `<p style="color:#5b5b68;font-size:14px;line-height:1.6;">${copy.greeting(safeName)}</p>
     <p style="color:#5b5b68;font-size:14px;line-height:1.6;">${copy.body}</p>
     <p style="color:#0f0f14;font-size:14px;margin-top:20px;">${copy.signature}</p>`
  );

  const text = `${copy.greeting(name)}\n\n${copy.body}\n\n${copy.signature}`;

  return { subject: copy.subject, html, text };
}

export function ownerNotificationTemplate({
  name,
  email,
  message,
  locale,
}: {
  name: string;
  email: string;
  message: string;
  locale: SupportedLocale;
}): EmailContent {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");
  const subject = `New verified message from ${name}`;

  const html = wrap(
    "New verified message",
    `<p style="color:#5b5b68;font-size:13px;">From <strong style="color:#0f0f14;">${safeName}</strong> &lt;${safeEmail}&gt; · locale: ${escapeHtml(locale)} · email ownership verified via OTP</p>
     <div style="margin-top:16px;padding:16px;background:#f3f3f7;border-radius:12px;color:#0f0f14;font-size:14px;line-height:1.6;">${safeMessage}</div>`
  );

  const text = `From: ${name} <${email}> (locale: ${locale}, verified via OTP)\n\n${message}`;

  return { subject, html, text };
}
