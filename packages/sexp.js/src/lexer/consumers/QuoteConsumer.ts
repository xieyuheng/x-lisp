import * as S from "../index.ts"
import { lexerQuotes } from "../lexerHelpers.ts"

const QUOTES = new Set(lexerQuotes())

export class QuoteConsumer implements S.Consumer {
  kind = "QuotationMark" as const

  canConsume(lexer: S.Lexer): boolean {
    const char = lexer.char()
    return char !== undefined && QUOTES.has(char)
  }

  consume(lexer: S.Lexer): string {
    const char = lexer.char()
    if (char === undefined) {
      let message = `Expect a quotation mark, but reached end of input`
      throw new Error(message)
    }

    lexer.forward(1)
    return char
  }
}
