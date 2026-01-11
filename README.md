# docex

Privacy-first document image extractor running entirely in the browser.

[中文](./README.zh-CN.md)

## ✨ Features

- **100% Private**: All processing happens locally in your browser using Web Workers. Your data never leaves your device.
- **Broad Support**:
  - **Microsoft Office**: Word (`.docx`), PowerPoint (`.pptx`), Excel (`.xlsx`)
  - **Apple iWork**: Keynote (`.key`), Pages (`.pages`), Numbers (`.numbers`)
- **Smart Extraction**: Automatically filters out icons, thumbnails, and placeholders to keep only the content images you want.
- **Lossless**: Extracts the original image files directly from the document structure without re-compression.
- **Modern UI**: Built with Vue 3 and Tailwind CSS, featuring dark mode support.

## 🛠️ Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Core**: [JSZip](https://stuk.github.io/jszip/) (Document parsing)
- **I18n**: [Vue I18n](https://vue-i18n.intlify.dev/)

## 🚀 Quick Start

1.  **Clone the repository**

    ```bash
    git clone https://github.com/Eyozy/docex.git
    cd docex
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Start development server**

    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 📂 Project Structure

```
src/
├── components/      # UI Components (DropZone, Gallery, Preview)
├── composables/     # Logic (useExtractor)
├── workers/         # Web Workers (File parsing & detection)
├── utils/           # Utilities (File types, mime types)
├── types/           # TypeScript definitions
└── i18n/            # Localization
```

## 📄 License

[MIT](LICENSE) License.
