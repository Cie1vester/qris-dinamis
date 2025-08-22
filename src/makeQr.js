const QRCode = require("qrcode");
const fs = require("fs");

const makeQr = async (
  qris,
  { nominal, base64 = false, taxtype = "p", fee = "0", path = "" } = {}
) => {
  try {
    // Generate the QR string with amount and CRC
    const makeString = require("./makeString");
    const qrisModified = makeString(qris, { nominal, taxtype, fee });

    // Set output path if not provided
    if (!path) {
      path = `output/qris-${Date.now()}.png`;
    }

    // Generate QR image (PNG)
    if (base64) {
      const base64Image = await QRCode.toDataURL(qrisModified, {
        margin: 2,
        scale: 10,
      });
      return base64Image; // Return base64 string directly
    } else {
      await QRCode.toFile(path, qrisModified, { margin: 2, scale: 10 });
      return path; // Return file path
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = makeQr;
