/**
 * Custom Video Player
 *
 * This module implements a feature-rich video player with custom controls,
 * including play/pause, volume control, seeking, fullscreen, picture-in-picture,
 * playback speed adjustment, and keyboard shortcuts.
 */

// TODO Future
// import { generateSnapshots } from "./snapshotsGenerator"

// SECTION Constants
const SKIP_TIME = 10;
const VOLUME_HIGH = 1;
const VOLUME_LOW = 0.3;
const VOLUME_MUTED = 0;

document.addEventListener("astro:page-load", initializeVideoPlayer);

function initializeVideoPlayer() {
  // SECTION Element Selection
  const videoPlayer = document.querySelector("#videoPlayer") as HTMLDivElement;
  const mainVideo = videoPlayer.querySelector("#mainVideo") as HTMLVideoElement;
  const progressAreaTime = videoPlayer.querySelector(
    ".progressAreaTime",
  ) as HTMLDivElement;
  const progressAreaSnapshot = videoPlayer.querySelector(
    ".progressAreaSnapshot",
  ) as HTMLDivElement;
  const controls = videoPlayer.querySelector(".controls") as HTMLDivElement;
  const progressArea = videoPlayer.querySelector(
    ".progress-area",
  ) as HTMLDivElement;
  const progressBar = videoPlayer.querySelector(
    ".progress-bar",
  ) as HTMLDivElement;
  const bufferedBar = videoPlayer.querySelector(
    ".buffered-progress-bar",
  ) as HTMLDivElement;
  const loadingSpinner = videoPlayer.querySelector(
    ".loading-spinner",
  ) as HTMLDivElement;

  // SECTION  Control Buttons
  const fastRewindButton = videoPlayer.querySelector(
    ".fast-rewind",
  ) as HTMLButtonElement;
  const playPauseButton = videoPlayer.querySelector(
    ".play-pause",
  ) as HTMLButtonElement;
  const fastForwardButton = videoPlayer.querySelector(
    ".fast-forward",
  ) as HTMLButtonElement;
  const volumeButton = videoPlayer.querySelector(
    ".volume",
  ) as HTMLButtonElement;
  const autoPlayButton = videoPlayer.querySelector(
    ".auto-play-toggle",
  ) as HTMLButtonElement;
  const settingsButton = videoPlayer.querySelector(
    ".settings-btn",
  ) as HTMLButtonElement;
  const pictureInPictureButton = videoPlayer.querySelector(
    ".picture-in-picture",
  ) as HTMLButtonElement;
  const fullScreenButton = videoPlayer.querySelector(
    ".full-screen",
  ) as HTMLButtonElement;

  // SECTION Settings Elements
  const settings = videoPlayer.querySelector("#settings") as HTMLDivElement;
  const indexSection = settings.querySelector(".index") as HTMLDivElement;
  const indexItems = settings.querySelectorAll(
    ".index ul li",
  ) as NodeListOf<HTMLLIElement>;
  const settingsSections = {
    captionSettings: settings.querySelector(".captions") as HTMLDivElement,
    playbackSettings: settings.querySelector(".playback") as HTMLDivElement,
    qualitySettings: settings.querySelector(".quality") as HTMLDivElement,
  };

  // SECTION Other Elements
  const playIcon = videoPlayer.querySelector(".play") as SVGAElement;
  const pauseIcon = videoPlayer.querySelector(".pause") as SVGAElement;
  const volumeRange = videoPlayer.querySelector(
    "#volumeRange",
  ) as HTMLInputElement;
  const totalDuration = videoPlayer.querySelector(
    ".duration",
  ) as HTMLSpanElement;
  const currentDuration = videoPlayer.querySelector(
    ".current",
  ) as HTMLSpanElement;

  const TOTAL_VIDEO_DURATION = mainVideo.duration;

  // SECTION Utility Functions
  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  // SECTION Core Functions
  function setTimelinePosition(evt) {
    const progressAreaWidth = progressArea.clientWidth;
    const clickOffsetX = evt.offsetX;
    const newTime = (clickOffsetX / progressAreaWidth) * TOTAL_VIDEO_DURATION;

    mainVideo.currentTime = newTime;
    const progressWidth = (newTime / TOTAL_VIDEO_DURATION) * 100;
    progressBar.style.width = `${progressWidth}%`;
  }

  function updateBufferedProgress() {
    if (mainVideo.buffered.length > 0) {
      const buffered = mainVideo.buffered;
      const bufferedEnd = buffered.end(buffered.length - 1);
      const totalDuration = mainVideo.duration;
      const bufferedWidth = (bufferedEnd / totalDuration) * 100;
      bufferedBar.style.width = `${bufferedWidth}%`;
    }
  }

  let hideTimeout: number;
  function showControls() {
    clearTimeout(hideTimeout);
    controls.setAttribute("aria-controls-active", "true");
  }

  function hideControls() {
    hideTimeout = window.setTimeout(() => {
      controls.removeAttribute("aria-controls-active");
    }, 2000);
  }

  function playPauseVideo() {
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
  }

  function fastRewind() {
    mainVideo.currentTime = Math.max(mainVideo.currentTime - SKIP_TIME, 0);
  }

  function fastForward() {
    mainVideo.currentTime = Math.min(
      mainVideo.currentTime + SKIP_TIME,
      mainVideo.duration,
    );
  }

  function updateVideoDuration() {
    totalDuration.textContent = formatTime(TOTAL_VIDEO_DURATION);
  }

  function updateVolumeIcon(volume: number) {
    if (volume === VOLUME_MUTED) {
      volumeButton.dataset.volumeLevel = "muted";
    } else if (volume <= VOLUME_LOW) {
      volumeButton.dataset.volumeLevel = "low";
    } else {
      volumeButton.dataset.volumeLevel = "high";
    }
  }

  function setVolume(level: number) {
    mainVideo.volume = level;
    updateVolumeIcon(level);
  }

  function toggleFullScreen(element: HTMLElement) {
    const isFullScreen =
      fullScreenButton.getAttribute("aria-maximized") === "true";

    if (!isFullScreen && !document.fullscreenElement) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen();
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
      fullScreenButton.setAttribute("aria-maximized", "true");
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      fullScreenButton.setAttribute("aria-maximized", "false");
    }
  }

  // Hide all settings initially
  function hideAllSettings() {
    Object.values(settingsSections).forEach((section) => {
      section.setAttribute("hidden", "true");
    });
  }

  // Show the selected setting
  function showSetting(setting) {
    if (!settingsSections[setting]) {
      console.error(`Setting "${setting}" does not exist in settingsSections`);
      return;
    }
    hideAllSettings();
    indexSection.setAttribute("hidden", "true");
    settingsSections[setting].removeAttribute("hidden");
  }

  function setPlaybackSpeed(
    videoElement: HTMLVideoElement,
    playbackContainer: HTMLElement,
  ) {
    const speedOptions = playbackContainer.querySelectorAll("li[data-speed]");

    speedOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const selectedSpeed = parseFloat(
          option.getAttribute("data-speed") || "1",
        );
        videoElement.playbackRate = selectedSpeed;
        speedOptions.forEach((opt) => opt.removeAttribute("data-active"));
        option.setAttribute("data-active", "true");
      });
    });
  }
  // SECTION END Core Functions

  // TODO generateSnapshots() (Future implementation)
  // let tempVideo = document.createElement("video") as HTMLVideoElement
  // tempVideo.src = mainVideo.querySelector("source")?.src as string

  // tempVideo.preload = "metadata"
  // tempVideo.width = 500
  // tempVideo.height = 300
  // tempVideo.controls = true

  // tempVideo.addEventListener("loadedmetadata", async () => {
  // 	console.log("Video metadata loaded")

  // 	// Wait for a short period to ensure video is ready
  // 	await new Promise((resolve) => setTimeout(resolve, 1000))

  // 	generateSnapshots(tempVideo, 158, 90, 5, 5, (progress) => {
  // 		console.log(`Progress: ${progress.toFixed(2)}%`)
  // 	}).then((snapshots) => {
  // 		console.log("snapshots generated:", snapshots)
  // 	})
  // })

  // SECTION Keyboard Event Handler
  function handleKeyBoardEvents(event: KeyboardEvent) {
    const tagName = document.activeElement?.tagName.toLowerCase();

    if (event.target == document.body) return;
    if (tagName === "input") return;

    switch (event.key) {
      case " ":
        if (tagName === "button") return;
      case "k":
        playPauseVideo();
        break;
      case "ArrowLeft":
      case "j":
        fastRewind();
        break;
      case "ArrowRight":
      case "l":
        fastForward();
        break;
      case "m":
        volumeButton.click();
        break;
      case "ArrowUp":
        const newVolumeUp = Math.min(mainVideo.volume + 0.1, 1);
        setVolume(newVolumeUp);
        volumeRange.value = (newVolumeUp * 100).toString();
        break;
      case "ArrowDown":
        const newVolumeDown = Math.max(mainVideo.volume - 0.1, 0);
        setVolume(newVolumeDown);
        volumeRange.value = (newVolumeDown * 100).toString();
        break;
      case "f":
        toggleFullScreen(videoPlayer);
        break;
    }
  }
  // SECTION END Keyboard Event Handler

  // SECTION Event Listeners
  // ======================= GENERAL LISTENERS ==========================
  videoPlayer.addEventListener("contextmenu", (evt) => evt.preventDefault());
  mainVideo.addEventListener("progress", updateBufferedProgress);

  /* Check if the metadata is already loaded (this way may because of `astro:page-load`) */
  if (mainVideo.readyState >= 1) {
    updateVideoDuration();
  } else {
    mainVideo.addEventListener("loadedmetadata", updateVideoDuration);
  }

  // ======================= PLAYBACK CONTROL ==========================

  mainVideo.addEventListener("waiting", () => {
    loadingSpinner.style.display = "block";
  });
  mainVideo.addEventListener("canplay", () => {
    loadingSpinner.style.display = "none";
  });

  /**
   * Updates the current playback time and adjusts the progress bar width
   * based on the current time of the video.
   */
  mainVideo.addEventListener("timeupdate", () => {
    let currentTime = mainVideo.currentTime;
    currentDuration.textContent = formatTime(currentTime);
    let progressWidth = (currentTime / TOTAL_VIDEO_DURATION) * 100;
    progressBar.style.width = `${progressWidth}%`;
  });

  mainVideo.addEventListener("ended", () => {
    if (autoPlayButton.getAttribute("aria-checked") === "true") {
      playPauseVideo();
    }
  });

  playPauseButton.addEventListener("click", playPauseVideo);

  mainVideo.addEventListener("play", () => {
    videoPlayer.setAttribute("aria-paused", "false");
    playIcon.classList.add("hidden");
    pauseIcon.classList.remove("hidden");
    hideControls();
  });

  mainVideo.addEventListener("pause", () => {
    videoPlayer.setAttribute("aria-paused", "true");
    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");
    showControls();
  });

  fastRewindButton.addEventListener("click", fastRewind);
  fastForwardButton.addEventListener("click", fastForward);

  // ======================= PROGRESS AND SEEKING ==========================

  /**
   * Enables users to seek a specific time in the video by clicking or dragging on the
   * progress area. The event listeners handle pointer down, move, and up events to
   * calculate the click position relative to the width of the progress area and adjust
   * the video playback time accordingly. The progress bar is updated in real-time as the
   * user drags along the progress area.
   */

  progressArea.addEventListener("pointerdown", (e) => {
    progressArea.setPointerCapture(e.pointerId);
    setTimelinePosition(e);

    const onPointerMove = (e: PointerEvent) => setTimelinePosition(e);
    const onPointerUp = () => {
      progressArea.removeEventListener("pointermove", onPointerMove);
      progressArea.removeEventListener("pointerup", onPointerUp);
    };

    progressArea.addEventListener("pointermove", onPointerMove);
    progressArea.addEventListener("pointerup", onPointerUp);
  });

  /**
   * - Calculates the current time based on the cursor position relative to the progress area.
   * - Updates the displayed time and adjusts the position of the time indicator.
   * - The display is shown while the cursor is within the progress area.
   */
  progressArea.addEventListener("mousemove", (evt) => {
    const progressAreaWidth = progressArea.clientWidth;
    const offsetX = evt.clientX - progressArea.getBoundingClientRect().left;
    const percentage = offsetX / progressAreaWidth;
    const progressTime = Math.max(
      0,
      Math.min(mainVideo.duration * percentage, mainVideo.duration),
    );

    // Update time tooltip
    const formattedTime = formatTime(progressTime);
    progressAreaTime.textContent = formattedTime;

    // Position time tooltip
    const timeTooltipWidth = progressAreaTime.offsetWidth;
    let tooltipX = Math.max(offsetX, timeTooltipWidth / 2);
    tooltipX = Math.min(tooltipX, progressAreaWidth - timeTooltipWidth / 2);
    progressAreaTime.style.left = `${tooltipX}px`;
    progressAreaTime.style.transform = "translateX(-50%)";
    progressAreaTime.style.display = "block";

    // TODO Position snapshot preview
    // const snapshotWidth = progressAreaSnapshot.offsetWidth
    // let snapshotX = Math.max(offsetX, snapshotWidth / 2)
    // snapshotX = Math.min(snapshotX, progressAreaWidth - snapshotWidth / 2)
    // progressAreaSnapshot.style.left = `${snapshotX}px`
    // progressAreaSnapshot.style.transform = "translateX(-50%)"
    // progressAreaSnapshot.style.display = "block"

    // Update snapshot image
    // updateSnapshotImage(progressTime)
  });

  progressArea.addEventListener("mouseleave", () => {
    progressAreaTime.style.display = "none";
    progressAreaSnapshot.style.display = "none";
  });

  // ======================= VOLUME CONTROL ==========================
  volumeRange.addEventListener("input", () => {
    setVolume(parseFloat(volumeRange.value) / 100);
  });

  volumeButton.addEventListener("click", () => {
    if (mainVideo.volume === VOLUME_MUTED) {
      setVolume(VOLUME_HIGH);
      volumeRange.value = (VOLUME_HIGH * 100).toString();
    } else {
      setVolume(VOLUME_MUTED);
      volumeRange.value = "0";
    }
  });

  setVolume(VOLUME_HIGH);

  // ======================= AUTOPLAY TOGGLE ==========================
  autoPlayButton.addEventListener("click", () => {
    const isChecked = autoPlayButton.getAttribute("aria-checked") === "true";
    autoPlayButton.setAttribute("aria-checked", (!isChecked).toString());
    autoPlayButton.title = isChecked ? "Autoplay is off" : "Autoplay is on";
  });

  // ======================= PICTURE-IN-PICTURE ==========================
  pictureInPictureButton.addEventListener("click", async () => {
    try {
      if (navigator.userAgent.toLowerCase().includes("firefox")) {
        alert(
          "To use Picture-in-Picture in Firefox, hover over the video and click the Picture-in-Picture button.",
        );
      } else if (
        document.pictureInPictureEnabled &&
        mainVideo instanceof HTMLVideoElement
      ) {
        await mainVideo.requestPictureInPicture();
      } else {
        console.log("Picture-in-Picture is not supported by this browser.");
      }
    } catch (error) {
      console.error("Failed to enter Picture-in-Picture mode:", error);
    }
  });

  // ======================= FULLSCREEN CONTROL ==========================
  fullScreenButton.addEventListener("click", () =>
    toggleFullScreen(videoPlayer),
  );

  // ======================= SETTINGS CONTROL ==========================
  settingsButton.addEventListener("click", () => {
    const isSettingsOpened =
      settingsButton.getAttribute("aria-settings-opened") === "true";
    const newSettingsState = (!isSettingsOpened).toString();
    settings.setAttribute("aria-settings-opened", newSettingsState);
    settingsButton.setAttribute("aria-settings-opened", newSettingsState);
  });

  // Event listener for index items
  indexItems.forEach((item) => {
    item.addEventListener("click", () => {
      const setting = item.getAttribute("aria-label");
      showSetting(setting);
    });
  });

  // Event listener for back buttons in each settings section
  Object.values(settingsSections).forEach((section) => {
    const backButton = section.querySelector(
      ".settings-head svg",
    ) as SVGAElement;
    backButton.addEventListener("click", () => {
      hideAllSettings();
      indexSection.removeAttribute("hidden"); // Show index
    });
  });

  // Enable Playback Settings
  if (mainVideo && settingsSections.playbackSettings) {
    setPlaybackSpeed(mainVideo, settingsSections.playbackSettings);
  }

  // ======================= CONTROL VISIBILITY ==========================
  videoPlayer.addEventListener("mouseover", showControls);
  videoPlayer.addEventListener("mouseleave", () => {
    const isPaused = videoPlayer.getAttribute("aria-paused") === "true";
    const isSettingsOpened =
      settingsButton.getAttribute("aria-settings-opened") === "true";
    if (!isPaused && !isSettingsOpened) hideControls();
  });

  // ======================= KEYBOARD CONTROLS ==========================
  document.addEventListener("keydown", handleKeyBoardEvents);
}
