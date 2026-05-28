import * as S from "../index.ts"

export class BracketEndConsumer implements S.Consumer {
  kind = "BracketEnd" as const

  canConsume(lexer: S.Lexer): boolean {
    const char = lexer.char()
    return S.lexerBrackets()
      .map(({ end }) => end)
      .includes(char)
  }

  consume(lexer: S.Lexer): string {
    const char = lexer.char()
    lexer.forward(1)
    return char
  }
}
