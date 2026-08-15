export interface MerchantPosterOptions {
  username: string;
  qrPayload: string;
  selectedColor: string;
  selectedBgColor?: string;
}

export const generateMerchantPosterHtml = ({
  username,
  qrPayload,
  selectedColor = '#0ea5e9',
}: MerchantPosterOptions): string => {
  // Use dark QR pattern on crisp white background for high scan contrast
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
    qrPayload
  )}&color=0f172a&bgcolor=ffffff`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Dongle:wght@300;400;700&family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        @page { 
          size: A4 portrait; 
          margin: 15mm; 
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f1f5f9;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        /* Cut-out Merchant Poster Card */
        .merchant-stand {
          width: 380px;
          background-color: ${selectedColor};
          border-radius: 0;
          border: none;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          overflow: hidden;
          text-align: center;
        }

        /* Top White Header for QPay Logo */
        .header-banner {
          background-color: #ffffff;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo {
          font-family: 'Dongle', sans-serif;
          font-size: 58px;
          line-height: 0.8;
          font-weight: 700;
          letter-spacing: -1px;
        }
        .logo .q-letter {
          color: ${selectedColor};
        }
        .logo .pay-letter {
          color: #0f172a;
        }

        /* Poster Body */
        .poster-body {
          padding: 24px 28px 28px;
        }
        .cta-header {
          color: #ffffff;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 20px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        /* White Square QR Box (Unrounded, Clean Edge) */
        .qr-card {
          background-color: #ffffff;
          border-radius: 0;
          border: none;
          padding: 24px 20px 18px;
          margin: 0 auto;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .qr-card img {
          display: block;
          width: 250px;
          height: 250px;
          margin: 0 auto 14px;
          border-radius: 0;
        }
        .merchant-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        /* Footer Info */
        .footer-cta {
          margin-top: 22px;
          color: #ffffff;
        }
        .footer-main {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .footer-sub {
          font-size: 11px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
          margin-top: 5px;
        }
      </style>
    </head>
    <body>
      <div class="merchant-stand">
        <!-- Top White Header -->
        <div class="header-banner">
          <div class="logo">
            <span class="q-letter">Q</span><span class="pay-letter">pay</span>
          </div>
        </div>

        <!-- Poster Main Content -->
        <div class="poster-body">
          <div class="cta-header">Scan To Pay</div>

          <!-- White Square Box for QR and Merchant Name -->
          <div class="qr-card">
            <img src="${qrImageUrl}" alt="Payment QR Code" />
            <div class="merchant-title">${username || 'Merchant'}</div>
          </div>

          <!-- Bottom Footer Call to Action -->
          <div class="footer-cta">
            <div class="footer-sub">Instant Multi-Currency Mobile Payments</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

