import { leftPad } from "../../helpers/format/leftPad.ts"
import { stringIsBlank } from "../../helpers/string/stringIsBlank.ts"
import { type Span } from "./Span.ts"

type Line = {
  index: number
  text: string
  underline?: string
}

export function spanReport(span: Span, context: string): string {
  const lines = context.split("\n").map((text, index) => ({ index, text }))
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
  let cursor = 0
  for (const line of lines) {
    const start = cursor
    const end = cursor + line.text.length + 1
    line.underline = lineUnderline(line, start, end, span)
    cursor = end
  }
}

function lineUnderline(
  line: Line,
  start: number,
  end: number,
  span: Span,
): string | undefined {
  let underline = ""
  for (let i = start; i < end; i++) {
    if (span.start.index <= i && i < span.end.index) {
      underline += "~"
    } else {
      underline += " "
    }
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
    return `${prefix} | ${line.text}\n` + `${emptyPrefix} | ${line.underline}\n`
  } else {
    return `${prefix} | ${line.text}\n`
  }
}
