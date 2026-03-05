import type { Consumer } from "../Consumer.ts"
import { lexerQuotes, type Lexer } from "../index.ts"

export class QuoteConsumer implements Consumer {
  kind = "QuotationMark" as const

  canConsume(lexer: Lexer): boolean {
    return lexerQuotes().includes(lexer.char())
  }

  consume(lexer: Lexer): string {
    const char = lexer.char()
    lexer.forward(1)
    return char
  }
}
