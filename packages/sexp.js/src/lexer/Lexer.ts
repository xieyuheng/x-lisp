import * as S from "../index.ts"
import { consume } from "./consume.ts"

export class Lexer {
  position: S.Position = S.initPosition()
  text: string = ""
  path: string

  constructor(options: S.ParserOptions) {
    this.path = options.path
  }

  lex(text: string): Array<S.Token> {
    this.text = text

    this.position = S.initPosition()

    const tokens: Array<S.Token> = []
    while (!this.isEnd()) {
      const token = consume(this)
      if (token === undefined) continue
      tokens.push(token)
    }

    return tokens
  }

  isEnd(): boolean {
    return this.position.index >= this.text.length
  }

  char(): string | undefined {
    return this.text[this.position.index]
  }

  forward(count: number): void {
    let { index, row, column } = this.position
    const text = this.text

    while (count-- > 0 && index < text.length) {
      if (text[index] === "\n") {
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
