export async function onRequestGet({ env }) {
  const publicKey = env.EMAILJS_PUBLIC_KEY;
  const serviceId = env.EMAILJS_SERVICE_ID;
  const templateId = env.EMAILJS_TEMPLATE_ID;

  if (!publicKey || !serviceId || !templateId) {
    return new Response(JSON.stringify({ error: 'Configuration missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({
    publicKey,
    serviceId,
    templateId,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}