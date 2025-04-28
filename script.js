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
const downloadFormatSelect = document.getElementById("downloadFormat");
const previewDiv = document.getElementById("qrPreview");

// --- Logo Handling ---
const removeLogoBtn = document.getElementById("removeLogoBtn");
let logoPreview = document.getElementById("logoPreview"); // Assuming you add <img id="logoPreview" style="max-width: 50px; ..."> near the upload button

// Tabs
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

// Advanced
const errorCorrectionLevelSelect = document.getElementById(
  "errorCorrectionLevel"
);
const qrMarginSlider = document.getElementById("qrMargin");

// --- Tab Switching Logic ---
function activateTab(targetTabId) {
  tabButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.getAttribute("data-tab") === targetTabId
    );
  });
  tabContents.forEach((content) => {
    content.classList.toggle("active", content.id === targetTabId);
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activateTab(button.getAttribute("data-tab"));
  });
});

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
  // Read basic content
  const text = textInput.value.trim();

  // Read advanced options
  const size = parseInt(sizeInput.value);
  const margin = qrMarginSlider ? parseInt(qrMarginSlider.value) : 10;
  const errorCorrectionLevel = errorCorrectionLevelSelect
    ? errorCorrectionLevelSelect.value
    : "H";

  // Read style & color options
  const bgColor = bgColorInput.value;
  const fgColor = fgColorInput.value;
  const currentDotStyle = dotStyleSelect ? dotStyleSelect.value : "square";
  const currentCornerSquareStyle = cornerSquareStyleSelect
    ? cornerSquareStyleSelect.value
    : "square";
  const currentCornerDotStyle = cornerDotStyleSelect
    ? cornerDotStyleSelect.value
    : "square";

  // Read logo options
  const currentLogoSize = logoSizeSlider
    ? parseFloat(logoSizeSlider.value)
    : 0.4;
  const currentLogoMargin = logoMarginSlider
    ? parseInt(logoMarginSlider.value)
    : 4;
  const currentHideBackground = logoBackgroundCheckbox
    ? logoBackgroundCheckbox.checked
    : true;

  // Basic validation
  if (!text) {
    alert("Please enter some text or URL in the Content tab.");
    activateTab("content-tab"); // Switch to content tab
    textInput.focus();
    return;
  }
  if (isNaN(size) || size < 50 || size > 2000) {
    alert("Please enter a size between 50 and 2000 in the Advanced tab.");
    activateTab("advanced-tab"); // Switch to advanced tab
    sizeInput.focus();
    return;
  }

  // Clear previous QR code (only if instance exists, otherwise append clears)
  if (qrCodeInstance) {
    previewDiv.innerHTML = "";
  }
  downloadBtn.disabled = true;
  // generateBtn no longer strictly needed for triggering, but keep for visual feedback?
  // generateBtn.disabled = true;
  // generateBtn.textContent = 'Generating...';

  // --- Prepare options for qr-code-styling ---
  const options = {
    width: size,
    height: size,
    type: "canvas", // Keep as canvas for preview efficiency
    data: text,
    image: uploadedLogo || "",
    margin: margin, // Use read value
    qrOptions: {
      errorCorrectionLevel: errorCorrectionLevel, // Use read value
    },
    dotsOptions: {
      color: fgColor,
      type: currentDotStyle,
    },
    backgroundOptions: {
      color: bgColor,
    },
    imageOptions: {
      hideBackgroundDots: currentHideBackground,
      imageSize: currentLogoSize,
      margin: currentLogoMargin,
      crossOrigin: "anonymous",
    },
    cornersSquareOptions: {
      color: fgColor,
      type: currentCornerSquareStyle,
    },
    cornersDotOptions: {
      color: fgColor,
      type: currentCornerDotStyle,
    },
  };

  // Debounce actual instance update/creation slightly for smoother feel
  // Use a very short delay as styleControls already has debounce
  setTimeout(() => {
    try {
      if (!qrCodeInstance) {
        qrCodeInstance = new QRCodeStyling(options);
        qrCodeInstance.append(previewDiv);
      } else {
        qrCodeInstance.update(options);
      }

      downloadBtn.disabled = false;
      previewDiv.style.border = "none";
    } catch (error) {
      console.error("QR Code generation failed:", error);
      alert("Failed to generate QR code. Check console for details.");
      previewDiv.innerHTML = "Error generating QR code.";
      previewDiv.style.border = "1px dashed #ced4da";
    } finally {
      // generateBtn.disabled = false;
      // generateBtn.textContent = 'Generate QR Code';
    }
  }, 10); // Minimal delay
}

// --- QR Code Download (using qr-code-styling and jsPDF) ---
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
  const size =
    qrCodeInstance._options.width || parseInt(sizeInput.value) || 300;
  const format = downloadFormatSelect ? downloadFormatSelect.value : "png";
  const filename = `${text}_${size}x${size}`;

  // Disable button during download prep
  downloadBtn.disabled = true;
  downloadBtn.textContent = "Preparing...";

  if (format === "pdf") {
    // --- PDF Download Logic ---
    qrCodeInstance
      .getRawData("png")
      .then((blob) => {
        if (!blob) {
          throw new Error("Failed to get QR code image data.");
        }
        const { jsPDF } = window.jspdf; // Get jsPDF constructor
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "px", // Use pixels for easier coordination with QR size
          format: [size + 40, size + 40], // Set page size based on QR size + padding (e.g., 20px padding)
        });

        const padding = 20; // Define padding in pixels
        const imgWidth = size;
        const imgHeight = size;

        // Create an object URL for the image blob
        const objectURL = URL.createObjectURL(blob);

        // Add image to PDF (centered with padding)
        doc.addImage(objectURL, "PNG", padding, padding, imgWidth, imgHeight);

        // Clean up the object URL immediately after adding
        URL.revokeObjectURL(objectURL);

        // Save the PDF
        doc.save(filename + ".pdf");
        console.log("PDF Download initiated.");
      })
      .catch((error) => {
        console.error("PDF Download failed:", error);
        alert("Failed to generate PDF for download. See console for details.");
      })
      .finally(() => {
        // Re-enable button regardless of success/failure
        downloadBtn.disabled = false;
        downloadBtn.textContent = "Download";
      });
  } else {
    // --- Standard Download Logic (PNG, SVG, JPEG, WEBP) ---
    let downloadExtension = format;
    // Ensure SVG download uses 'svg' type if QR instance is canvas
    // Note: For SVG download, the QR code generation type should ideally be 'svg' for best quality.
    // We might need to regenerate with type: 'svg' just for download if format is svg.
    // For now, we'll stick with the current instance type.
    if (format === "svg" && qrCodeInstance._options.type !== "svg") {
      console.warn(
        "Downloading canvas as SVG. For better quality, consider regenerating QR code as SVG type."
      );
      // Ideally, regenerate here: qrCodeInstance.update({ type: 'svg' }).then(...) then download
    }

    qrCodeInstance
      .download({
        name: filename,
        extension: downloadExtension,
      })
      .then(() => {
        console.log(`Download initiated as ${format}.`);
      })
      .catch((error) => {
        console.error("Download failed:", error);
        alert(`Failed to download QR code as ${format}.`);
      })
      .finally(() => {
        // Re-enable button regardless of success/failure
        downloadBtn.disabled = false;
        downloadBtn.textContent = "Download";
      });
  }
}

// --- Event Listeners ---

// generateBtn.addEventListener('click', generateQR); // Remove or repurpose if not needed
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

// Listener for live updates from ALL controls
const allControls = [
  textInput,
  sizeInput,
  fgColorInput,
  bgColorInput,
  dotStyleSelect,
  cornerSquareStyleSelect,
  cornerDotStyleSelect,
  logoSizeSlider,
  logoMarginSlider,
  logoBackgroundCheckbox,
  errorCorrectionLevelSelect,
  qrMarginSlider,
];

allControls.forEach((control) => {
  if (control) {
    const eventType =
      control.type === "checkbox" || control.type === "select-one"
        ? "change"
        : "input";
    let debounceTimeout;
    control.addEventListener(eventType, () => {
      clearTimeout(debounceTimeout);
      // Longer debounce for text input, shorter for others
      const delay = control === textInput ? 400 : 150;
      debounceTimeout = setTimeout(generateQR, delay);
    });
  } else {
    // console.warn("An input control element was not found.");
  }
});

// Update slider value displays (including new QR Margin slider)
const sliderValueDisplays = {
  logoSize: "logoSizeValue",
  logoMargin: "logoMarginValue",
  qrMargin: "qrMarginValue",
};
Object.entries(sliderValueDisplays).forEach(([sliderId, displayId]) => {
  const slider = document.getElementById(sliderId);
  const display = document.getElementById(displayId);
  if (slider && display) {
    slider.addEventListener(
      "input",
      () => (display.textContent = slider.value)
    );
    // Set initial value on load
    display.textContent = slider.value;
  }
});

// --- Initial State ---
downloadBtn.disabled = true;
// Activate the first tab on load
activateTab("content-tab");
// Generate initial QR on load
window.addEventListener("load", () => {
  if (textInput.value) generateQR();
  if (removeLogoBtn) removeLogoBtn.style.display = "none";
  // Update initial slider values
  Object.entries(sliderValueDisplays).forEach(([sliderId, displayId]) => {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);
    if (slider && display) {
      display.textContent = slider.value;
    }
  });
});
