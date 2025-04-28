# Free Online QR Code Generator

[![GitHub Pages Deploy](https://github.com/Make-My-QR-Code/make-my-qr-code.github.io/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/Make-My-QR-Code/make-my-qr-code.github.io/actions/workflows/pages/pages-build-deployment)

A powerful, free, and easy-to-use web application for generating highly customized QR codes directly in your browser.

**[Try it live!](https://make-my-qr-code.github.io/)**

<!-- Add a screenshot or GIF here later -->
<!-- ![Screenshot of QR Code Generator](screenshot.png) -->

## Features

This QR code generator offers a wide range of customization options:

- **Content:** Encode any text or URL.
- **Styling:**
  - **Size:** Adjust the pixel dimensions of the QR code.
  - **Colors:** Choose custom foreground (dots) and background colors.
  - **Dot Styles:** Select from various styles for the data modules (square, dots, rounded, extra-rounded, classy, classy-rounded).
  - **Corner Styles:** Customize the appearance of the main corner squares and the dots within them.
  - _(Coming Soon: Gradient support for colors!)_
- **Logo Integration:**
  - Upload your own logo (PNG, JPG, SVG) to be embedded in the center.
  - Adjust the logo size relative to the QR code.
  - Control the margin around the logo.
  - Option to hide QR code dots underneath the logo for better clarity.
  - Easily remove the uploaded logo.
- **Templates:**
  - Choose from a gallery of pre-designed templates for a quick start.
  - Further customize any selected template.
- **Advanced Options:**
  - **Error Correction Level:** Select the robustness (L, M, Q, H) - higher levels allow for more damage/obscuration but increase QR code density.
  - **Margin (Quiet Zone):** Adjust the white space around the QR code border.
- **Download Formats:**
  - Download your generated QR code as PNG, SVG, JPEG, WEBP, or PDF.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) library for QR code generation and styling.
- [jsPDF](https://github.com/parallax/jsPDF) library for PDF export.

## Running Locally

1.  Clone this repository:
    ```bash
    git clone https://github.com/Make-My-QR-Code/make-my-qr-code.github.io.git
    ```
2.  Navigate to the directory:
    ```bash
    cd make-my-qr-code.github.io
    ```
3.  Open the `index.html` file in your web browser.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Make-My-QR-Code/make-my-qr-code.github.io/issues).

## License

(Optional: Add license info here, e.g., Distributed under the MIT License. See `LICENSE` for more information.)
