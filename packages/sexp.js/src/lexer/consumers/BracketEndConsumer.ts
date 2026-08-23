import * as S from "../index.ts"
import { lexerBrackets } from "../lexerHelpers.ts"

const BRACKET_ENDS = new Set(lexerBrackets().map(({ end }) => end))

export class BracketEndConsumer implements S.Consumer {
  kind = "BracketEnd" as const

  canConsume(lexer: S.Lexer): boolean {
    const char = lexer.char()
    return char !== undefined && BRACKET_ENDS.has(char)
  }

  consume(lexer: S.Lexer): string {
    const char = lexer.char()
    if (char === undefined) {
      let message = `Expect a bracket end, but reached end of input`
      throw new Error(message)
    }

    lexer.forward(1)
    return char
  }
}
