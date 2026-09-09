import * as S from "../index.ts"
import { consume } from "./consume.ts"

export class Lexer {
  position: S.Position = S.initPosition()
  // `cursor` counts code units, while `position` counts characters,
  // so that a span index is a character index, not a code unit index.
  cursor: number = 0
  text: string = ""
  path: string

  constructor(options: S.ParserOptions) {
    this.path = options.path
  }

  lex(text: string): Array<S.Token> {
    this.text = text

    this.position = S.initPosition()
    this.cursor = 0

    const tokens: Array<S.Token> = []
    while (!this.isEnd()) {
      const token = consume(this)
      if (token === undefined) continue
      tokens.push(token)
    }

    return tokens
  }

  isEnd(): boolean {
    return this.cursor >= this.text.length
  }

  char(): string | undefined {
    return this.text[this.cursor]
  }

  forward(count: number): void {
    let { index, row, column } = this.position
    const text = this.text

    while (count-- > 0 && this.cursor < text.length) {
      const char = text[this.cursor]
      this.cursor++

      // a low surrogate is the second half of a character,
      // so it does not advance the position
      const codeUnit = char.charCodeAt(0)
      if (0xdc00 <= codeUnit && codeUnit <= 0xdfff) continue

      if (char === "\n") {
        column = 0
        row++
      } else {
        column++
      }
      index++
    }

    this.position = { index, row, column }
  }
}
