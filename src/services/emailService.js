import emailjs from "@emailjs/browser";

export async function sendSignupEmail({ email, name }) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_SIGNUP_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn("EmailJS env vars missing, skipping signup email.");
    return;
  }

  if (!email) return;

  await emailjs.send(
    serviceId,
    templateId,
    {
      to_email: email,
      user_email: email,
      user_name: name || "User",
      app_name: "The Luxury Focus",
    },
    { publicKey },
  );
}
