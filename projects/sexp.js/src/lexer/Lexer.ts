import assert from "node:assert"
import * as S from "../index.ts"
import { consume } from "./consume.ts"

export class Lexer {
  position = S.initPosition()
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
    return this.text.length === this.position.index
  }

  char(): string {
    const char = this.text[this.position.index]
    assert(char !== undefined)
    return char
  }

  line(): string {
    const lines = this.remain().split("\n")
    return lines[0]
  }

  word(): string {
    const words = this.line().split(" ")
    return words[0]
  }

  remain(): string {
    return this.text.slice(this.position.index)
  }

  forward(count: number): void {
    if (this.isEnd()) return

    while (count-- > 0) {
      this.position = S.positionForwardChar(this.position, this.char())
    }
  }
}
