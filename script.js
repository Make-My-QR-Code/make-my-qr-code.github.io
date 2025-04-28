let qrcode = null; // Variable to hold the QRCode instance

// Get DOM elements
const textInput = document.getElementById("text");
const sizeInput = document.getElementById("size");
const bgColorInput = document.getElementById("bgColor");
const fgColorInput = document.getElementById("fgColor");
const generateBtn = document.getElementById("generateBtn"); // Added ID in HTML
const downloadBtn = document.getElementById("downloadBtn");
const previewDiv = document.getElementById("qrPreview");

// --- QR Code Generation ---
function generateQR() {
  const text = textInput.value.trim();
  const size = parseInt(sizeInput.value);
  const bgColor = bgColorInput.value;
  const fgColor = fgColorInput.value;

  // Basic validation
  if (!text) {
    alert("Please enter some text or URL");
    textInput.focus();
    return;
  }
  if (isNaN(size) || size < 50 || size > 2000) {
    alert("Please enter a size between 50 and 2000");
    sizeInput.focus();
    return;
  }

  // Clear previous QR code
  previewDiv.innerHTML = "";
  previewDiv.style.border = "1px dashed #ced4da"; // Reset border
  downloadBtn.disabled = true;

  // Disable button during generation
  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";

  // Use setTimeout to allow UI update before potentially blocking QR code generation
  setTimeout(() => {
    try {
      // Generate new QR code using the qrcode.js library
      qrcode = new QRCode(previewDiv, {
        text: text,
        width: size,
        height: size,
        colorDark: fgColor,
        colorLight: bgColor,
        correctLevel: QRCode.CorrectLevel.H, // High error correction
      });

      // Visually confirm generation
      previewDiv.style.border = "none"; // Remove border after generation

      // Enable download button
      downloadBtn.disabled = false;
    } catch (error) {
      console.error("QR Code generation failed:", error);
      alert(
        "Failed to generate QR code. Please check your input or try again."
      );
      previewDiv.innerHTML = "Error generating QR code."; // Show error in preview
    } finally {
      // Re-enable button
      generateBtn.disabled = false;
      generateBtn.textContent = "Generate QR Code";
    }
  }, 50); // Small delay
}

// --- QR Code Download ---
function downloadQR() {
  if (!qrcode || !previewDiv.querySelector("canvas")) {
    alert("Please generate a QR code first");
    return;
  }

  const canvas = previewDiv.querySelector("canvas");
  const text =
    textInput.value
      .trim()
      .substring(0, 30)
      .replace(/[^a-zA-Z0-9]/g, "_") || "qrcode";
  const filename = `${text}_${canvas.width}x${canvas.height}.png`;

  try {
    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a); // Append to body to ensure visibility
        a.click();
        document.body.removeChild(a); // Clean up
        URL.revokeObjectURL(url); // Release object URL memory
      } else {
        throw new Error("Canvas toBlob returned null");
      }
    }, "image/png");
  } catch (error) {
    console.error("Download failed:", error);
    alert(
      "Failed to download QR code. Your browser might not support this feature or there was an error."
    );
  }
}

// --- Event Listeners ---

// Add listener to the Generate button
generateBtn.addEventListener("click", generateQR);

// Add listener to the Download button
downloadBtn.addEventListener("click", downloadQR);

// Optional: Generate QR on Enter key press in the text input
textInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission if inside a form
    generateQR();
  }
});

// Optional: Generate QR on Enter key press in the size input
sizeInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    generateQR();
  }
});

// Set initial state
downloadBtn.disabled = true;

// Trigger generation on load if there's default text
// window.addEventListener('load', () => {
//     if (textInput.value) {
//         generateQR();
//     }
// });
