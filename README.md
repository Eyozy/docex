# DocEx

A privacy-first document image extractor that runs entirely in your browser. Extract images from documents and eBooks without uploading files to any server.

## Features

- **Privacy by design** — All processing happens in your browser.
- **Wide format support** — DOCX, PPTX, XLSX, Keynote, Pages, Numbers, EPUB, MOBI, AZW3.
- **Lossless extraction** — Images extracted directly from document structures.
- **Smart filtering** — Automatically removes icons and thumbnails under 10KB.
- **Batch download** — Export all images as a single ZIP file.

**Limitations**: Older Office formats (.doc, .ppt, .xls) and DRM-protected eBooks are not supported.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Eyozy/docex.git
cd docex
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

### Production Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

The build output will be in the `dist` directory, ready for deployment to any static hosting service.

## Project Structure

```
docex/
├── src/
│   ├── components/          # UI components
│   ├── composables/         # Composition functions
│   ├── workers/             # Background processing
│   ├── utils/               # Helper functions
│   └── i18n/                # Translations
├── public/
└── vite.config.ts
```

## Development

### Adding New Format Support

1. Add file signature detection in `src/workers/extractor.worker.ts`
2. Implement the extraction logic in the appropriate parser
3. Update UI translations in `src/i18n/en-US.ts` and `zh-CN.ts`
4. Add the format extension to accepted types in `src/components/DropZone.vue`

## Contributing

Contributions are welcome. Please feel free to submit a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

## License

MIT License — see the [LICENSE](LICENSE) file for details.
