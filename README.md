# qris-dinamis

A lightweight utility for working with **QRIS (QR Indonesia Standard)** codes.  
This library helps you **parse** existing QRIS payloads and **generate** new QR codes with dynamic amounts.

---

## Installation

```bash
npm install qris-dinamis
```

---

## Usage in Project

### 1. Decode QR Code from Image

Before you can parse QRIS data, you first need to extract the QR string (`rawData`) from an image.  
In the project, this is done using **Jimp** (for image handling) and **jsQR** (for QR decoding):

```js
const Jimp = require("jimp");
const jsQR = require("jsqr");

async function decodeQRCode(imagePath) {
  try {
    const image = await Jimp.read(imagePath);
    const { data, width, height } = image.bitmap;
    const imageData = new Uint8ClampedArray(data.buffer);

    const qrCode = jsQR(imageData, width, height);

    if (qrCode) {
      return qrCode.data; // <-- this is rawData
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error decoding QR code:", error);
    return null;
  }
}
```

`rawData` is simply the decoded string payload extracted from the QR image.  
This payload is then passed into `qris-dinamis` functions.

---

### 2. Parse QRIS Data

```js
const qrisDinamis = require("qris-dinamis");

const rawData = await decodeQRCode("./uploads/sample.png"); // from QR image
const parsed = qrisDinamis.dataQris(rawData);

console.log(parsed);
// { merchantId: "...", merchantName: "...", ... }
```

---

### 3. Generate QR Code with Nominal Amount (Base64)

```js
const qrisDinamis = require("qris-dinamis");

(async () => {
  const rawData = await decodeQRCode("./uploads/sample.png");

  const base64 = await qrisDinamis.makeQr(rawData, {
    nominal: "50000", // amount in IDR
    base64: true,
  });

  console.log(base64); // data:image/png;base64,...
})();
```

---

## API Summary (Used in this Project)

- `decodeQRCode(imagePath)` → Extract QRIS payload string (`rawData`) from an image.  
- `dataQris(data)` → Parse QRIS payload into JSON object.  
- `makeQr(data, options)` → Generate a QR code (with dynamic nominal).  

Options for `makeQr`:
- `nominal` (string) – Amount to inject into QR.  
- `base64` (boolean) – If true, returns base64 string instead of buffer.  

---

## Example Integration

Inside a service function:

```js
const qrisDinamis = require("qris-dinamis");

async function generateQrisQR(rawData, amount) {
  const parsed = qrisDinamis.dataQris(rawData);
  console.log("Parsed QR:", parsed);

  const base64 = await qrisDinamis.makeQr(rawData, {
    nominal: String(amount),
    base64: true,
  });

  return base64;
}
```
