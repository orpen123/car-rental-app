































































































































































































































import { Resend } from 'resend';


const getResend = () => new Resend(process.env.RESEND_API_KEY);


export const sendWelcomeEmail = async ({ name, email }) => {
  try {
    await getResend().emails.send({
      from: `${process.env.APP_NAME} <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: '🚗 Welcome to CarRental!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background:#eaecf5;font-family:'Inter',Arial,sans-serif;">
          <div style="max-width:560px;margin:40px auto;background:white;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
            
            <div style="background:linear-gradient(135deg,#3b82f6,#6366f1);padding:40px 32px;text-align:center;">
              <h1 style="color:white;font-size:28px;font-weight:800;margin:0;letter-spacing:-0.5px;">🚗 CarRental</h1>
              <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Your journey starts here</p>
            </div>

            <div style="padding:36px 32px;">
              <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 8px;">Welcome, ${name}! 👋</h2>
              <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Your account has been created successfully. You can now browse our fleet and book your dream car!
              </p>

              <div style="background:#f9fafb;border-radius:16px;padding:20px;margin-bottom:24px;">
                <p style="color:#374151;font-size:13px;font-weight:600;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">What you can do:</p>
                ${[
                  '🚗 Browse 500+ cars',
                  '📅 Book instantly online',
                  '❌ Free cancellation',
                  '📍 Multiple locations',
                ]
                  .map(
                    (item) => `
                  <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                    <p style="color:#374151;font-size:14px;margin:0;">${item}</p>
                  </div>
                `,
                  )
                  .join('')}
              </div>

              <a href="${process.env.CLIENT_URL}/cars" style="display:block;background:linear-gradient(135deg,#3b82f6,#6366f1);color:white;text-decoration:none;text-align:center;padding:14px 24px;border-radius:14px;font-weight:600;font-size:15px;">
                Browse Cars Now →
              </a>
            </div>

            <div style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #f3f4f6;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">© 2025 CarRental. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log('✅ Welcome email sent to:', email);
  } catch (error) {
    console.error('❌ Email error:', error);
  }
};


export const sendBookingConfirmationEmail = async ({
  name,
  email,
  booking,
  car,
}) => {
  try {
    await getResend().emails.send({
      from: `${process.env.APP_NAME} <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: `Booking Confirmed — ${car.brand} ${car.model}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#eaecf5;font-family:'Inter',Arial,sans-serif;">
          <div style="max-width:560px;margin:40px auto;background:white;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
            
            <div style="background:linear-gradient(135deg,#3b82f6,#6366f1);padding:40px 32px;text-align:center;">
              <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
                <span style="font-size:28px;">✅</span>
              </div>
              <h1 style="color:white;font-size:22px;font-weight:800;margin:0;">Booking Confirmed!</h1>
              <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">Your car is reserved</p>
            </div>

            <div style="padding:36px 32px;">
              <p style="color:#6b7280;font-size:15px;margin:0 0 24px;">
                Hi <strong style="color:#111827;">${name}</strong>, your booking has been confirmed!
              </p>

              <div style="background:#f9fafb;border-radius:16px;padding:20px;margin-bottom:20px;">
                <p style="color:#374151;font-size:13px;font-weight:700;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.5px;">🚗 Car Details</p>
                <table style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="color:#6b7280;font-size:13px;padding:6px 0;">Car</td>
                    <td style="color:#111827;font-size:13px;font-weight:600;text-align:right;">${car.brand} ${car.model} ${car.year}</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:13px;padding:6px 0;">Type</td>
                    <td style="color:#111827;font-size:13px;font-weight:600;text-align:right;text-transform:capitalize;">${car.type}</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:13px;padding:6px 0;">Fuel</td>
                    <td style="color:#111827;font-size:13px;font-weight:600;text-align:right;text-transform:capitalize;">${car.fuel}</td>
                  </tr>
                </table>
              </div>

              <div style="background:#f9fafb;border-radius:16px;padding:20px;margin-bottom:20px;">
                <p style="color:#374151;font-size:13px;font-weight:700;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.5px;">📅 Booking Details</p>
                <table style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="color:#6b7280;font-size:13px;padding:6px 0;">Start Date</td>
                    <td style="color:#111827;font-size:13px;font-weight:600;text-align:right;">${new Date(booking.startDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:13px;padding:6px 0;">End Date</td>
                    <td style="color:#111827;font-size:13px;font-weight:600;text-align:right;">${new Date(booking.endDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:13px;padding:6px 0;">Duration</td>
                    <td style="color:#111827;font-size:13px;font-weight:600;text-align:right;">${booking.totalDays} day${booking.totalDays > 1 ? 's' : ''}</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:13px;padding:6px 0;">Pickup</td>
                    <td style="color:#111827;font-size:13px;font-weight:600;text-align:right;">${booking.pickupLocation || 'N/A'}</td>
                  </tr>
                </table>
              </div>

              <div style="background:linear-gradient(135deg,#eff6ff,#eef2ff);border-radius:16px;padding:20px;margin-bottom:24px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="color:#374151;font-size:15px;font-weight:600;">Total Amount</span>
                  <span style="color:#3b82f6;font-size:24px;font-weight:800;">$${booking.totalPrice}</span>
                </div>
              </div>

              <a href="${process.env.CLIENT_URL}/profile" style="display:block;background:linear-gradient(135deg,#3b82f6,#6366f1);color:white;text-decoration:none;text-align:center;padding:14px 24px;border-radius:14px;font-weight:600;font-size:15px;">
                View My Booking →
              </a>
            </div>

            <div style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #f3f4f6;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">© 2025 CarRental • Free cancellation available</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log('✅ Booking confirmation email sent to:', email);
  } catch (error) {
    console.error('❌ Email error:', error);
  }
};


export const sendBookingCancellationEmail = async ({
  name,
  email,
  booking,
  car,
}) => {
  try {
    await getResend().emails.send({
      from: `${process.env.APP_NAME} <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: `❌ Booking Cancelled — ${car.brand} ${car.model}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#eaecf5;font-family:'Inter',Arial,sans-serif;">
          <div style="max-width:560px;margin:40px auto;background:white;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

            <div style="background:linear-gradient(135deg,#ef4444,#dc2626);padding:40px 32px;text-align:center;">
              <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
                <span style="font-size:28px;">❌</span>
              </div>
              <h1 style="color:white;font-size:22px;font-weight:800;margin:0;">Booking Cancelled</h1>
              <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">Your booking has been cancelled</p>
            </div>

            <div style="padding:36px 32px;">
              <p style="color:#6b7280;font-size:15px;margin:0 0 24px;">
                Hi <strong style="color:#111827;">${name}</strong>, your booking for <strong style="color:#111827;">${car.brand} ${car.model}</strong> has been cancelled.
              </p>

              <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:16px;padding:16px;margin-bottom:24px;">
                <p style="color:#dc2626;font-size:13px;font-weight:600;margin:0 0 4px;">💳 Refund Information</p>
                <p style="color:#6b7280;font-size:13px;margin:0;">A refund of <strong style="color:#111827;">$${booking.totalPrice}</strong> will be processed within 3-5 business days.</p>
              </div>

              <a href="${process.env.CLIENT_URL}/cars" style="display:block;background:linear-gradient(135deg,#3b82f6,#6366f1);color:white;text-decoration:none;text-align:center;padding:14px 24px;border-radius:14px;font-weight:600;font-size:15px;">
                Browse Other Cars →
              </a>
            </div>

            <div style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #f3f4f6;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">© 2025 CarRental • We hope to see you again soon</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log('✅ Cancellation email sent to:', email);
  } catch (error) {
    console.error('❌ Email error:', error);
  }
};
