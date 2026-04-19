import { stringIsBigInt, stringIsNumber } from "@xieyuheng/helpers.js/string"
import { ErrorWithSourceLocation } from "../errors/index.ts"
import { Lexer, lexerMatchBrackets } from "../lexer/index.ts"
import * as S from "../sexp/index.ts"
import { type Sexp } from "../sexp/index.ts"
import { spanUnion } from "../span/index.ts"
import { type Token } from "../token/index.ts"

type Result = { sexp: Sexp; remain: Array<Token> }

export type ParserOptions = {
  path: string
}

export class Parser {
  lexer: Lexer

  constructor(options: ParserOptions) {
    this.lexer = new Lexer(options)
  }

  parse(text: string): Array<Sexp> {
    let tokens = this.lexer.lex(text)
    const array: Array<Sexp> = []
    while (tokens.length > 0) {
      const { sexp, remain } = this.handleTokens(tokens)
      array.push(sexp)
      if (remain.length === 0) return array

      tokens = remain
    }

    return array
  }

  private handleTokens(tokens: Array<Token>): Result {
    if (tokens[0] === undefined) {
      let message = "I expect a token, but there is no token remain\n"
      throw new Error(message)
    }

    const token = tokens[0]

    switch (token.kind) {
      case "Symbol": {
        return {
          sexp: S.Symbol(token.value, token.location),
          remain: tokens.slice(1),
        }
      }

      case "Number": {
        if (stringIsBigInt(token.value)) {
          return {
            sexp: S.Int(BigInt(token.value), token.location),
            remain: tokens.slice(1),
          }
        }

        if (stringIsNumber(token.value)) {
          return {
            sexp: S.Float(Number(token.value), token.location),
            remain: tokens.slice(1),
          }
        }

        let message = `I expect value to be a bigint or number: ${token.value}\n`
        throw new Error(message)
      }

      case "String": {
        return {
          sexp: S.String(token.value, token.location),
          remain: tokens.slice(1),
        }
      }

      case "BracketStart": {
        if (token.value === "[") {
          const { sexp, remain } = this.handleTokensInBracket(
            token,
            tokens.slice(1),
          )
          return { sexp: S.Cons(S.Symbol("@list"), sexp), remain }
        }

        if (token.value === "{") {
          const { sexp, remain } = this.handleTokensInBracket(
            token,
            tokens.slice(1),
          )
          return { sexp: S.Cons(S.Symbol("@record"), sexp), remain }
        }

        return this.handleTokensInBracket(token, tokens.slice(1))
      }

      case "BracketEnd": {
        let message = `I found extra BracketEnd\n`
        throw new ErrorWithSourceLocation(message, token.location)
      }

      case "QuotationMark": {
        const { sexp, remain } = this.handleTokens(tokens.slice(1))

        const quoteTable: Record<string, string> = {
          "'": "@quote",
          ",": "@unquote",
          "`": "@quasiquote",
        }

        const quoteSymbol = S.Symbol(quoteTable[token.value], token.location)

        return {
          sexp: S.List([quoteSymbol, sexp], token.location),
          remain,
        }
      }

      case "Keyword": {
        return {
          sexp: S.Keyword(token.value, token.location),
          remain: tokens.slice(1),
        }
      }
    }
  }

  private handleTokensInBracket(start: Token, tokens: Array<Token>): Result {
    const array: Array<S.Sexp> = []

    while (true) {
      if (tokens[0] === undefined) {
        let message = `I found missing BracketEnd\n`
        throw new ErrorWithSourceLocation(message, start.location)
      }

      const token = tokens[0]

      if (token.kind === "BracketEnd") {
        if (!lexerMatchBrackets(start.value, token.value)) {
          let message = `I expect a matching BracketEnd\n`
          throw new ErrorWithSourceLocation(message, token.location)
        }

        return {
          sexp: S.List(array, {
            ...token.location,
            span: spanUnion(start.location.span, token.location.span),
          }),
          remain: tokens.slice(1),
        }
      }

      const head = this.handleTokens(tokens)
      array.push(head.sexp)
      tokens = head.remain
    }
  }
}
