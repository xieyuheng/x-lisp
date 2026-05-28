import * as S from "../index.ts"

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
  let value = ""
  while (
    !lexer.isEnd() &&
    lexer.char().trim() !== "" &&
    !S.lexerMarks().includes(lexer.char())
  ) {
    value += lexer.char()
    lexer.forward(1)
  }

  return value
}
