import { type Span } from "../span/index.ts"

export type TokenKind =
  | "Symbol"
  | "String"
  | "Number"
  | "BracketStart"
  | "BracketEnd"
  | "QuotationMark"
  | "Keyword"

export type SourceLocation = {
  span: Span
  text: string
  path?: string
}

export type Token = {
  kind: TokenKind
  value: string
  meta: SourceLocation
}
