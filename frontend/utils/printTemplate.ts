export interface MerchantPosterOptions {
  username: string;
  qrPayload: string;
  selectedColor: string;
  selectedBgColor?: string;
}

export const generateMerchantPosterHtml = ({
  username,
  qrPayload,
  selectedColor,
  selectedBgColor = '#ffffff',
}: MerchantPosterOptions): string => {
  const cleanHex = selectedColor.replace('#', '');
  const cleanBgHex = selectedBgColor.replace('#', '');
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
    qrPayload
  )}&color=${cleanHex}&bgcolor=${cleanBgHex}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      <style>
        @page { size: A4 portrait; margin: 20mm; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #ffffff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .stand-card {
          border: 3px solid ${selectedColor};
          border-radius: 32px;
          padding: 48px 40px;
          text-align: center;
          width: 360px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          background: #ffffff;
        }
        .logo {
          font-size: 32px;
          font-weight: 900;
          color: ${selectedColor};
          letter-spacing: -1px;
          margin-bottom: 4px;
        }
        .logo span {
          color: #0f172a;
        }
        .tagline {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 24px;
        }
        .qr-box {
          background: ${selectedBgColor};
          border: 2px solid ${selectedColor}30;
          border-radius: 24px;
          padding: 20px;
          margin: 0 auto 24px auto;
          display: inline-block;
          box-shadow: inset 0 2px 8px rgba(0,0,0,0.04);
        }
        .qr-box img {
          display: block;
          width: 240px;
          height: 240px;
          border-radius: 12px;
        }
        .account-name {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 6px;
        }
        .badge {
          display: inline-block;
          background: ${selectedColor}15;
          color: ${selectedColor};
          font-size: 13px;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 20px;
          margin-bottom: 20px;
        }
        .footer-text {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="stand-card">
        <div class="logo">Q<span>pay</span></div>
        <div class="tagline">Certified Merchant</div>

        <div class="qr-box">
          <img src="${qrImageUrl}" alt="Payment QR Code" />
        </div>

        <div class="account-name">${username || 'Merchant'}</div>
        <div class="badge">Scan with QPay or Camera</div>

        <div class="footer-text">
          Accepts instant, encrypted multi-currency payments.<br />
          Powered by QPay Network.
        </div>
      </div>
    </body>
    </html>
  `;
};
