(function bootstrapLogin() {
  const form = document.getElementById("loginForm");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const payload = {
      username: data.get("username"),
      password: data.get("password")
    };

    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      alert("Login failed");
      return;
    }
    window.location.href = "/dashboard";
  });
})();
