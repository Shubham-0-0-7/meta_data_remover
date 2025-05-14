# 🧼 MetaClean - Image Metadata Remover

A privacy-focused web tool that removes metadata (EXIF data) from images directly in your browser. Your images never leave your device - no uploads, no tracking, no cookies.


## Features

- **Client-side processing**: All processing happens in your browser - no image uploads
- **Supports common formats**: Works with JPEG (EXIF data) and PNG (metadata chunks)
- **Simple interface**: Drag & drop or click to select images
- **Privacy focused**: No tracking, no cookies, no data collection
- **Open source**: Transparent code you can inspect and trust

## How It Works

1. Select an image from your device
2. Click "Remove Metadata" to strip all EXIF and other metadata
3. Download the cleaned image with a single click

## Supported Metadata Removal

- **JPEG**: Removes all EXIF data including:
  - Camera make/model
  - GPS location
  - Date/time
  - Thumbnail
  - Other EXIF tags
- **PNG**: Removes metadata chunks including:
  - tEXt (textual data)
  - zTXt (compressed textual data)
  - iTXt (international textual data)

## Installation

No installation needed! Just open `index.html` in any modern browser.

For local development:
1. Clone this repository
2. Open `index.html` in your browser

## Dependencies

- [piexif.js](https://github.com/hMatoba/piexifjs) - For EXIF data manipulation in JPEGs

## Limitations

- Only works with JPEG and PNG files
- Some metadata in proprietary formats may persist
- Image quality is preserved but the file may be re-encoded

## Privacy Policy

MetaClean:
- Processes images entirely in your browser
- Never uploads your images to any server
- Doesn't use cookies or tracking
- Doesn't collect any personal data

## Contributing

Contributions are welcome! Please open an issue or pull request for any improvements.

## License

MIT License - see [LICENSE](LICENSE) file
