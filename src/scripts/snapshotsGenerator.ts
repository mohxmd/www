interface Snapshot {
  id: number;
  canvas?: HTMLCanvasElement;
  sec: Array<{
    index: number;
    backgroundPositionX: number;
    backgroundPositionY: number;
  }>;
  data?: string; // URL for the snapshot image
}

export async function generateSnapshots(
  videoElement: HTMLVideoElement,
  snapshotWidth: number = 158,
  snapshotHeight: number = 90,
  horizontalItemCount: number = 5,
  verticalItemCount: number = 5,
  onProgress?: (progress: number) => void, // Optional callback for progress
): Promise<Snapshot[]> {
  const snapshots: Snapshot[] = [];
  const duration = Math.floor(videoElement.duration);

  if (duration <= 0) {
    console.error("Video duration is not valid.");
    return snapshots;
  }

  let x = 0,
    y = 0,
    count = 1,
    id = 1;

  const array: number[] = Array.from({ length: duration }, (_, i) => i + 1);

  videoElement.pause();

  for (let i = 0; i < array.length; i += horizontalItemCount) {
    for (const startIndex of array.slice(i, i + horizontalItemCount)) {
      const backgroundPositionX = x * snapshotWidth;
      const backgroundPositionY = y * snapshotHeight;
      let item = snapshots.find((snap) => snap.id === id);

      if (!item) {
        const canvas = document.createElement("canvas");
        canvas.width = snapshotWidth * horizontalItemCount;
        canvas.height = snapshotHeight * verticalItemCount;

        item = {
          id,
          canvas,
          sec: [
            {
              index: startIndex,
              backgroundPositionX: -backgroundPositionX,
              backgroundPositionY: -backgroundPositionY,
            },
          ],
        };
        snapshots.push(item);
      } else {
        item.sec.push({
          index: startIndex,
          backgroundPositionX: -backgroundPositionX,
          backgroundPositionY: -backgroundPositionY,
        });
      }

      if (item.canvas) {
        const context = item.canvas.getContext("2d");
        if (context) {
          videoElement.currentTime = startIndex;

          await new Promise<void>((resolve) => {
            const event = () => {
              console.log(`Drawing frame at ${videoElement.currentTime}s`);
              context.drawImage(
                videoElement,
                backgroundPositionX,
                backgroundPositionY,
                snapshotWidth,
                snapshotHeight,
              );
              x++;
              videoElement.removeEventListener("canplay", event);
              resolve();
            };
            videoElement.addEventListener("canplay", event);
          });
        }
      }

      count++;

      // Update progress
      if (onProgress) {
        const progress = ((i + horizontalItemCount) / array.length) * 100;
        onProgress(progress);
      }
    }

    x = 0;
    y++;

    if (count > horizontalItemCount * verticalItemCount) {
      count = 1;
      x = 0;
      y = 0;
      id++;
    }
  }

  // Convert canvas to blob and remove canvas property
  const result = await Promise.all(
    snapshots.map(async (item) => {
      return new Promise<Snapshot>((resolve) => {
        if (item.canvas) {
          item.canvas.toBlob((blob) => {
            if (blob) {
              item.data = URL.createObjectURL(blob);
            }
            delete item.canvas; // Safely delete canvas property
            resolve(item);
          }, "image/jpeg");
        } else {
          resolve(item); // Resolve immediately if canvas is not defined
        }
      });
    }),
  );

  return result;
}
