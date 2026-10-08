const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Set CORS headers if needed
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { fname, lname, email, phone, service, budget, timeline, message } = req.body || {};

    if (!fname || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields (First Name, Email, and Message).'
      });
    }

    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 465;
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const receiver = process.env.CONTACT_RECEIVER_EMAIL || 'info@kpinfrastructure.com';
    const from = process.env.CONTACT_FROM_EMAIL || `"K.P. Infrastructure" <${user || 'info@kpinfrastructure.com'}>`;

    if (!user || !pass) {
      console.error('SMTP credentials are not configured in environment variables.');
      return res.status(500).json({
        success: false,
        error: 'Email service credentials are not configured on the server. Please check SMTP settings in .env.'
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass
      }
    });

    const fullName = `${fname} ${lname || ''}`.trim();

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #12131C; color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid rgba(200,169,110,0.3);">
        <div style="background: linear-gradient(135deg, #1f1a29 0%, #12131C 100%); padding: 24px 30px; border-bottom: 2px solid #C8A96E;">
          <h2 style="margin: 0; color: #ffffff; font-size: 20px; letter-spacing: 0.05em;">New Project Enquiry</h2>
          <p style="margin: 4px 0 0; color: #C8A96E; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em;">K.P. Infrastructure Website Contact Form</p>
        </div>
        
        <div style="padding: 28px 30px; background: #181926;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #e0e0e0;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); width: 35%; color: #C8A96E; font-weight: 600;">Full Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #ffffff;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #C8A96E; font-weight: 600;">Email Address:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #ffffff;"><a href="mailto:${email}" style="color: #64B5F6; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #C8A96E; font-weight: 600;">Phone Number:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #ffffff;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #C8A96E; font-weight: 600;">Service Required:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #ffffff;">${service || 'General Enquiry'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #C8A96E; font-weight: 600;">Approx. Budget:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #ffffff;">${budget || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #C8A96E; font-weight: 600;">Timeline:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #ffffff;">${timeline || 'Not specified'}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding: 18px; background: rgba(0,0,0,0.3); border-radius: 8px; border-left: 3px solid #C8A96E;">
            <div style="color: #C8A96E; font-weight: 600; font-size: 13px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.08em;">Project Details / Message:</div>
            <div style="color: #ffffff; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
          </div>
        </div>

        <div style="padding: 16px 30px; background: #12131C; text-align: center; font-size: 12px; color: rgba(255,255,255,0.5); border-top: 1px solid rgba(255,255,255,0.06);">
          This message was submitted via the contact form on <a href="https://kpinfrastructure.com" style="color: #C8A96E; text-decoration: none;">kpinfrastructure.com</a>.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from,
      to: receiver,
      replyTo: `"${fullName}" <${email}>`,
      subject: `New Enquiry from ${fullName} - ${service || 'K.P. Infrastructure'}`,
      text: `New Enquiry from: ${fullName}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nService: ${service || 'General'}\nBudget: ${budget || 'N/A'}\nTimeline: ${timeline || 'N/A'}\n\nMessage:\n${message}`,
      html: htmlContent
    });

    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully!'
    });
  } catch (err) {
    console.error('Error sending email via nodemailer:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to send message. Please try again later.'
    });
  }
};
