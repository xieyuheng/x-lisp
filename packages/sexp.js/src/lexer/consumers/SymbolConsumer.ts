import * as S from "../index.ts"
import { charIsBlank, MARK_CHARS } from "../lexerHelpers.ts"

export class SymbolConsumer implements S.Consumer {
  kind = "Symbol" as const

  canConsume(lexer: S.Lexer): boolean {
    return true
  }

  consume(lexer: S.Lexer): string {
    return consumeSymbol(lexer)
  }
}

export function consumeSymbol(lexer: S.Lexer): string {
  const start = lexer.position.index
  while (!lexer.isEnd()) {
    const char = lexer.char()
    if (char === undefined || charIsBlank(char) || MARK_CHARS.has(char)) break
    lexer.forward(1)
  }

  return lexer.text.slice(start, lexer.position.index)
}
