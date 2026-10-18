import * as S from "../index.ts"
import { lexerBrackets } from "../lexerHelpers.ts"

const BRACKET_STARTS = new Set(lexerBrackets().map(({ start }) => start))

export class BracketStartConsumer implements S.Consumer {
  kind = "BracketStart" as const

  canConsume(lexer: S.Lexer): boolean {
    const char = lexer.char()
    return char !== undefined && BRACKET_STARTS.has(char)
  }

  consume(lexer: S.Lexer): string {
    const char = lexer.char()
    if (char === undefined) {
      let message = `Expect a bracket start, but reached end of input`
      throw new Error(message)
    }

    lexer.forward(1)
    return char
  }
}
