import * as S from "../index.ts"
import { consumeSymbol } from "./SymbolConsumer.ts"

export class KeywordConsumer implements S.Consumer {
  kind = "Keyword" as const

  canConsume(lexer: S.Lexer): boolean {
    return lexer.char() === ":"
  }

  consume(lexer: S.Lexer): string {
    lexer.forward(1)
    return consumeSymbol(lexer)
  }
}
