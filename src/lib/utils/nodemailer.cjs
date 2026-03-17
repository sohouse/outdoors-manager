const nodemailer = require("nodemailer");

async function sendTestEmail() {
  // Generate a test account
  const testAccount = await nodemailer.createTestAccount();

  console.log("Test account created:");
  console.log("  User: %s", testAccount.user);
  console.log("  Pass: %s", testAccount.pass);

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Send a test message
  const info = await transporter.sendMail({
    from: `"Test App" <${testAccount.user}>`,
    to: "recipient@example.com",
    subject: "Hello from Ethereal!",
    text: "This message was sent using Ethereal.",
    html: "<p>This message was sent using <b>Ethereal</b>.</p>",
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview: %s", nodemailer.getTestMessageUrl(info));
}

sendTestEmail().catch(console.error);