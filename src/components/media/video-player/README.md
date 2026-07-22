# Video player

A framework-free Astro video player for regular browser video files and HLS
manifests. It preserves the interaction model of the reference player while
removing its private telemetry, localization, RTC, and asset dependencies.

## Use in an MDX post

```mdx
import { VideoPlayer } from "#/components/media/video-player";

<VideoPlayer
  title="Database Studio demo"
  src="/videos/database-studio/master.m3u8"
  poster="/videos/database-studio/poster.webp"
  captions="/videos/database-studio/captions-en.vtt"
  preload="metadata"
/>
```

For a small MP4 demo, pass the MP4 URL to `src`. HLS manifests are handled by
`hls.js` where Media Source Extensions are available and by native playback
where they are not.

Autoplay should normally stay muted. Use `autoplayVisibilityThreshold` with a
value from `0` to `1`, or a whole percentage such as `60`. The player pauses
when it leaves the viewport.

## Hosting requirements

Every manifest, segment, caption, and encryption-key response must use HTTPS,
correct MIME types, and CORS headers that allow the blog origin. A player embeds
and plays media; it does not transcode, package, store, or distribute video.
Production streaming therefore still needs object storage, HLS transcoding, and
a CDN or a managed video platform.
