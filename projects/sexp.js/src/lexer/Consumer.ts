import { type TokenKind } from "../token/index.ts"
import { Lexer } from "./Lexer.ts"

export interface Consumer {
  kind: TokenKind | undefined
  canConsume(lexer: Lexer): boolean
  consume(lexer: Lexer): string
}
