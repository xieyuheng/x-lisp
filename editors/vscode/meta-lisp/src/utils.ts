import * as vscode from 'vscode'
import {
  OPEN_BRACKETS,
  CLOSE_BRACKETS,
  BRACKET_PAIRS,
  SYMBOL_CHAR_PATTERN,
} from './config'

export interface SexpInfo {
  openPos: vscode.Position
  openChar: string
}

export function isOpenBracket(char: string): boolean {
  return OPEN_BRACKETS.has(char)
}

export function isCloseBracket(char: string): boolean {
  return CLOSE_BRACKETS.has(char)
}

export function isSymbolChar(char: string): boolean {
  return SYMBOL_CHAR_PATTERN.test(char)
}

export function getCharAt(document: vscode.TextDocument, pos: vscode.Position): string | null {
  if (pos.line < 0 || pos.line >= document.lineCount) {
    return null
  }
  const line = document.lineAt(pos.line)
  if (pos.character < 0 || pos.character >= line.text.length) {
    return null
  }
  return line.text[pos.character]
}

export function moveForward(document: vscode.TextDocument, pos: vscode.Position): vscode.Position | null {
  const line = document.lineAt(pos.line)
  if (pos.character + 1 < line.text.length) {
    return new vscode.Position(pos.line, pos.character + 1)
  } else if (pos.line + 1 < document.lineCount) {
    return new vscode.Position(pos.line + 1, 0)
  }
  return null
}

export function moveBackward(document: vscode.TextDocument, pos: vscode.Position): vscode.Position | null {
  if (pos.character > 0) {
    return new vscode.Position(pos.line, pos.character - 1)
  } else if (pos.line > 0) {
    const prevLine = document.lineAt(pos.line - 1)
    return new vscode.Position(pos.line - 1, Math.max(0, prevLine.text.length - 1))
  }
  return null
}

export function isInsideString(document: vscode.TextDocument, pos: vscode.Position): boolean {
  let current = new vscode.Position(pos.line, pos.character)
  let inString = false

  for (let line = 0; line <= current.line; line++) {
    const text = line < current.line
      ? document.lineAt(line).text
      : document.lineAt(line).text.substring(0, current.character)

    for (let i = 0; i < text.length; i++) {
      const ch = text[i]
      if (ch === '"' && (i === 0 || text[i - 1] !== '\\')) {
        inString = !inString
      }
      if (ch === ';' && !inString) {
        break
      }
    }
  }

  return inString
}

export function isInsideComment(document: vscode.TextDocument, pos: vscode.Position): boolean {
  const line = document.lineAt(pos.line)
  const textBefore = line.text.substring(0, pos.character)
  let inString = false

  for (let i = 0; i < textBefore.length; i++) {
    const ch = textBefore[i]
    if (ch === '"' && (i === 0 || textBefore[i - 1] !== '\\')) {
      inString = !inString
    }
    if (ch === ';' && !inString) {
      return true
    }
  }

  return false
}

export function insideStringOrComment(document: vscode.TextDocument, pos: vscode.Position): boolean {
  return isInsideString(document, pos) || isInsideComment(document, pos)
}

export function readSymbolForward(
  document: vscode.TextDocument,
  pos: vscode.Position,
): { symbol: string; endPos: vscode.Position } | null {
  if (pos.line >= document.lineCount) {
    return null
  }

  const line = document.lineAt(pos.line)
  let col = pos.character

  while (col < line.text.length && (line.text[col] === ' ' || line.text[col] === '\t')) {
    col++
  }

  if (col >= line.text.length || line.text[col] === ';') {
    return null
  }

  if (!isSymbolChar(line.text[col])) {
    return null
  }

  let end = col
  while (end < line.text.length && isSymbolChar(line.text[end])) {
    end++
  }

  return {
    symbol: line.text.substring(col, end),
    endPos: new vscode.Position(pos.line, end),
  }
}

export function readKeywordAtSexpHead(
  document: vscode.TextDocument,
  openPos: vscode.Position,
): string | null {
  const afterOpen = moveForward(document, openPos)
  if (!afterOpen) {
    return null
  }

  const result = readSymbolForward(document, afterOpen)
  if (!result) {
    return null
  }

  return result.symbol
}

export function findEnclosingSexpStart(
  document: vscode.TextDocument,
  pos: vscode.Position,
): SexpInfo | null {
  const stack: string[] = []
  let current: vscode.Position | null = new vscode.Position(pos.line, pos.character)
  let depth = 0

  while (current) {
    const ch = getCharAt(document, current)

    if (ch && isCloseBracket(ch)) {
      stack.push(ch)
      depth++
    } else if (ch && isOpenBracket(ch)) {
      if (depth > 0) {
        const expectedClose = BRACKET_PAIRS[ch]
        const actualClose = stack[stack.length - 1]
        if (expectedClose === actualClose) {
          stack.pop()
          depth--
        }
      } else {
        return { openPos: current, openChar: ch }
      }
    }

    current = moveBackward(document, current)

    // stop at start of line to avoid infinite loops
    if (current && current.character === 0 && current.line === 0 && current.character === 0) {
      break
    }
  }

  return null
}

export function forwardPastSexp(
  document: vscode.TextDocument,
  pos: vscode.Position,
): vscode.Position | null {
  if (pos.line >= document.lineCount) {
    return null
  }

  let current: vscode.Position | null = new vscode.Position(pos.line, pos.character)
  const stack: string[] = []

  // Find start of next sexp (skip whitespace)
  while (current) {
    const ch = getCharAt(document, current)
    if (!ch) {
      current = moveForward(document, current)
      continue
    }

    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      current = moveForward(document, current)
      continue
    }

    if (ch === ';') {
      // skip to end of line
      const nextLine = current.line + 1
      current = nextLine < document.lineCount ? new vscode.Position(nextLine, 0) : null
      continue
    }

    break
  }

  if (!current) {
    return null
  }

  const startCh = getCharAt(document, current)
  if (startCh && isOpenBracket(startCh)) {
    stack.push(BRACKET_PAIRS[startCh])
    current = moveForward(document, current)
  } else if (startCh === '"') {
    // string
    current = moveForward(document, current)
    while (current) {
      const ch = getCharAt(document, current)
      if (ch === '"' && getCharAt(document, moveBackward(document, current)!) !== '\\') {
        return moveForward(document, current) || current
      }
      current = moveForward(document, current)
    }
    return null
  } else if (startCh && startCh !== ' ' && startCh !== '\t') {
    // symbol
    while (current) {
      const ch = getCharAt(document, current)
      if (!ch || ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === ';' ||
          isOpenBracket(ch) || isCloseBracket(ch)) {
        return current
      }
      current = moveForward(document, current)
    }
    return null
  } else {
    return null
  }

  // Traverse matched brackets
  while (current && stack.length > 0) {
    const ch = getCharAt(document, current)
    if (!ch) {
      current = moveForward(document, current)
      continue
    }

    if (isOpenBracket(ch)) {
      stack.push(BRACKET_PAIRS[ch])
    } else if (isCloseBracket(ch)) {
      const expected = stack[stack.length - 1]
      if (ch === expected) {
        stack.pop()
      } else {
        return null
      }
    } else if (ch === '"') {
      current = moveForward(document, current)
      while (current) {
        const c = getCharAt(document, current)
        if (c === '"' && getCharAt(document, moveBackward(document, current)!) !== '\\') {
          break
        }
        current = moveForward(document, current)
      }
    }

    if (!current) continue
    current = moveForward(document, current)
  }

  while (current) {
    const ch = getCharAt(document, current)
    if (ch === null) break
    if (ch === ' ' || ch === '\t') {
      current = moveForward(document, current)
      continue
    }
    if (ch === ';') {
      current = new vscode.Position(current.line + 1, 0)
      continue
    }
    break
  }

  return current
}

export function positionAfterSpecialArgs(
  document: vscode.TextDocument,
  openPos: vscode.Position,
  spec: number,
): vscode.Position | null {
  const afterOpen = moveForward(document, openPos)
  if (!afterOpen) {
    return null
  }

  const keywordResult = readSymbolForward(document, afterOpen)
  if (!keywordResult) {
    return null
  }
  let current: vscode.Position | null = keywordResult.endPos

  for (let i = 0; i < spec; i++) {
    current = forwardPastSexp(document, current)
    if (!current) {
      return null
    }
  }

  return current
}

function skipToContent(
  document: vscode.TextDocument,
  pos: vscode.Position,
): vscode.Position | null {
  let current: vscode.Position | null = new vscode.Position(pos.line, pos.character)

  while (current) {
    const ch = getCharAt(document, current)
    if (ch === null) {
      const next = moveForward(document, current)
      current = next
      continue
    }
    if (ch === ' ' || ch === '\t') {
      current = moveForward(document, current)
      continue
    }
    if (ch === ';') {
      const nextLine = current.line + 1
      current = nextLine < document.lineCount ? new vscode.Position(nextLine, 0) : null
      continue
    }
    break
  }

  return current
}

const INDENT_SIZE = 2

export function computeBodyIndent(
  document: vscode.TextDocument,
  openPos: vscode.Position,
  afterSpecials: vscode.Position,
): number {
  const firstContent = skipToContent(document, afterSpecials)

  if (!firstContent) {
    return openPos.character + INDENT_SIZE
  }

  if (openPos.line === firstContent.line) {
    return firstContent.character
  }

  return openPos.character + INDENT_SIZE
}

export function computeFunctionIndent(
  document: vscode.TextDocument,
  openPos: vscode.Position,
): number {
  const afterOpen = moveForward(document, openPos)
  if (!afterOpen) {
    return openPos.character + INDENT_SIZE
  }

  const result = readSymbolForward(document, afterOpen)
  if (!result) {
    return openPos.character + INDENT_SIZE
  }

  if (openPos.line === result.endPos.line) {
    return result.endPos.character
  }

  return openPos.character + INDENT_SIZE
}
