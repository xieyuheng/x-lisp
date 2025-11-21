import { type Span } from "../span/index.ts"

export type TokenKind =
  | "Symbol"
  | "DoubleQoutedString"
  | "Number"
  | "BracketStart"
  | "BracketEnd"
  | "QuotationMark"
  | "Keyword"
  | "Hashtag"

export type TokenMeta = {
  span: Span
  text: string
  url?: URL
}

export type Token = {
  kind: TokenKind
  value: string
  meta: TokenMeta
}
