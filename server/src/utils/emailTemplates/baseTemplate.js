const baseTemplate = ({ title, content }) => {
    return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f4f6f8;
          padding: 20px;
        }
        .container {
          background: #ffffff;
          max-width: 600px;
          margin: auto;
          padding: 24px;
          border-radius: 8px;
        }
        h2 {
          color: #222;
        }
        p {
          color: #555;
          line-height: 1.6;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>${title}</h2>
        ${content}
        <div class="footer">
          <p>VistaView Team</p>
        </div>
      </div>
    </body>
  </html>
  `;
};

export default baseTemplate;