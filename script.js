// Global variable to hold the QRCodeStyling instance
let qrCodeInstance = null;
let uploadedLogo = null; // To store the uploaded logo file data

// --- DOM Elements ---
// Basic Inputs
const textInput = document.getElementById("text");
const sizeInput = document.getElementById("size");
// Color Inputs (Keep for now, might integrate into styling options later)
const bgColorInput = document.getElementById("bgColor");
const fgColorInput = document.getElementById("fgColor");

// New Styling Inputs (Placeholders - need corresponding HTML elements)
const dotStyleSelect = document.getElementById("dotStyle"); // e.g., <select id="dotStyle">...
const cornerSquareStyleSelect = document.getElementById("cornerSquareStyle");
const cornerDotStyleSelect = document.getElementById("cornerDotStyle");
const logoUploadInput = document.getElementById("logoUpload"); // <input type="file" id="logoUpload">
const logoSizeSlider = document.getElementById("logoSize"); // <input type="range" id="logoSize">
const logoMarginSlider = document.getElementById("logoMargin");
const logoBackgroundCheckbox = document.getElementById("logoBackground"); // Hide dots behind logo

// Buttons & Preview
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const previewDiv = document.getElementById("qrPreview");

// --- Logo Handling ---
const removeLogoBtn = document.getElementById("removeLogoBtn");
let logoPreview = document.getElementById("logoPreview"); // Assuming you add <img id="logoPreview" style="max-width: 50px; ..."> near the upload button

function handleLogoUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      uploadedLogo = e.target.result; // Store base64 data URL
      if (logoPreview) logoPreview.src = uploadedLogo; // Show preview
      console.log("Logo uploaded.");
      generateQR(); // Trigger regeneration AFTER logo is loaded
    };
    reader.readAsDataURL(file);
    if (removeLogoBtn) removeLogoBtn.style.display = "inline-block"; // Show remove button
  } else {
    // Handle case where file selection is cancelled
    removeLogo();
  }
}

function removeLogo() {
  uploadedLogo = null;
  if (logoUploadInput) logoUploadInput.value = null; // Clear the file input
  if (logoPreview) logoPreview.src = ""; // Clear preview
  if (removeLogoBtn) removeLogoBtn.style.display = "none"; // Hide remove button
  console.log("Logo removed.");
  generateQR(); // Regenerate without logo
}

// --- QR Code Generation (using qr-code-styling) ---
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

  // --- Read current style values ---
  const currentDotStyle = dotStyleSelect ? dotStyleSelect.value : "square";
  const currentCornerSquareStyle = cornerSquareStyleSelect
    ? cornerSquareStyleSelect.value
    : "square";
  const currentCornerDotStyle = cornerDotStyleSelect
    ? cornerDotStyleSelect.value
    : "square";
  const currentLogoSize = logoSizeSlider
    ? parseFloat(logoSizeSlider.value)
    : 0.4;
  const currentLogoMargin = logoMarginSlider
    ? parseInt(logoMarginSlider.value)
    : 4;
  const currentHideBackground = logoBackgroundCheckbox
    ? logoBackgroundCheckbox.checked
    : true;

  // Clear previous QR code
  previewDiv.innerHTML = "";
  downloadBtn.disabled = true;
  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";

  // --- Prepare options for qr-code-styling ---
  const options = {
    width: size,
    height: size,
    type: "canvas", // or 'svg'
    data: text,
    image: uploadedLogo || "", // Use uploaded logo if available
    margin: 10, // Default margin, can be made configurable
    qrOptions: {
      errorCorrectionLevel: "H", // High correction level recommended with logos
    },
    dotsOptions: {
      color: fgColor,
      type: currentDotStyle, // Use read value
    },
    backgroundOptions: {
      color: bgColor,
    },
    imageOptions: {
      hideBackgroundDots: currentHideBackground, // Use read value
      imageSize: currentLogoSize, // Use read value
      margin: currentLogoMargin, // Use read value
      crossOrigin: "anonymous", // Needed for base64 image data
    },
    cornersSquareOptions: {
      color: fgColor,
      type: currentCornerSquareStyle, // Use read value
    },
    cornersDotOptions: {
      color: fgColor,
      type: currentCornerDotStyle, // Use read value
    },
  };

  // Use setTimeout to allow UI update
  setTimeout(() => {
    try {
      // Create or update the QR code instance
      if (!qrCodeInstance) {
        qrCodeInstance = new QRCodeStyling(options);
        qrCodeInstance.append(previewDiv);
      } else {
        qrCodeInstance.update(options);
      }

      downloadBtn.disabled = false;
      previewDiv.style.border = "none"; // Remove placeholder border
    } catch (error) {
      console.error("QR Code generation failed:", error);
      alert("Failed to generate QR code. Check console for details.");
      previewDiv.innerHTML = "Error generating QR code.";
      previewDiv.style.border = "1px dashed #ced4da"; // Restore border on error
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = "Generate QR Code";
    }
  }, 50);
}

// --- QR Code Download (using qr-code-styling) ---
function downloadQR() {
  if (!qrCodeInstance) {
    alert("Please generate a QR code first.");
    return;
  }

  const text =
    textInput.value
      .trim()
      .substring(0, 30)
      .replace(/[^a-zA-Z0-9]/g, "_") || "qrcode";
  // Get size from the instance options or input - instance might be more reliable
  const size =
    qrCodeInstance._options.width || parseInt(sizeInput.value) || 300;
  const filename = `${text}_${size}x${size}`;

  // Use the library's download method
  qrCodeInstance
    .download({
      name: filename,
      extension: "png", // Can also be 'jpeg', 'webp', or 'svg' if type is svg
    })
    .then(() => {
      console.log("Download initiated.");
    })
    .catch((error) => {
      console.error("Download failed:", error);
      alert("Failed to download QR code.");
    });

  // Note: The previous padding logic is removed as the library might handle margins differently,
  // and adding padding *after* styling (like logo) might be complex.
  // We rely on the library's 'margin' option within qrOptions or imageOptions for spacing.
}

// --- Event Listeners ---

generateBtn.addEventListener("click", generateQR);
downloadBtn.addEventListener("click", downloadQR);

// Listener for logo upload
if (logoUploadInput) {
  logoUploadInput.addEventListener("change", handleLogoUpload);
} else {
  console.warn("Logo upload input element not found.");
}

// Listener for Remove Logo button
if (removeLogoBtn) {
  removeLogoBtn.addEventListener("click", removeLogo);
  removeLogoBtn.style.display = "none"; // Initially hidden
} else {
  console.warn("Remove logo button element not found.");
}

// Listener for live updates from style controls
const styleControls = [
  sizeInput,
  fgColorInput,
  bgColorInput,
  dotStyleSelect,
  cornerSquareStyleSelect,
  cornerDotStyleSelect,
  logoSizeSlider,
  logoMarginSlider,
  logoBackgroundCheckbox,
];

styleControls.forEach((control) => {
  if (control) {
    const eventType =
      control.type === "checkbox" || control.type === "select-one"
        ? "change"
        : "input";
    // Add small debounce to prevent excessive regeneration on sliders
    let debounceTimeout;
    control.addEventListener(eventType, () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(generateQR, 150); // Adjust delay as needed
    });
  } else {
    // Log if any expected control is missing (check IDs in HTML)
    // console.warn("A style control element was not found.");
  }
});

// Update slider value displays
if (logoSizeSlider) {
  const valueDisplay = document.getElementById("logoSizeValue");
  if (valueDisplay) {
    logoSizeSlider.addEventListener(
      "input",
      () => (valueDisplay.textContent = logoSizeSlider.value)
    );
  }
}
if (logoMarginSlider) {
  const valueDisplay = document.getElementById("logoMarginValue");
  if (valueDisplay) {
    logoMarginSlider.addEventListener(
      "input",
      () => (valueDisplay.textContent = logoMarginSlider.value)
    );
  }
}

// Optional: Generate QR on Enter key press
textInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    generateQR();
  }
});
sizeInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    generateQR();
  }
});

// --- Initial State ---
downloadBtn.disabled = true;
// Optionally generate a default QR code on load if needed
window.addEventListener("load", () => {
  if (textInput.value) generateQR();
  if (removeLogoBtn) removeLogoBtn.style.display = "none"; // Ensure remove button is hidden on load
});
