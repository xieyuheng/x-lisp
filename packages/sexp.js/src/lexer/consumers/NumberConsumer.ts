import * as S from "../index.ts"
import { charIsBlank, MARK_CHARS } from "../lexerHelpers.ts"

// A JSON number, matched once instead of the previous
// per-prefix `JSON.parse` probing loop.
const NUMBER_RE = /-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/y

export class NumberConsumer implements S.Consumer {
  kind = "Number" as const

  canConsume(lexer: S.Lexer): boolean {
    return matchNumber(lexer) !== -1
  }

  consume(lexer: S.Lexer): string {
    const length = matchNumber(lexer)
    if (length === -1) {
      let message = `Expect a number at index: ${lexer.position.index}`
      throw new Error(message)
    }

    const start = lexer.position.index
    lexer.forward(length)
    return lexer.text.slice(start, start + length)
  }
}

// Returns the length of the number head starting at the current
// position, or -1 when the head is not a number. A number head must
// be followed by a blank, a mark, or the end of the text -- so that
// `3f2c1` and `3-sphere` stay symbols.
function matchNumber(lexer: S.Lexer): number {
  const text = lexer.text
  NUMBER_RE.lastIndex = lexer.position.index
  const match = NUMBER_RE.exec(text)
  if (match === null) return -1

  const end = lexer.position.index + match[0].length
  const next = text[end]
  if (next === undefined || charIsBlank(next) || MARK_CHARS.has(next)) {
    return match[0].length
  }

  return -1
}
