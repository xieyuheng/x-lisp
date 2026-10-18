// Display width of a code point, measured in terminal columns.
// Wide code points (East Asian Wide / Fullwidth, emoji presentation)
// occupy two columns, every other code point occupies one column.
export function codePointDisplayWidth(codePoint: number): number {
  if (codePointIsWide(codePoint)) return 2
  return 1
}

// Code points that occupy two columns in a terminal:
// East Asian Width "W" (Wide) / "F" (Fullwidth),
// and code points with emoji presentation.
// Reference: https://www.unicode.org/Public/UNIDATA/EastAsianWidth.txt
const wideRanges: Array<[number, number]> = [
  [0x1100, 0x115f], // Hangul Jamo
  [0x2329, 0x232a], // angle brackets
  [0x2e80, 0x303e], // CJK Radicals Supplement .. CJK Symbols and Punctuation
  [0x3040, 0x3247], // Hiragana .. Enclosed CJK Letters and Months
  [0x3250, 0x4dbf], // Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
  [0x4e00, 0xa4c6], // CJK Unified Ideographs .. Yi Radicals
  [0xa960, 0xa97c], // Hangul Jamo Extended-A
  [0xac00, 0xd7a3], // Hangul Syllables
  [0xf900, 0xfaff], // CJK Compatibility Ideographs
  [0xfe10, 0xfe19], // Vertical Forms
  [0xfe30, 0xfe6b], // CJK Compatibility Forms .. Small Form Variants
  [0xff01, 0xff60], // Fullwidth Forms
  [0xffe0, 0xffe6], // Fullwidth Signs
  [0x1b000, 0x1b001], // Kana Supplement
  [0x1f200, 0x1f251], // Enclosed Ideographic Supplement
  [0x1f300, 0x1f64f], // Emoji
  [0x1f680, 0x1f6ff], // Emoji
  [0x1f900, 0x1f9ff], // Emoji
  [0x1fa70, 0x1faff], // Emoji
  [0x20000, 0x3fffd], // CJK Unified Ideographs Extension B and later
]

function codePointIsWide(codePoint: number): boolean {
  return wideRanges.some(
    ([start, end]) => start <= codePoint && codePoint <= end,
  )
}
