type GenerateA4QrImageParams = {
  qrUrl: string;
  clientName: string;
  logoUrl?: string;
};

export const generateA4QrImage = async ({
  qrUrl,
  clientName,
  logoUrl = "/crm_admin/logo-ac.png",
}: GenerateA4QrImageParams) => {
  const canvas = document.createElement("canvas");

  const A4_WIDTH = 2480;
  const A4_HEIGHT = 3508;

  canvas.width = A4_WIDTH;
  canvas.height = A4_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // White background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, A4_WIDTH, A4_HEIGHT);

  // Load QR image
  const qrImg = new Image();
  qrImg.src = qrUrl;

  // Load logo
  const logoImg = new Image();
  logoImg.src = logoUrl;

  await Promise.all([
    new Promise((resolve) => {
      qrImg.onload = () => resolve(true);
    }),
    new Promise((resolve) => {
      logoImg.onload = () => resolve(true);
    }),
  ]);

  // QR
  const qrSize = 1800;

  ctx.drawImage(
    qrImg,
    (A4_WIDTH - qrSize) / 2,
    150,
    qrSize,
    qrSize
  );

  // Client name
  ctx.fillStyle = "#000";
  ctx.font = "bold 80px Arial";
  ctx.textAlign = "center";

  ctx.fillText(clientName, A4_WIDTH / 2, 2100);

  // Logo
  const logoWidth = 1300;
  const logoHeight = 900;

  ctx.drawImage(
    logoImg,
    (A4_WIDTH - logoWidth) / 2,
    2200,
    logoWidth,
    logoHeight
  );

  // Download
  const output = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = output;
  link.download = `${clientName}-A4-QR.png`;
  link.click();
};