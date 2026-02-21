const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  }

  async sendWelcomeEmail(user) {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: 'Welcome to Apex Digital!',
      html: this.getWelcomeTemplate(user)
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendProjectCreated(project, user) {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: `Project Created: ${project.type}`,
      html: this.getProjectCreatedTemplate(project, user)
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendProjectStatusUpdate(project, user) {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: `Project Update: ${project.status}`,
      html: this.getStatusUpdateTemplate(project, user)
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendPaymentConfirmation(payment, project, user) {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: 'Payment Confirmed',
      html: this.getPaymentTemplate(payment, project, user)
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendPayoutNotification(payout, user) {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: 'Weekly Payout Processed',
      html: this.getPayoutTemplate(payout, user)
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendMarketingReport(project, metrics, user) {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: `Campaign Report: ${project.name}`,
      html: this.getReportTemplate(project, metrics, user)
    };

    return this.transporter.sendMail(mailOptions);
  }

  getWelcomeTemplate(user) {
    return `
      <h1>Welcome to Apex Digital, ${user.fullName}!</h1>
      <p>We're excited to have you on board. Start by exploring our AI-powered design and marketing services.</p>
      <a href="${process.env.FRONTEND_URL}/services">Browse Services</a>
    `;
  }

  getProjectCreatedTemplate(project, user) {
    return `
      <h1>Project Created: ${project.type}</h1>
      <p>Your project has been created and is awaiting payment.</p>
      <p>Package: ${project.package}</p>
      <p>Price: R${project.price}</p>
      <a href="${process.env.FRONTEND_URL}/payment/${project.id}">Complete Payment</a>
    `;
  }

  getStatusUpdateTemplate(project, user) {
    return `
      <h1>Project Status Update</h1>
      <p>Your ${project.type} project is now: ${project.status}</p>
      <p>Progress: ${project.progress}%</p>
      <a href="${process.env.FRONTEND_URL}/client-dashboard">View Dashboard</a>
    `;
  }

  getPaymentTemplate(payment, project, user) {
    return `
      <h1>Payment Confirmed</h1>
      <p>Amount: R${payment.amount}</p>
      <p>Project: ${project.type} - ${project.package}</p>
      <p>Our AI agents are now processing your project.</p>
    `;
  }

  getPayoutTemplate(payout, user) {
    return `
      <h1>Weekly Payout Processed</h1>
      <p>Total: R${payout.totalAmount}</p>
      <p>Breakdown:</p>
      <ul>
        <li>FNB: R${payout.breakdown.fnb}</li>
        <li>African Bank: R${payout.breakdown.africanBank}</li>
        <li>AI FNB: R${payout.breakdown.aiFnb}</li>
        <li>Reserve FNB: R${payout.breakdown.reserveFnb}</li>
        <li>Retained: R${payout.breakdown.retained}</li>
      </ul>
    `;
  }

  getReportTemplate(project, metrics, user) {
    return `
      <h1>Campaign Report: ${project.name}</h1>
      <p>Period: Last 7 days</p>
      <ul>
        <li>Impressions: ${metrics.impressions}</li>
        <li>Clicks: ${metrics.clicks}</li>
        <li>Conversions: ${metrics.conversions}</li>
        <li>Spend: R${metrics.spend}</li>
        <li>Revenue: R${metrics.revenue}</li>
        <li>ROI: ${metrics.roi}%</li>
      </ul>
      <a href="${process.env.FRONTEND_URL}/client-dashboard">View Full Dashboard</a>
    `;
  }
}

module.exports = new EmailService();
