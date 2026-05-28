import * as S from "../index.ts"

export class BracketStartConsumer implements S.Consumer {
  kind = "BracketStart" as const

  canConsume(lexer: S.Lexer): boolean {
    const char = lexer.char()
    return S.lexerBrackets()
      .map(({ start }) => start)
      .includes(char)
  }

  consume(lexer: S.Lexer): string {
    const char = lexer.char()
    lexer.forward(1)
    return char
  }
}
