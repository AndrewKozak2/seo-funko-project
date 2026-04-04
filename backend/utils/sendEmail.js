const sendEmail = async (email, code, type = "register") => {
  try {
    const isReset = type === "reset";
    const subject = isReset
      ? "Password Reset Code - Funko Shop"
      : "Verification Code (Підтвердження реєстрації)";
    const title = isReset
      ? "Reset Your Password"
      : "Welcome to Funko Pop Store!";
    const subtitle = isReset
      ? "Your password reset code is:"
      : "Your verification code is:";
    const validTime = isReset ? "15 minutes" : "10 minutes";

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "Funko Pop Store",
          email: process.env.EMAIL_USER,
        },
        to: [{ email: email }],
        subject: subject,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2>${title}</h2>
            <p>${subtitle}</p>
            <h1 style="color: #ff8a00; font-size: 40px; letter-spacing: 5px;">${code}</h1>
            <p>This code is valid for <strong>${validTime}</strong>.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo API error details:", errorData);
      throw new Error("Failed to send email via Brevo");
    }

    console.log(`Email (${type}) sent successfully via Brevo to:`, email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send verification email");
  }
};

module.exports = sendEmail;
