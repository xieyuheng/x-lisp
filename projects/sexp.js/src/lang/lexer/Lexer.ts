import assert from "node:assert"
import type { ParserOptions } from "../parser/index.ts"
import { initPosition, positionForwardChar } from "../span/index.ts"
import { type Token } from "../token/index.ts"
import { consume } from "./consume.ts"

export class Lexer {
  position = initPosition()
  text: string = ""
  path: string

  constructor(options: ParserOptions) {
    this.path = options.path
  }

  lex(text: string): Array<Token> {
    this.text = text

    this.position = initPosition()

    const tokens: Array<Token> = []
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
      this.position = positionForwardChar(this.position, this.char())
    }
  }
}
