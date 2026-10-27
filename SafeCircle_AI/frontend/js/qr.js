export function setupQR() {
  const input = document.querySelector("#qr-image");
  const status = document.querySelector("#qr-status");

  input.addEventListener("change", async event => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      status.textContent = "Choose an image smaller than 5 MB.";
      return;
    }

    let bitmap;

    try {
      if (!("BarcodeDetector" in window)) {
        throw new Error(
          "QR decoding is unavailable here. Paste the destination manually."
        );
      }

      const formats =
        await window.BarcodeDetector.getSupportedFormats();

      if (!formats.includes("qr_code")) {
        throw new Error(
          "This browser cannot decode QR images. Paste the destination manually."
        );
      }

      status.textContent = "Reading QR image locally…";

      bitmap = await createImageBitmap(file);

      const detector = new window.BarcodeDetector({
        formats: ["qr_code"]
      });

      const codes = await detector.detect(bitmap);

      if (codes.length !== 1) {
        throw new Error(
          "Choose an image containing exactly one readable QR code."
        );
      }

      document.querySelector("#content").value =
        codes[0].rawValue;

      status.textContent =
        "Decoded. Review the text and run the check. No link was opened.";
    } catch (error) {
      status.textContent = error.message;
    } finally {
      bitmap?.close();
    }
  });
}