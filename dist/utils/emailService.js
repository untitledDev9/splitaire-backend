"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBillSettledEmail = exports.sendPaymentMarkedEmail = exports.sendBillUpdatedEmail = exports.sendBillCreatedEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/config"));
const billCalculations_1 = require("./billCalculations");
/**
 * Create email transporter
 */
console.log("Here u gp", config_1.default.email);
const createTransporter = () => {
    return nodemailer_1.default.createTransport({
        host: config_1.default.email.host,
        port: config_1.default.email.port,
        secure: false, // true for 465, false for other ports
        auth: {
            user: config_1.default.email.user,
            pass: config_1.default.email.password,
        },
    });
};
/**
 * Send email
 */
const sendEmail = async (emailData) => {
    try {
        // Skip sending email if credentials are not configured
        if (!config_1.default.email.user || !config_1.default.email.password) {
            console.log('📧 Email service not configured. Email not sent to:', emailData.to);
            console.log('📧 Subject:', emailData.subject);
            return;
        }
        const transporter = createTransporter();
        const mailOptions = {
            from: `Bill Splitter <${config_1.default.email.from}>`,
            to: emailData.to,
            subject: emailData.subject,
            html: emailData.html,
            text: emailData.text || emailData.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
    }
    catch (error) {
        console.error('❌ Failed to send email:', error);
        // Don't throw error to prevent email failures from breaking the application
    }
};
exports.sendEmail = sendEmail;
/**
 * Send bill created notification
 */
const sendBillCreatedEmail = async (recipientEmail, recipientName, billName, billId, amountOwed, currency, createdBy) => {
    const billUrl = `${config_1.default.frontendUrl}/bill/${billId}`;
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .amount { font-size: 32px; font-weight: bold; color: #4F46E5; margin: 20px 0; }
        .button { display: inline-block; background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰 New Bill to Split</h1>
        </div>
        <div class="content">
          <p>Hi ${recipientName},</p>
          <p><strong>${createdBy}</strong> has created a new bill that involves you:</p>
          <h2>${billName}</h2>
          <div class="amount">${(0, billCalculations_1.formatCurrency)(amountOwed, currency)}</div>
          <p>This is your share of the total bill.</p>
          <p style="text-align: center;">
            <a href="${billUrl}" class="button">View Bill Details</a>
          </p>
          <p>You can view the complete breakdown, mark your payment as complete, and see who else is involved in splitting this bill.</p>
        </div>
        <div class="footer">
          <p>This is an automated message from Bill Splitter.</p>
          <p>If you have any questions, please contact ${createdBy} directly.</p>
        </div>
      </div>
    </body>
    </html>
  `;
    await (0, exports.sendEmail)({
        to: recipientEmail,
        subject: `New bill to split: ${billName}`,
        html,
    });
};
exports.sendBillCreatedEmail = sendBillCreatedEmail;
/**
 * Send bill updated notification
 */
const sendBillUpdatedEmail = async (recipientEmail, recipientName, billName, billId, newAmountOwed, currency, updatedBy) => {
    const billUrl = `${config_1.default.frontendUrl}/bill/${billId}`;
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #F59E0B; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .amount { font-size: 32px; font-weight: bold; color: #F59E0B; margin: 20px 0; }
        .button { display: inline-block; background-color: #F59E0B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📝 Bill Updated</h1>
        </div>
        <div class="content">
          <p>Hi ${recipientName},</p>
          <p><strong>${updatedBy}</strong> has updated the bill:</p>
          <h2>${billName}</h2>
          <div class="amount">${(0, billCalculations_1.formatCurrency)(newAmountOwed, currency)}</div>
          <p>Your new share of the bill is shown above.</p>
          <p style="text-align: center;">
            <a href="${billUrl}" class="button">View Updated Bill</a>
          </p>
          <p>Please review the changes and ensure everything looks correct.</p>
        </div>
        <div class="footer">
          <p>This is an automated message from Bill Splitter.</p>
        </div>
      </div>
    </body>
    </html>
  `;
    await (0, exports.sendEmail)({
        to: recipientEmail,
        subject: `Bill updated: ${billName}`,
        html,
    });
};
exports.sendBillUpdatedEmail = sendBillUpdatedEmail;
/**
 * Send payment marked notification
 */
const sendPaymentMarkedEmail = async (recipientEmail, recipientName, billName, billId, participantName, amountPaid, currency) => {
    const billUrl = `${config_1.default.frontendUrl}/bill/${billId}`;
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #10B981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .amount { font-size: 32px; font-weight: bold; color: #10B981; margin: 20px 0; }
        .button { display: inline-block; background-color: #10B981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Payment Received</h1>
        </div>
        <div class="content">
          <p>Hi ${recipientName},</p>
          <p>Great news! <strong>${participantName}</strong> has marked their payment as complete for:</p>
          <h2>${billName}</h2>
          <div class="amount">${(0, billCalculations_1.formatCurrency)(amountPaid, currency)}</div>
          <p style="text-align: center;">
            <a href="${billUrl}" class="button">View Bill Status</a>
          </p>
          <p>Check the bill to see the current payment status of all participants.</p>
        </div>
        <div class="footer">
          <p>This is an automated message from Bill Splitter.</p>
        </div>
      </div>
    </body>
    </html>
  `;
    await (0, exports.sendEmail)({
        to: recipientEmail,
        subject: `Payment marked for: ${billName}`,
        html,
    });
};
exports.sendPaymentMarkedEmail = sendPaymentMarkedEmail;
/**
 * Send bill settled notification
 */
const sendBillSettledEmail = async (recipientEmail, recipientName, billName, billId, totalAmount, currency) => {
    const billUrl = `${config_1.default.frontendUrl}/bill/${billId}`;
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #8B5CF6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; text-align: center; }
        .amount { font-size: 32px; font-weight: bold; color: #8B5CF6; margin: 20px 0; }
        .celebration { font-size: 48px; margin: 20px 0; }
        .button { display: inline-block; background-color: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Bill Fully Settled!</h1>
        </div>
        <div class="content">
          <div class="celebration">🎊 🥳 🎊</div>
          <p>Hi ${recipientName},</p>
          <p>Excellent news! The bill has been fully settled:</p>
          <h2>${billName}</h2>
          <div class="amount">${(0, billCalculations_1.formatCurrency)(totalAmount, currency)}</div>
          <p><strong>All participants have marked their payments as complete!</strong></p>
          <p style="text-align: center;">
            <a href="${billUrl}" class="button">View Final Bill</a>
          </p>
        </div>
        <div class="footer">
          <p>This is an automated message from Bill Splitter.</p>
          <p>Thank you for using our service!</p>
        </div>
      </div>
    </body>
    </html>
  `;
    await (0, exports.sendEmail)({
        to: recipientEmail,
        subject: `Bill settled: ${billName} 🎉`,
        html,
    });
};
exports.sendBillSettledEmail = sendBillSettledEmail;
//# sourceMappingURL=emailService.js.map