# DocEx

A privacy-first document image extractor that runs entirely in your browser. Extract images from documents and eBooks without uploading files to any server.

## Why DocEx?

**Security**: Your files never leave your device. All processing happens locally in your browser using Web Workers.

**Performance**: Multi-threaded processing keeps the UI responsive even with large files.

**Simplicity**: No installation required. Just drop your files and extract images.

**Quality**: Lossless extraction - images are extracted directly from the document structure without re-compression.

## Features

### Privacy & Security

- **Zero Server Upload**: All file processing happens client-side. No data leaves your device.
- **No Tracking**: No analytics, cookies, or data collection.
- **Open Source**: Full transparency - inspect the code yourself.

### Format Support

- **Microsoft Office**: Word (`.docx`), PowerPoint (`.pptx`), Excel (`.xlsx`)
- **Apple iWork**: Keynote (`.key`), Pages (`.pages`), Numbers (`.numbers`)
- **eBooks**: EPUB (`.epub`), MOBI (`.mobi`), AZW3 (`.azw3`)

**Limitations**: Older Office formats (`.doc`, `.ppt`, `.xls`) are not supported. DRM-protected eBooks cannot be processed.

### Image Processing

- **Smart Filtering**: Automatically filters out icons, thumbnails, and placeholders (< 10KB)
- **Lossless Extraction**: Original image quality preserved - no re-compression
- **Batch Download**: Download all images as a ZIP file with progress tracking

### User Experience

- **Modern UI**: Built with Vue 3 and Tailwind CSS
- **Dark Mode**: Full light/dark theme support with system preference detection
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Internationalization**: Built-in support for English and Chinese
- **Real-time Feedback**: Toast notifications for extraction status and errors
- **Image Preview**: Lightbox preview for extracted images

## Quick Start

**Prerequisites**

- Node.js 18+
- npm 9+ or yarn 1.22+ or pnpm 8+

**Installation**

```bash
# Clone the repository
git clone https://github.com/Eyozy/docex.git
cd docex

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Production Build**

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## Project Structure

```
docex/
├── src/
│   ├── components/               # Vue components
│   │   ├── BrandLogo.vue         # Application branding component
│   │   ├── DropZone.vue          # File upload drag-drop area
│   │   ├── ImageCard.vue         # Individual image card display
│   │   ├── ImagePreview.vue      # Lightbox preview modal
│   │   ├── ResultGallery.vue     # Virtual scrolling gallery
│   │   ├── ToastContainer.vue    # Toast notification container
│   │   └── ToastMessage.vue      # Individual toast message
│   ├── composables/              # Vue composables (reusable logic)
│   │   ├── useExtractor.ts       # Image extraction orchestration
│   │   ├── useToast.ts           # Toast notification management
│   │   ├── useVirtualScroll.ts   # Virtual scrolling implementation
│   │   └── useTheme.ts           # Dark mode theme management
│   ├── workers/                  # Web Workers (background processing)
│   │   └── extractor.worker.ts   # File extraction worker
│   ├── utils/                    # Utility functions
│   │   ├── ebookParser.ts        # MOBI/AZW3 parser with DRM detection
│   │   ├── download.ts           # Download and ZIP generation
│   │   └── format.ts             # File size formatting utilities
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts              # Shared type declarations
│   ├── i18n/                     # Internationalization
│   │   ├── en-US.ts              # English translations
│   │   └── zh-CN.ts              # Chinese translations
│   ├── App.vue                   # Root application component
│   └── main.ts                   # Application entry point
├── public/                       # Static assets
│   └── favicon.svg               # Application favicon
├── index.html                    # HTML template
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts               # Vite build configuration
└── README.md
```

## Development

### Adding New Format Support

To add support for a new file format:

1. Add file signature detection in `src/workers/extractor.worker.ts`
2. Implement the extraction logic in the appropriate parser
3. Add MIME types to `src/utils/fileTypes.ts`
4. Update UI translations in `src/i18n/en-US.ts` and `zh-CN.ts`
5. Add the format extension to accepted types in `src/components/DropZone.vue`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Built with:

- [Vue 3](https://vuejs.org/) - Progressive JavaScript framework
- [Vite](https://vitejs.dev/) - Next generation build tool
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [JSZip](https://stuk.github.io/jszip/) - ZIP file creation
- [Vue I18n](https://vue-i18n.intlify.dev/) - Internationalization plugin