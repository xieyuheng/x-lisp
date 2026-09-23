import * as S from "@xieyuheng/sexp.js"
import { parseFrontMatterKv } from "../front-matter/index.ts"

export type MarkdownDocument = {
  path: string
  text: string
  frontMatter?: Map<string, string>
  codeBlocks: Array<MarkdownCodeBlock>
}

export type MarkdownCodeBlock = {
  index: number
  info: string
  language: string | undefined
  content: string
  contentStart: S.Position
}

type Line = {
  text: string
  start: S.Position
  end: S.Position
  cursor: number
  nextCursor: number
}

type FrontMatterResult = {
  frontMatter?: Map<string, string>
  nextLineIndex: number
}

type OpeningFence = {
  fenceText: string
  info: string
}

export function parseMarkdown(text: string, path: string): MarkdownDocument {
  const lines = scanLines(text)
  const frontMatterResult = parseMarkdownFrontMatter(text, lines)
  const codeBlocks: Array<MarkdownCodeBlock> = []

  let lineIndex = frontMatterResult.nextLineIndex
  while (lineIndex < lines.length) {
    const openingLine = lines[lineIndex]
    const openingText = lineText(openingLine)
    const openingFence = parseOpeningFence(openingText)

    if (openingFence === undefined) {
      lineIndex++
      continue
    }

    const { fenceText, info } = openingFence
    const fenceChar = fenceText[0]
    const fenceLength = fenceText.length
    const language = firstWord(info)?.toLowerCase()

    const closingLineIndex = findClosingFence(
      lines,
      lineIndex + 1,
      fenceChar,
      fenceLength,
    )

    if (closingLineIndex === undefined) {
      let message = `[parseMarkdown] unclosed fenced code block`
      message += `\n  fence: ${fenceText}`
      throw new S.ErrorWithSourceLocation(
        message,
        S.makeSourceLocation(path, lineSpan(openingLine)),
      )
    }

    const contentStartLine = lines[lineIndex + 1]
    const closingLine = lines[closingLineIndex]
    const content = text.slice(openingLine.nextCursor, closingLine.cursor)

    codeBlocks.push({
      index: codeBlocks.length,
      info,
      language,
      content,
      contentStart: contentStartLine.start,
    })

    lineIndex = closingLineIndex + 1
  }

  return {
    path,
    text,
    frontMatter: frontMatterResult.frontMatter,
    codeBlocks,
  }
}

function scanLines(text: string): Array<Line> {
  const lines: Array<Line> = []

  let cursor = 0
  let position = S.initPosition()
  let lineStartCursor = 0
  let lineStartPosition = position

  while (cursor < text.length) {
    const char = text[cursor]

    if (char === "\n") {
      lines.push({
        text: text.slice(lineStartCursor, cursor),
        start: lineStartPosition,
        end: position,
        cursor: lineStartCursor,
        nextCursor: cursor + 1,
      })

      cursor++
      position = S.positionForwardChar(position, char)
      lineStartCursor = cursor
      lineStartPosition = position
      continue
    }

    cursor++
    const codeUnit = char.charCodeAt(0)
    if (isLowSurrogate(codeUnit)) continue
    position = S.positionForwardChar(position, char)
  }

  if (lineStartCursor < text.length || lines.length === 0) {
    lines.push({
      text: text.slice(lineStartCursor, cursor),
      start: lineStartPosition,
      end: position,
      cursor: lineStartCursor,
      nextCursor: cursor,
    })
  }

  return lines
}

function parseMarkdownFrontMatter(
  text: string,
  lines: Array<Line>,
): FrontMatterResult {
  if (lines.length === 0) return { nextLineIndex: 0 }

  const openingLine = lines[0]
  if (trimLineText(openingLine) !== "---") return { nextLineIndex: 0 }

  const closingLineIndex = findFrontMatterClosingLine(lines, 1)
  if (closingLineIndex === undefined) return { nextLineIndex: 0 }

  const closingLine = lines[closingLineIndex]
  const raw = text.slice(openingLine.nextCursor, closingLine.cursor)
  const frontMatter = parseFrontMatterKv(raw)

  return {
    frontMatter,
    nextLineIndex: closingLineIndex + 1,
  }
}

function parseOpeningFence(line: string): OpeningFence | undefined {
  let index = 0
  while (index < 3 && line[index] === " ") index++

  const fenceChar = line[index]
  if (fenceChar !== "`" && fenceChar !== "~") return undefined

  let end = index
  while (line[end] === fenceChar) end++

  const fenceText = line.slice(index, end)
  if (fenceText.length < 3) return undefined

  return {
    fenceText,
    info: line.slice(end).trim(),
  }
}

function findClosingFence(
  lines: Array<Line>,
  startLineIndex: number,
  fenceChar: string,
  fenceLength: number,
): number | undefined {
  for (let i = startLineIndex; i < lines.length; i++) {
    if (isClosingFence(lineText(lines[i]), fenceChar, fenceLength)) {
      return i
    }
  }

  return undefined
}

function findFrontMatterClosingLine(
  lines: Array<Line>,
  startLineIndex: number,
): number | undefined {
  for (let i = startLineIndex; i < lines.length; i++) {
    const text = trimLineText(lines[i])
    if (text === "---" || text === "...") return i
  }

  return undefined
}

function isClosingFence(
  text: string,
  fenceChar: string,
  fenceLength: number,
): boolean {
  let index = 0
  while (index < 3 && text[index] === " ") index++

  let count = 0
  while (text[index + count] === fenceChar) count++

  if (count < fenceLength) return false

  for (let i = index + count; i < text.length; i++) {
    const char = text[i]
    if (char !== " " && char !== "\t") return false
  }

  return true
}

function firstWord(text: string): string | undefined {
  let start = 0
  while (start < text.length && isWhitespace(text[start])) start++

  let end = start
  while (end < text.length && !isWhitespace(text[end])) end++

  return start === end ? undefined : text.slice(start, end)
}

function lineText(line: Line): string {
  return line.text.endsWith("\r") ? line.text.slice(0, -1) : line.text
}

function trimLineText(line: Line): string {
  return lineText(line).trimEnd()
}

function isWhitespace(char: string): boolean {
  return (
    char === " " ||
    char === "\t" ||
    char === "\n" ||
    char === "\r" ||
    char === "\v" ||
    char === "\f"
  )
}

function lineSpan(line: Line): S.Span {
  return makeSpan(line.start, line.end)
}

function makeSpan(start: S.Position, end: S.Position): S.Span {
  return { start, end }
}

function isLowSurrogate(codeUnit: number): boolean {
  return 0xdc00 <= codeUnit && codeUnit <= 0xdfff
}
