import { leftPad } from "@xieyuheng/std.js/format"
import { codePointDisplayWidth, stringIsBlank } from "@xieyuheng/std.js/string"
import { type Span } from "./Span.ts"

type Line = {
  index: number
  content: string
  underline?: string
}

export function spanReport(span: Span, context: string): string {
  const lines = context
    .split("\n")
    .map((content, index) => ({ index, content }))
  const widths = codeUnitDisplayWidths(context)
  linesMarkUnderline(lines, span, widths)
  const prefixMargin = linesPrefixMargin(lines)
  return lines
    .filter((line) => lineIsCloseToSpan(line, span))
    .map((line) => formatLine(line, prefixMargin))
    .join("")
}

// Display width of every UTF-16 code unit of `text`,
// aligned with the code unit indexes used by `Span`.
// A surrogate pair is one character in two code units,
// so its low surrogate is given width 0.
function codeUnitDisplayWidths(text: string): Array<number> {
  const widths: Array<number> = []
  for (const char of text) {
    widths.push(codePointDisplayWidth(char.codePointAt(0) ?? 0))
    if (char.length === 2) widths.push(0)
  }
  return widths
}

function lineIsCloseToSpan(line: Line, span: Span): boolean {
  return span.start.row - 3 < line.index && line.index < span.end.row + 3
}

function linesPrefixMargin(lines: Array<Line>): number {
  return lines.length.toString().length + 1
}

function linesMarkUnderline(
  lines: Array<Line>,
  span: Span,
  widths: Array<number>,
): void {
  let cursor = 0
  for (const line of lines) {
    const start = cursor
    const end = cursor + line.content.length + 1
    line.underline = lineUnderline(start, end, span, widths)
    cursor = end
  }
}

function lineUnderline(
  start: number,
  end: number,
  span: Span,
  widths: Array<number>,
): string | undefined {
  let underline = ""
  for (let i = start; i < end; i++) {
    const mark = span.start.index <= i && i < span.end.index ? "~" : " "
    // the position just past the end of the context is one column wide
    underline += mark.repeat(widths[i] ?? 1)
  }

  if (stringIsBlank(underline)) {
    return undefined
  } else {
    return underline
  }
}

function formatLine(line: Line, prefixMargin: number): string {
  const lineno = line.index + 1
  const prefix = leftPad(lineno.toString(), prefixMargin, " ")
  if (line.underline) {
    const emptyPrefix = leftPad("", prefixMargin, " ")
    return (
      `${prefix} | ${line.content}\n` + `${emptyPrefix} | ${line.underline}\n`
    )
  } else {
    return `${prefix} | ${line.content}\n`
  }
}
