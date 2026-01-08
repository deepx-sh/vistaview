import DOMPurify from 'isomorphic-dompurify';

const escapeHtml = (str) => {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
};

export const verifyEmailTemplate = (name,otp) => {
    const safeName = DOMPurify.sanitize(escapeHtml(name));
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px;">
          <table width="100%" max-width="480px" style="background:#ffffff;border-radius:8px;padding:24px;">
            <tr>
              <td style="text-align:center;">
                <h2 style="color:#0F766E;margin-bottom:8px;">PlaceTrust</h2>
                <p style="color:#334155;font-size:16px;margin:0;">
                  Verify your email address
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 0;color:#334155;font-size:14px;">
                Hi ,<br /><br />
                Thanks for signing up on <b>VistaView</b>.
                Use the verification code below to complete your registration.
              </td>
            </tr>

            <tr>
              <td align="center">
                <div
                  style="
                    background:#f1f5f9;
                    display:inline-block;
                    padding:12px 24px;
                    border-radius:6px;
                    font-size:22px;
                    font-weight:bold;
                    letter-spacing:4px;
                    color:#0F766E;
                  "
                >
                  ${otp}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding-top:20px;color:#64748b;font-size:13px;">
                This code is valid for <b>10 minutes</b>.
                If you didn’t request this, you can safely ignore this email.
              </td>
            </tr>

            <tr>
              <td style="padding-top:30px;color:#94a3b8;font-size:12px;text-align:center;">
                © VistaView • Travel with confidence
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
};

export const resetPasswordTemplate = (name, otp) => {
    const safeName = DOMPurify.sanitize(escapeHtml(name));

    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px;">
          <table width="100%" max-width="480px" style="background:#ffffff;border-radius:8px;padding:24px;">
            <tr>
              <td style="text-align:center;">
                <h2 style="color:#0F766E;margin-bottom:8px;">PlaceTrust</h2>
                <p style="color:#334155;font-size:16px;margin:0;">
                  Password Reset Request
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 0;color:#334155;font-size:14px;">
                Hi ,<br /><br />
                We received a request to reset your VistaView password.
                Use the code below to continue.
              </td>
            </tr>

            <tr>
              <td align="center">
                <div
                  style="
                    background:#fef2f2;
                    display:inline-block;
                    padding:12px 24px;
                    border-radius:6px;
                    font-size:22px;
                    font-weight:bold;
                    letter-spacing:4px;
                    color:#FB7185;
                  "
                >
                  ${otp}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding-top:20px;color:#64748b;font-size:13px;">
                This code expires in <b>5 minutes</b>.
                If you didn’t request a password reset, ignore this email.
              </td>
            </tr>

            <tr>
              <td style="padding-top:30px;color:#94a3b8;font-size:12px;text-align:center;">
                © VistaView • Secure travel experiences
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
}