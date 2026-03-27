import { type SourceLocation } from "./SourceLocation.ts"

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
  location: SourceLocation
}
