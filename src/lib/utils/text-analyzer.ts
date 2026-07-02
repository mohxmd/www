/*
 * Calculates reading time and word count for blog content.
 * Supports CJK languages and custom word boundaries.
 * Returns words, minutes, and time in milliseconds.
 */

type ReadingTimeResult = {
  words: number;
  minutes: number;
  time: number;
};

export function readingTime(
  text: string,
  options: {
    wordsPerMinute?: number;
    wordBound?: (char: string) => boolean;
  } = {}
): ReadingTimeResult {
  const { wordsPerMinute = 200, wordBound = isAnsiWordBound } = options;
  let words = 0;
  let start = 0;
  let end = text.length - 1;
  const normalizedText = `${text}\n`;

  // Skip leading/trailing word boundaries
  while (start < text.length && text[start] && wordBound(text[start]!)) start++;
  while (end >= 0 && text[end] && wordBound(text[end]!)) end--;

  // Count words
  for (let i = start; i <= end; i++) {
    const current = normalizedText.codePointAt(i);
    const currentChar = current ? String.fromCodePoint(current) : undefined;
    const nextIndex = i + (currentChar?.length ?? 1);
    const next = normalizedText.codePointAt(nextIndex);
    const nextChar = next ? String.fromCodePoint(next) : undefined;
    if (!currentChar) continue;

    if (
      isCJK(currentChar) ||
      (!wordBound(currentChar) && nextChar && (wordBound(nextChar) || isCJK(nextChar)))
    ) {
      words++;
    }
    if (isCJK(currentChar)) {
      while (i <= end && nextChar && (isPunctuation(nextChar) || wordBound(nextChar))) {
        i = nextIndex;
      }
    }

    if (currentChar.length === 2) i++;
  }

  // Calculate reading time
  const minutes = words / wordsPerMinute;
  const time = Math.round(minutes * 60 * 1000);
  const displayedMinutes = Math.ceil(minutes);

  return { words, minutes: displayedMinutes, time };
}

function isCJK(c: string): boolean {
  const charCode = c.codePointAt(0);
  if (charCode === undefined) return false;
  return (
    (0x3040 <= charCode && charCode <= 0x309f) || // Hiragana
    (0x4e00 <= charCode && charCode <= 0x9fff) || // CJK Unified ideographs
    (0xac00 <= charCode && charCode <= 0xd7a3) || // Hangul
    (0x20000 <= charCode && charCode <= 0x2ebe0) // CJK extensions
  );
}

function isAnsiWordBound(c: string): boolean {
  return " \n\r\t".includes(c);
}

function isPunctuation(c: string): boolean {
  const charCode = c.codePointAt(0);
  if (charCode === undefined) return false;
  return (
    (0x21 <= charCode && charCode <= 0x2f) ||
    (0x3a <= charCode && charCode <= 0x40) ||
    (0x5b <= charCode && charCode <= 0x60) ||
    (0x7b <= charCode && charCode <= 0x7e) ||
    (0x3000 <= charCode && charCode <= 0x303f) || // CJK Symbols and Punctuation
    (0xff00 <= charCode && charCode <= 0xffef) // Full-width ASCII punctuation
  );
}
