// src/js/login.js
require("dotenv").config();
export let appToken = null;
export let profile  = null;

export function setupGoogleLogin(onReady) {
  window.onGoogleCred = (response) => {
    fetch("http://localhost:3000/auth/google", {  // ← your server URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential }),
    })
    .then(r => r.json())
    .then(data => {
      appToken = data.token;
      profile  = data.profile; // { sub, name, picture }
      onReady?.();
      document.getElementById("googleBtn").style.display = "none";
    })
    .catch(err => console.error("auth failed", err));
  };

  window.google?.accounts?.id?.initialize({
    client_id: process.env.GOOGLE_CLIENT_ID,
    callback: window.onGoogleCred,
    auto_select: false,
  });
  window.google?.accounts?.id?.renderButton(
    document.getElementById("googleBtn"),
    { theme: "outline", size: "large" }
  );
}
