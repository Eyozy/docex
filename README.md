# DocEx

A privacy-first document image extractor that runs entirely in your browser. Extract images from Word, Excel, PowerPoint, Keynote, Pages, Numbers, and eBooks without uploading files to any server.

## ✨ Features

- **🔒 100% Private**: All processing happens locally in your browser using Web Workers. Your files never leave your device.
- **📚 Broad Format Support**:
  - Microsoft Office: Word (.docx), PowerPoint (.pptx), Excel (.xlsx)
  - Apple iWork: Keynote (.key), Pages (.pages), Numbers (.numbers)
  - eBooks: EPUB (.epub), MOBI (.mobi), AZW3 (.azw3)
- **🎯 Smart Filtering**: Automatically filters out icons, thumbnails, and placeholders (< 10KB) to keep only meaningful content images.
- **🖼️ Lossless Quality**: Extracts original image files directly from document structure without re-compression.
- **🎨 Modern UI**: Built with Vue 3 and Tailwind CSS, featuring light/dark mode and responsive design.
- **🔔 Toast Notifications**: Real-time feedback for extraction status and errors.
- **🌐 Internationalization**: Built-in support for English and Chinese.
- **⚡ High Performance**: Multi-threaded processing with Web Workers keeps the UI responsive.
- **🛡️ DRM Detection**: Detects and warns about DRM-protected eBooks.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Eyozy/docex.git
cd docex

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app in action.

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
docex/
├── src/
│   ├── components/
│   │   ├── BrandLogo.vue       # Application branding
│   │   ├── DropZone.vue        # File upload interface
│   │   ├── ImageCard.vue       # Individual image display
│   │   ├── ImagePreview.vue    # Lightbox preview
│   │   └── ToastContainer.vue  # Notification system
│   ├── composables/
│   │   ├── useExtractor.ts     # Image extraction logic
│   │   └── useToast.ts         # Toast notification manager
│   ├── workers/
│   │   └── extractor.worker.ts # Background file processing
│   ├── utils/
│   │   ├── ebookParser.ts      # MOBI/AZW3 parser
│   │   └── fileTypes.ts        # MIME type definitions
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── i18n/
│   │   ├── en-US.ts            # English translations
│   │   └── zh-CN.ts            # Chinese translations
│   ├── App.vue                 # Root component
│   └── main.ts                 # Application entry
├── public/
│   └── favicon.svg             # Application icon
└── index.html                  # HTML template
```

## 🎯 Supported Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| Word | `.docx` | Modern Office Open XML format |
| PowerPoint | `.pptx` | Modern Office Open XML format |
| Excel | `.xlsx` | Modern Office Open XML format |
| Keynote | `.key` | Apple iWork format |
| Pages | `.pages` | Apple iWork format |
| Numbers | `.numbers` | Apple iWork format |
| EPUB | `.epub` | Standard eBook format |
| MOBI | `.mobi` | Amazon Kindle format (legacy) |
| AZW3 | `.azw3` | Amazon Kindle format |

**Note**: Older Office formats (`.doc`, `.ppt`, `.xls`) are not supported. DRM-protected eBooks cannot be processed.

## 🔐 Privacy & Security

- **Zero Server Upload**: All file processing happens in your browser.
- **No Analytics**: No tracking, cookies, or data collection.
- **Open Source**: Full transparency - inspect the code yourself.
- **Client-Side Only**: Static site that can be hosted anywhere or run locally.

## 🛠️ Development

### Project Commands

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Type-check and build for production
npm run build

# Preview production build locally
npm run preview
```

### Adding New Format Support

1. Add file signature detection in `src/workers/extractor.worker.ts`
2. Implement extraction logic in the appropriate parser
3. Add MIME types to `src/utils/fileTypes.ts`
4. Update UI translations in `src/i18n/`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[MIT License](LICENSE)

## 🙏 Acknowledgments

- Built with [Vue 3](https://vuejs.org/)
- Powered by [JSZip](https://stuk.github.io/jszip/) for archive handling
- Styled with [Tailwind CSS](https://tailwindcss.com/)
