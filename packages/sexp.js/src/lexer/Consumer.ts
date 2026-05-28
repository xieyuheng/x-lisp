import * as S from "../index.ts"

export interface Consumer {
  kind: S.TokenKind | undefined
  canConsume(lexer: S.Lexer): boolean
  consume(lexer: S.Lexer): string
}
