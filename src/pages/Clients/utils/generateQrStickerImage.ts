type GenerateQrStickerImageParams = {
  qrUrl: string;
  clientName: string;
  logoUrl?: string;
};

export const generateQrStickerImage = async ({
  qrUrl,
  clientName,
  logoUrl = "/crm_admin/logo-ac.png",
}: GenerateQrStickerImageParams) => {
  const canvas = document.createElement("canvas");

  // Format autocollant (~5x6cm à 300dpi), pas au format A4.
  const STICKER_WIDTH = 600;
  const STICKER_HEIGHT = 750;

  canvas.width = STICKER_WIDTH;
  canvas.height = STICKER_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // White background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, STICKER_WIDTH, STICKER_HEIGHT);

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
  const qrSize = 450;

  ctx.drawImage(
    qrImg,
    (STICKER_WIDTH - qrSize) / 2,
    40,
    qrSize,
    qrSize
  );

  // Client name
  ctx.fillStyle = "#000";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";

  ctx.fillText(clientName, STICKER_WIDTH / 2, 530);

  // Logo
  const logoWidth = 220;
  const logoHeight = 152;

  ctx.drawImage(
    logoImg,
    (STICKER_WIDTH - logoWidth) / 2,
    570,
    logoWidth,
    logoHeight
  );

  // Download
  const output = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = output;
  link.download = `${clientName}-QR-autocollant.png`;
  link.click();
};
