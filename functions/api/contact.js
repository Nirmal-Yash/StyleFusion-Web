export async function onRequestPost({ request, env }) {
  try {
    const payload = await request.json();
    const name = String(payload?.name || '').trim();
    const email = String(payload?.email || '').trim();
    const inquiry = String(payload?.inquiry || 'General Inquiry').trim();
    const city = String(payload?.city || '').trim();
    const message = String(payload?.message || '').trim();

    if (!name || !email || !message) {
      return json({ ok: false, error: 'Missing required fields.' }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json({ ok: false, error: 'Invalid email address.' }, 400);
    }

    const resendApiKey = env.RESEND_API_KEY;
    const toEmail = env.CONTACT_TO_EMAIL;
    const fromEmail = env.CONTACT_FROM_EMAIL;

    if (!resendApiKey || !toEmail || !fromEmail) {
      return json({ ok: false, error: 'Server email config is missing.' }, 500);
    }

    const subject = `StyleFusion Inquiry - ${inquiry} (${name})`;
    const textBody = [
      `Name: ${name}`,
      `Email: ${email}`,
      `City: ${city || '-'}`,
      `Inquiry: ${inquiry}`,
      '',
      'Message:',
      message,
    ].join('\n');

    const htmlBody = `
      <h2>New StyleFusion Contact Inquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>City:</strong> ${escapeHtml(city || '-')}</p>
      <p><strong>Inquiry:</strong> ${escapeHtml(inquiry)}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject,
        text: textBody,
        html: htmlBody,
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      return json({ ok: false, error: `Email provider error: ${resendError}` }, 502);
    }

    return json({ ok: true, message: 'Message sent successfully.' }, 200);
  } catch (error) {
    return json({ ok: false, error: error?.message || 'Unexpected server error.' }, 500);
  }
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function escapeHtml(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}