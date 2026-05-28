import * as S from "../index.ts"

export class QuoteConsumer implements S.Consumer {
  kind = "QuotationMark" as const

  canConsume(lexer: S.Lexer): boolean {
    return S.lexerQuotes().includes(lexer.char())
  }

  consume(lexer: S.Lexer): string {
    const char = lexer.char()
    lexer.forward(1)
    return char
  }
}
