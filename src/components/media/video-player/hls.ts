import type { ErrorData } from "hls.js";

export type VideoSourceSession = {
  destroy: () => void;
};

const HLS_MIME_TYPE = "application/vnd.apple.mpegurl";

const isHlsSource = (src: string) => {
  try {
    return new URL(src, window.location.href).pathname.endsWith(".m3u8");
  } catch {
    return src.includes(".m3u8");
  }
};

/**
 * Attaches a regular video or HLS manifest and returns cleanup for Astro's
 * client-side navigation lifecycle.
 */
export async function attachVideoSource(
  video: HTMLVideoElement,
  src: string,
  onError: (message: string) => void
): Promise<VideoSourceSession> {
  if (!isHlsSource(src)) {
    video.src = src;
    return {
      destroy: () => {
        video.removeAttribute("src");
        video.load();
      },
    };
  }

  const { default: Hls, ErrorTypes, Events } = await import("hls.js");

  if (Hls.isSupported()) {
    const hls = new Hls({ debug: false, enableWorker: true });

    hls.on(Events.ERROR, (_event, data: ErrorData) => {
      if (!data.fatal) return;

      if (data.type === ErrorTypes.NETWORK_ERROR) {
        hls.startLoad();
        return;
      }

      if (data.type === ErrorTypes.MEDIA_ERROR) {
        hls.recoverMediaError();
        return;
      }

      onError(data.error?.message ?? data.details ?? "The video stream could not be loaded.");
      hls.destroy();
    });

    hls.loadSource(src);
    hls.attachMedia(video);
    return { destroy: () => hls.destroy() };
  }

  if (video.canPlayType(HLS_MIME_TYPE)) {
    video.src = src;
    return {
      destroy: () => {
        video.removeAttribute("src");
        video.load();
      },
    };
  }

  onError("HLS playback is not supported by this browser.");
  return { destroy: () => undefined };
}
