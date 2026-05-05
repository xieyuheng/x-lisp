import * as S from "../index.ts"

export type TokenKind =
  | "Symbol"
  | "String"
  | "Number"
  | "BracketStart"
  | "BracketEnd"
  | "QuotationMark"
  | "Keyword"

export type Token = {
  kind: TokenKind
  value: string
  location: S.SourceLocation
}
