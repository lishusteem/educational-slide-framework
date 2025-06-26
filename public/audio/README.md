# Audio Files Directory

Place your MP3 audio narration files in this directory.

## Usage

Configure audio in your slide configs:

```typescript
audio: {
  src: 'blockchain-intro-narration.mp3',  // File name from this directory
  autoPlay: false,                         // Default: false
  loop: false,                            // Default: false
  volume: 0.8                             // 0.0 to 1.0, Default: 0.8
}
```

## Current Slides

- `blockchain-intro-narration.mp3` - Narration for blockchain introduction slide
- Add more MP3 files as needed for other slides

## File Format

- Supported: MP3 files
- Recommended bitrate: 128kbps or higher
- Keep files under 10MB for better loading performance 