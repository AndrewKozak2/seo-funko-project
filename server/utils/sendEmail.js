const sendEmail = async (email, code) => {
  try {
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
        subject: "Verification Code (Підтвердження реєстрації)",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2>Welcome to Funko Pop Store!</h2>
            <p>Your verification code is:</p>
            <h1 style="color: #ff8a00; font-size: 40px; letter-spacing: 5px;">${code}</h1>
            <p>This code is valid for <strong>10 minutes</strong>.</p>
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

    console.log("Email sent successfully via Brevo to:", email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send verification email");
  }
};

module.exports = sendEmail;
