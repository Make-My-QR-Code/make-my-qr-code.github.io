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
const templateGallery = document.getElementById("templateGallery"); // Added template gallery element

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

// Style & Color
// Gradient - Dots
const dotGradientEnableCheckbox = document.getElementById("dotGradientEnable");
const dotGradientControlsDiv = document.getElementById("dotGradientControls");
const dotSolidColorGroupDiv = document.getElementById("dotSolidColorGroup");
const dotGradientTypeLinearRadio = document.getElementById("dotGradientLinear"); // Assuming Linear is default
const dotGradientColor1Input = document.getElementById("dotGradientColor1");
const dotGradientColor2Input = document.getElementById("dotGradientColor2");
const dotGradientRotationSlider = document.getElementById(
  "dotGradientRotation"
);
// Gradient - Background
const bgGradientEnableCheckbox = document.getElementById("bgGradientEnable");
const bgGradientControlsDiv = document.getElementById("bgGradientControls");
const bgSolidColorGroupDiv = document.getElementById("bgSolidColorGroup");
const bgGradientTypeLinearRadio = document.getElementById("bgGradientLinear");
const bgGradientColor1Input = document.getElementById("bgGradientColor1");
const bgGradientColor2Input = document.getElementById("bgGradientColor2");
const bgGradientRotationSlider = document.getElementById("bgGradientRotation");
// Gradient - Corner Squares
const cornerSquareGradientEnableCheckbox = document.getElementById(
  "cornerSquareGradientEnable"
);
const cornerSquareGradientControlsDiv = document.getElementById(
  "cornerSquareGradientControls"
);
const cornerSquareSolidColorGroupDiv = document.getElementById(
  "cornerSquareSolidColorGroup"
);
const cornerSquareColorInput = document.getElementById("cornerSquareColor"); // Solid color for corner squares
const cornerSquareGradientTypeLinearRadio = document.getElementById(
  "cornerSquareGradientLinear"
);
const cornerSquareGradientColor1Input = document.getElementById(
  "cornerSquareGradientColor1"
);
const cornerSquareGradientColor2Input = document.getElementById(
  "cornerSquareGradientColor2"
);
const cornerSquareGradientRotationSlider = document.getElementById(
  "cornerSquareGradientRotation"
);

// --- Template Definitions ---
const qrTemplates = [
  {
    name: "Classic Dark",
    options: {
      dotsOptions: { type: "square", color: "#000000" },
      cornersSquareOptions: { type: "square", color: "#000000" },
      cornersDotOptions: { type: "square", color: "#000000" },
      backgroundOptions: { color: "#FFFFFF" },
    },
  },
  {
    name: "Blue Rounded",
    options: {
      dotsOptions: { type: "rounded", color: "#007bff" },
      cornersSquareOptions: { type: "extra-rounded", color: "#0056b3" },
      cornersDotOptions: { type: "dot", color: "#0056b3" },
      backgroundOptions: { color: "#FFFFFF" },
    },
  },
  {
    name: "Green Classy",
    options: {
      dotsOptions: { type: "classy", color: "#198754" },
      cornersSquareOptions: { type: "extra-rounded", color: "#146c43" },
      cornersDotOptions: { type: "dot", color: "#146c43" },
      backgroundOptions: { color: "#f8f9fa" },
    },
  },
  {
    name: "Red Dots",
    options: {
      dotsOptions: { type: "dots", color: "#dc3545" },
      cornersSquareOptions: { type: "square", color: "#b02a37" },
      cornersDotOptions: { type: "square", color: "#b02a37" },
      backgroundOptions: { color: "#FFFFFF" },
    },
  },
  {
    name: "Orange Extra Rounded",
    options: {
      dotsOptions: { type: "extra-rounded", color: "#fd7e14" },
      cornersSquareOptions: { type: "extra-rounded", color: "#e6730d" },
      cornersDotOptions: { type: "dot", color: "#e6730d" },
      backgroundOptions: { color: "#FFFFFF" },
    },
  },
  // Add more templates here later (e.g., with gradients)
  {
    name: "Deep Ocean",
    options: {
      dotsOptions: { type: "dots", color: "#0d6efd" }, // Blue dots
      cornersSquareOptions: { type: "extra-rounded", color: "#0a58ca" }, // Darker blue corners
      cornersDotOptions: { type: "dot", color: "#0a58ca" },
      backgroundOptions: { color: "#e7f1ff" }, // Very light blue background
    },
  },
  {
    name: "Emerald Classy",
    options: {
      dotsOptions: { type: "classy-rounded", color: "#198754" }, // Green classy-rounded
      cornersSquareOptions: { type: "square", color: "#146c43" }, // Darker green square corners
      cornersDotOptions: { type: "square", color: "#146c43" },
      backgroundOptions: { color: "#FFFFFF" },
    },
  },
  {
    name: "Purple Dots",
    options: {
      dotsOptions: { type: "dots", color: "#6f42c1" }, // Purple dots
      cornersSquareOptions: { type: "dot", color: "#5a349b" }, // Darker purple dot corners
      cornersDotOptions: { type: "dot", color: "#5a349b" },
      backgroundOptions: { color: "#f8f5fc" }, // Very light purple background
    },
  },
  {
    name: "Mono Black Rounded",
    options: {
      dotsOptions: { type: "rounded", color: "#000000" },
      cornersSquareOptions: { type: "extra-rounded", color: "#000000" },
      cornersDotOptions: { type: "dot", color: "#000000" },
      backgroundOptions: { color: "#FFFFFF" },
    },
  },
  {
    name: "Teal Sharp",
    options: {
      dotsOptions: { type: "square", color: "#20c997" }, // Teal square dots
      cornersSquareOptions: { type: "square", color: "#1aa37a" }, // Darker teal square corners
      cornersDotOptions: { type: "square", color: "#1aa37a" },
      backgroundOptions: { color: "#FFFFFF" },
    },
  },
  {
    name: "Soft Pink",
    options: {
      dotsOptions: { type: "extra-rounded", color: "#d63384" }, // Pink extra-rounded dots
      cornersSquareOptions: { type: "extra-rounded", color: "#b42b6e" }, // Darker pink corners
      cornersDotOptions: { type: "dot", color: "#b42b6e" },
      backgroundOptions: { color: "#fdf4f8" }, // Very light pink background
    },
  },
  {
    name: "Dark Classy",
    options: {
      dotsOptions: { type: "classy", color: "#FFFFFF" }, // White dots
      cornersSquareOptions: { type: "square", color: "#FFFFFF" }, // White corners
      cornersDotOptions: { type: "square", color: "#FFFFFF" },
      backgroundOptions: { color: "#212529" }, // Dark background
    },
  },
  {
    name: "Gold Standard",
    options: {
      dotsOptions: { type: "rounded", color: "#b59410" }, // Gold-ish rounded dots
      cornersSquareOptions: { type: "extra-rounded", color: "#8c730c" }, // Darker gold corners
      cornersDotOptions: { type: "dot", color: "#8c730c" },
      backgroundOptions: { color: "#fffbf0" }, // Light cream background
    },
  },
  {
    name: "Graphite Smooth",
    options: {
      dotsOptions: { type: "rounded", color: "#495057" }, // Dark gray rounded
      cornersSquareOptions: { type: "extra-rounded", color: "#343a40" }, // Black corners
      cornersDotOptions: { type: "dot", color: "#343a40" },
      backgroundOptions: { color: "#e9ecef" }, // Light gray background
    },
  },
  {
    name: "Cyber Green",
    options: {
      dotsOptions: { type: "square", color: "#00ff00" }, // Bright green square dots
      cornersSquareOptions: { type: "square", color: "#00cc00" }, // Slightly darker green corners
      cornersDotOptions: { type: "square", color: "#00cc00" },
      backgroundOptions: { color: "#0a0a0a" }, // Near black background
    },
  },
  // --- Adding Gradient Templates ---
  {
    name: "Ocean Breeze",
    options: {
      dotsOptions: {
        type: "rounded",
        gradient: {
          type: "linear",
          rotation: Math.PI / 4,
          colorStops: [
            { offset: 0, color: "#0d6efd" },
            { offset: 1, color: "#71b1ff" },
          ],
        },
      },
      cornersSquareOptions: { type: "extra-rounded", color: "#0a58ca" }, // Solid dark blue corners
      cornersDotOptions: { type: "dot", color: "#0a58ca" },
      backgroundOptions: { color: "#FFFFFF" },
    },
  },
  {
    name: "Sunset Flare",
    options: {
      dotsOptions: { type: "dots", color: "#dc3545" }, // Solid red dots
      cornersSquareOptions: {
        type: "extra-rounded",
        gradient: {
          type: "linear",
          rotation: Math.PI / 2,
          colorStops: [
            { offset: 0, color: "#fd7e14" },
            { offset: 1, color: "#ffc107" },
          ],
        },
      },
      cornersDotOptions: { type: "dot", color: "#fd7e14" }, // Match gradient start color
      backgroundOptions: { color: "#fff8e1" }, // Light yellow background
    },
  },
  {
    name: "Forest Canopy",
    options: {
      dotsOptions: { type: "classy-rounded", color: "#146c43" }, // Solid dark green
      cornersSquareOptions: { type: "square", color: "#146c43" },
      cornersDotOptions: { type: "square", color: "#146c43" },
      backgroundOptions: {
        gradient: {
          type: "radial",
          colorStops: [
            { offset: 0, color: "#ffffff" },
            { offset: 1, color: "#d1e7dd" },
          ],
        }, // Radial white to light green
      },
    },
  },
  {
    name: "Royal Purple",
    options: {
      dotsOptions: {
        type: "extra-rounded",
        gradient: {
          type: "linear",
          rotation: 0,
          colorStops: [
            { offset: 0, color: "#6f42c1" },
            { offset: 1, color: "#b38ff0" },
          ],
        },
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        gradient: {
          type: "linear",
          rotation: 0,
          colorStops: [
            { offset: 0, color: "#5a349b" },
            { offset: 1, color: "#9a73d7" },
          ],
        }, // Darker version of dot gradient
      },
      cornersDotOptions: { type: "dot", color: "#5a349b" }, // Match gradient start
      backgroundOptions: { color: "#FFFFFF" },
    },
  },
  {
    name: "Aqua Radial",
    options: {
      dotsOptions: {
        type: "dots",
        gradient: {
          type: "radial",
          colorStops: [
            { offset: 0, color: "#0dcaf0" },
            { offset: 1, color: "#0b9ebd" },
          ],
        }, // Radial cyan
      },
      cornersSquareOptions: { type: "extra-rounded", color: "#088ba6" }, // Darker solid cyan corners
      cornersDotOptions: { type: "dot", color: "#088ba6" },
      backgroundOptions: { color: "#f0fcfd" }, // Very light cyan
    },
  },
];

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

// --- Helper: Toggle Gradient Controls Visibility ---
function toggleGradientControls(checkbox, solidGroup, gradientGroup) {
  if (!checkbox || !solidGroup || !gradientGroup) return;
  if (checkbox.checked) {
    solidGroup.style.display = "none";
    gradientGroup.style.display = "block";
  } else {
    solidGroup.style.display = "block";
    gradientGroup.style.display = "none";
  }
}

// --- Helper: Get Gradient Options ---
function getGradientOptions(
  enableCheckbox,
  typeLinearRadio,
  color1Input,
  color2Input,
  rotationSlider
) {
  if (!enableCheckbox || !enableCheckbox.checked) {
    return undefined; // Gradient not enabled
  }
  const type = typeLinearRadio && typeLinearRadio.checked ? "linear" : "radial";
  const rotationRad = rotationSlider
    ? (parseInt(rotationSlider.value, 10) * Math.PI) / 180
    : 0;
  const colorStops = [
    { offset: 0, color: color1Input ? color1Input.value : "#000000" },
    { offset: 1, color: color2Input ? color2Input.value : "#000000" },
  ];
  return {
    type: type,
    rotation: rotationRad,
    colorStops: colorStops,
  };
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

  // --- Read Colors & Gradients ---
  // Dots
  const dotGradient = getGradientOptions(
    dotGradientEnableCheckbox,
    dotGradientTypeLinearRadio,
    dotGradientColor1Input,
    dotGradientColor2Input,
    dotGradientRotationSlider
  );
  const dotColor = dotGradient
    ? undefined
    : fgColorInput
    ? fgColorInput.value
    : "#000000";
  // Background
  const bgGradient = getGradientOptions(
    bgGradientEnableCheckbox,
    bgGradientTypeLinearRadio,
    bgGradientColor1Input,
    bgGradientColor2Input,
    bgGradientRotationSlider
  );
  const bgSolidColor = bgGradient
    ? undefined
    : bgColorInput
    ? bgColorInput.value
    : "#FFFFFF";
  // Corner Squares
  const cornerSquareGradient = getGradientOptions(
    cornerSquareGradientEnableCheckbox,
    cornerSquareGradientTypeLinearRadio,
    cornerSquareGradientColor1Input,
    cornerSquareGradientColor2Input,
    cornerSquareGradientRotationSlider
  );
  const cornerSquareColor = cornerSquareGradient
    ? undefined
    : cornerSquareColorInput
    ? cornerSquareColorInput.value
    : "#000000";
  // Corner Dots (linking to corner square color/gradient for simplicity)
  const cornerDotColor = cornerSquareColor; // Link solid colors
  const cornerDotGradient = cornerSquareGradient; // Link gradients

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
      color: dotColor,
      gradient: dotGradient,
      type: currentDotStyle,
    },
    backgroundOptions: {
      color: bgSolidColor,
      gradient: bgGradient,
    },
    imageOptions: {
      hideBackgroundDots: currentHideBackground,
      imageSize: currentLogoSize,
      margin: currentLogoMargin,
      crossOrigin: "anonymous",
    },
    cornersSquareOptions: {
      color: cornerSquareColor,
      gradient: cornerSquareGradient,
      type: currentCornerSquareStyle,
    },
    cornersDotOptions: {
      color: cornerDotColor,
      gradient: cornerDotGradient,
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

// Add listeners for gradient enable checkboxes
dotGradientEnableCheckbox?.addEventListener("change", () => {
  toggleGradientControls(
    dotGradientEnableCheckbox,
    dotSolidColorGroupDiv,
    dotGradientControlsDiv
  );
  generateQR();
});
bgGradientEnableCheckbox?.addEventListener("change", () => {
  toggleGradientControls(
    bgGradientEnableCheckbox,
    bgSolidColorGroupDiv,
    bgGradientControlsDiv
  );
  generateQR();
});
cornerSquareGradientEnableCheckbox?.addEventListener("change", () => {
  toggleGradientControls(
    cornerSquareGradientEnableCheckbox,
    cornerSquareSolidColorGroupDiv,
    cornerSquareGradientControlsDiv
  );
  generateQR();
});

// Listener for live updates from ALL controls (including new gradient controls)
const allControls = [
  textInput,
  sizeInput,
  // Solid Colors (now potentially hidden)
  fgColorInput,
  bgColorInput,
  cornerSquareColorInput,
  // Styles
  dotStyleSelect,
  cornerSquareStyleSelect,
  cornerDotStyleSelect,
  // Logo
  logoSizeSlider,
  logoMarginSlider,
  logoBackgroundCheckbox,
  // Advanced
  errorCorrectionLevelSelect,
  qrMarginSlider,
  // Gradients
  dotGradientEnableCheckbox,
  bgGradientEnableCheckbox,
  cornerSquareGradientEnableCheckbox,
  dotGradientTypeLinearRadio /* Add other radio buttons if needed */,
  dotGradientColor1Input,
  dotGradientColor2Input,
  dotGradientRotationSlider,
  bgGradientTypeLinearRadio,
  bgGradientColor1Input,
  bgGradientColor2Input,
  bgGradientRotationSlider,
  cornerSquareGradientTypeLinearRadio,
  cornerSquareGradientColor1Input,
  cornerSquareGradientColor2Input,
  cornerSquareGradientRotationSlider,
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

// Update slider value displays (including new gradient rotation sliders)
const sliderValueDisplays = {
  logoSize: "logoSizeValue",
  logoMargin: "logoMarginValue",
  qrMargin: "qrMarginValue",
  dotGradientRotation: "dotGradientRotationValue",
  bgGradientRotation: "bgGradientRotationValue",
  cornerSquareGradientRotation: "cornerSquareGradientRotationValue",
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

// --- Populate Template Gallery ---
function populateTemplateGallery() {
  if (!templateGallery) return;
  templateGallery.innerHTML = ""; // Clear existing items

  qrTemplates.forEach((template, index) => {
    const item = document.createElement("div");
    item.className = "template-item";
    item.setAttribute("data-template-index", index);

    const previewContainer = document.createElement("div");
    previewContainer.className = "template-preview";
    // Generate a mini preview (using the library itself)
    const previewQR = new QRCodeStyling({
      width: 70,
      height: 70,
      margin: 5,
      data: "Template", // Dummy data for preview
      ...template.options, // Apply template styles
    });
    previewQR.append(previewContainer);

    const name = document.createElement("div");
    name.className = "template-name";
    name.textContent = template.name;

    item.appendChild(previewContainer);
    item.appendChild(name);
    templateGallery.appendChild(item);
  });
}

// --- Apply Template Logic ---
function applyTemplate(templateIndex) {
  if (templateIndex < 0 || templateIndex >= qrTemplates.length) return;

  const template = qrTemplates[templateIndex];
  const options = template.options; // Shortcut to options
  console.log("Applying template:", template.name);

  // --- Update UI controls ---

  // Style & Color Tab
  if (dotStyleSelect)
    dotStyleSelect.value = options.dotsOptions?.type || "square";
  if (cornerSquareStyleSelect)
    cornerSquareStyleSelect.value =
      options.cornersSquareOptions?.type || "square";
  if (cornerDotStyleSelect)
    cornerDotStyleSelect.value = options.cornersDotOptions?.type || "square";

  // Dots Color/Gradient
  const dotGradient = options.dotsOptions?.gradient;
  if (dotGradientEnableCheckbox)
    dotGradientEnableCheckbox.checked = !!dotGradient;
  toggleGradientControls(
    dotGradientEnableCheckbox,
    dotSolidColorGroupDiv,
    dotGradientControlsDiv
  ); // Update visibility
  if (dotGradient) {
    if (dotGradientTypeLinearRadio)
      dotGradientTypeLinearRadio.checked = dotGradient.type === "linear";
    // TODO: Handle radial radio button if added
    if (dotGradientColor1Input)
      dotGradientColor1Input.value =
        dotGradient.colorStops?.[0]?.color || "#000000";
    if (dotGradientColor2Input)
      dotGradientColor2Input.value =
        dotGradient.colorStops?.[1]?.color || "#000000";
    if (dotGradientRotationSlider)
      dotGradientRotationSlider.value = Math.round(
        ((dotGradient.rotation || 0) * 180) / Math.PI
      );
  } else {
    if (fgColorInput)
      fgColorInput.value = options.dotsOptions?.color || "#000000";
  }

  // Background Color/Gradient
  const bgGradient = options.backgroundOptions?.gradient;
  if (bgGradientEnableCheckbox) bgGradientEnableCheckbox.checked = !!bgGradient;
  toggleGradientControls(
    bgGradientEnableCheckbox,
    bgSolidColorGroupDiv,
    bgGradientControlsDiv
  ); // Update visibility
  if (bgGradient) {
    if (bgGradientTypeLinearRadio)
      bgGradientTypeLinearRadio.checked = bgGradient.type === "linear";
    // TODO: Handle radial radio button
    if (bgGradientColor1Input)
      bgGradientColor1Input.value =
        bgGradient.colorStops?.[0]?.color || "#FFFFFF";
    if (bgGradientColor2Input)
      bgGradientColor2Input.value =
        bgGradient.colorStops?.[1]?.color || "#FFFFFF";
    if (bgGradientRotationSlider)
      bgGradientRotationSlider.value = Math.round(
        ((bgGradient.rotation || 0) * 180) / Math.PI
      );
  } else {
    if (bgColorInput)
      bgColorInput.value = options.backgroundOptions?.color || "#FFFFFF";
  }

  // Corner Square Color/Gradient
  const csGradient = options.cornersSquareOptions?.gradient;
  if (cornerSquareGradientEnableCheckbox)
    cornerSquareGradientEnableCheckbox.checked = !!csGradient;
  toggleGradientControls(
    cornerSquareGradientEnableCheckbox,
    cornerSquareSolidColorGroupDiv,
    cornerSquareGradientControlsDiv
  );
  if (csGradient) {
    if (cornerSquareGradientTypeLinearRadio)
      cornerSquareGradientTypeLinearRadio.checked =
        csGradient.type === "linear";
    // TODO: Handle radial radio button
    if (cornerSquareGradientColor1Input)
      cornerSquareGradientColor1Input.value =
        csGradient.colorStops?.[0]?.color || "#000000";
    if (cornerSquareGradientColor2Input)
      cornerSquareGradientColor2Input.value =
        csGradient.colorStops?.[1]?.color || "#000000";
    if (cornerSquareGradientRotationSlider)
      cornerSquareGradientRotationSlider.value = Math.round(
        ((csGradient.rotation || 0) * 180) / Math.PI
      );
  } else {
    if (cornerSquareColorInput)
      cornerSquareColorInput.value =
        options.cornersSquareOptions?.color || "#000000";
  }

  // Update slider display values manually after setting slider values
  updateAllSliderDisplays();

  // Note: We are NOT updating logo, size, margin, ECL from templates

  // Trigger QR regeneration
  generateQR();
}

// Helper to update all slider displays
function updateAllSliderDisplays() {
  Object.entries(sliderValueDisplays).forEach(([sliderId, displayId]) => {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);
    if (slider && display) {
      display.textContent = slider.value;
    }
  });
}

// Add listener for template gallery clicks (using event delegation)
if (templateGallery) {
  templateGallery.addEventListener("click", (event) => {
    const templateItem = event.target.closest(".template-item");
    if (templateItem) {
      const index = parseInt(
        templateItem.getAttribute("data-template-index"),
        10
      );
      applyTemplate(index);
    }
  });
}

// --- Accordion Logic ---
const accordionHeaders = document.querySelectorAll(".accordion-header");

accordionHeaders.forEach((header) => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;
    const item = header.parentElement;

    // Optional: Close other open accordions within the same container
    // const container = item.closest('.accordion-container');
    // if (container) {
    //     container.querySelectorAll('.accordion-item').forEach(otherItem => {
    //         if (otherItem !== item && otherItem.querySelector('.accordion-header.active')) {
    //             otherItem.querySelector('.accordion-header').classList.remove('active');
    //             otherItem.querySelector('.accordion-content').style.display = 'none';
    //         }
    //     });
    // }

    header.classList.toggle("active");
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
});

// --- Initial State ---
downloadBtn.disabled = true;
// Activate the first tab on load
activateTab("content-tab");
// Generate initial QR on load
window.addEventListener("load", () => {
  populateTemplateGallery(); // Populate gallery on load
  if (textInput.value) generateQR();
  if (removeLogoBtn) removeLogoBtn.style.display = "none";
  // Update initial slider values
  updateAllSliderDisplays(); // Call explicitly here too for safety
  // Set initial visibility of gradient controls
  toggleGradientControls(
    dotGradientEnableCheckbox,
    dotSolidColorGroupDiv,
    dotGradientControlsDiv
  );
  toggleGradientControls(
    bgGradientEnableCheckbox,
    bgSolidColorGroupDiv,
    bgGradientControlsDiv
  );
  toggleGradientControls(
    cornerSquareGradientEnableCheckbox,
    cornerSquareSolidColorGroupDiv,
    cornerSquareGradientControlsDiv
  );

  // Optional: Open the first accordion item in each active tab initially
  document
    .querySelectorAll(".tab-content.active .accordion-item")
    .forEach((item, index) => {
      if (index === 0) {
        // Open only the first one
        const header = item.querySelector(".accordion-header");
        const content = item.querySelector(".accordion-content");
        if (header && content) {
          header.classList.add("active");
          content.style.display = "block";
        }
      }
    });
});
