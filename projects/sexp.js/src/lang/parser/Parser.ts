import { stringIsBigInt, stringIsNumber } from "@xieyuheng/helpers.js/string"
import { ErrorWithMeta } from "../errors/index.ts"
import { Lexer, lexerMatchBrackets } from "../lexer/index.ts"
import * as S from "../sexp/index.ts"
import { type Sexp } from "../sexp/index.ts"
import { spanUnion } from "../span/index.ts"
import { tokenMetaToSexpMeta, type Token } from "../token/index.ts"

type Result = { sexp: Sexp; remain: Array<Token> }

export type ParserMeta = {
  url?: URL
}

export class Parser {
  lexer = new Lexer()

  parse(text: string, meta: ParserMeta = {}): Array<Sexp> {
    let tokens = this.lexer.lex(text, meta)
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
          sexp: S.Symbol(token.value, tokenMetaToSexpMeta(token.meta)),
          remain: tokens.slice(1),
        }
      }

      case "Number": {
        if (stringIsBigInt(token.value)) {
          return {
            sexp: S.Int(BigInt(token.value), tokenMetaToSexpMeta(token.meta)),
            remain: tokens.slice(1),
          }
        }

        if (stringIsNumber(token.value)) {
          return {
            sexp: S.Float(Number(token.value), tokenMetaToSexpMeta(token.meta)),
            remain: tokens.slice(1),
          }
        }

        let message = `I expect value to be a bigint or number: ${token.value}\n`
        throw new Error(message)
      }

      case "String": {
        return {
          sexp: S.String(token.value, tokenMetaToSexpMeta(token.meta)),
          remain: tokens.slice(1),
        }
      }

      case "BracketStart": {
        if (token.value === "[") {
          const { sexp, remain } = this.handleTokensInBracket(
            token,
            tokens.slice(1),
          )
          return { sexp: S.Cons(S.Symbol("@tael"), sexp), remain }
        }

        if (token.value === "{") {
          const { sexp, remain } = this.handleTokensInBracket(
            token,
            tokens.slice(1),
          )
          return { sexp: S.Cons(S.Symbol("@set"), sexp), remain }
        }

        return this.handleTokensInBracket(token, tokens.slice(1))
      }

      case "BracketEnd": {
        let message = `I found extra BracketEnd\n`
        throw new ErrorWithMeta(message, token.meta)
      }

      case "QuotationMark": {
        const { sexp, remain } = this.handleTokens(tokens.slice(1))

        const quoteTable: Record<string, string> = {
          "'": "@quote",
          ",": "@unquote",
          "`": "@quasiquote",
        }

        const quoteSymbol = S.Symbol(
          quoteTable[token.value],
          tokenMetaToSexpMeta(token.meta),
        )

        return {
          sexp: S.List([quoteSymbol, sexp], tokenMetaToSexpMeta(token.meta)),
          remain,
        }
      }

      case "Hashtag": {
        return {
          sexp: S.Hashtag(token.value, tokenMetaToSexpMeta(token.meta)),
          remain: tokens.slice(1),
        }
      }

      case "Keyword": {
        let message = `I found keyword at wrong place\n`
        throw new ErrorWithMeta(message, token.meta)
      }
    }
  }

  private handleTokensInBracket(start: Token, tokens: Array<Token>): Result {
    const array: Array<S.Sexp> = []
    const attributes: S.Attributes = {}

    while (true) {
      if (tokens[0] === undefined) {
        let message = `I found missing BracketEnd\n`
        throw new ErrorWithMeta(message, start.meta)
      }

      const token = tokens[0]

      if (token.kind === "BracketEnd") {
        if (!lexerMatchBrackets(start.value, token.value)) {
          let message = `I expect a matching BracketEnd\n`
          throw new ErrorWithMeta(message, token.meta)
        }

        return {
          sexp: S.Tael(
            array,
            attributes,
            tokenMetaToSexpMeta({
              ...token.meta,
              span: spanUnion(start.meta.span, token.meta.span),
            }),
          ),
          remain: tokens.slice(1),
        }
      }

      if (token.kind === "Keyword") {
        const head = this.handleTokens(tokens.slice(1))
        attributes[token.value] = head.sexp
        tokens = head.remain
        continue
      }

      const head = this.handleTokens(tokens)
      array.push(head.sexp)
      tokens = head.remain
    }
  }
}
