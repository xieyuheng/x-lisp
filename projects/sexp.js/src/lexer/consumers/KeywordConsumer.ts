import type { Consumer } from "../Consumer.ts"
import type { Lexer } from "../Lexer.ts"
import { consumeSymbol } from "./SymbolConsumer.ts"

export class KeywordConsumer implements Consumer {
  kind = "Keyword" as const

  canConsume(lexer: Lexer): boolean {
    return lexer.char() === ":"
  }

  consume(lexer: Lexer): string {
    lexer.forward(1)
    return consumeSymbol(lexer)
  }
}
