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
  linesMarkUnderline(lines, span)
  const prefixMargin = linesPrefixMargin(lines)
  return lines
    .filter((line) => lineIsCloseToSpan(line, span))
    .map((line) => formatLine(line, prefixMargin))
    .join("")
}

function lineIsCloseToSpan(line: Line, span: Span): boolean {
  return span.start.row - 3 < line.index && line.index < span.end.row + 3
}

function linesPrefixMargin(lines: Array<Line>): number {
  return lines.length.toString().length + 1
}

function linesMarkUnderline(lines: Array<Line>, span: Span): void {
  // a span index counts characters, and a newline is one character
  let cursor = 0
  for (const line of lines) {
    const chars = [...line.content]
    line.underline = lineUnderline(chars, cursor, span)
    cursor += chars.length + 1
  }
}

// A character occupies as many columns as its display width.
function lineUnderline(
  chars: Array<string>,
  start: number,
  span: Span,
): string | undefined {
  let underline = ""
  let index = start
  for (const char of chars) {
    const mark = underlineMark(span, index)
    underline += mark.repeat(codePointDisplayWidth(char.codePointAt(0) ?? 0))
    index++
  }

  // the position just past the end of the line is the newline or the end of file
  underline += underlineMark(span, index)

  if (stringIsBlank(underline)) {
    return undefined
  } else {
    return underline
  }
}

function underlineMark(span: Span, index: number): string {
  return span.start.index <= index && index < span.end.index ? "~" : " "
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
