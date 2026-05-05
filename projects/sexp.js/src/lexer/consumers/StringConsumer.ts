import { jsonParseString } from "@xieyuheng/helpers.js/json"
import { ErrorWithSourceLocation } from "../../errors/ErrorWithSourceLocation.ts"
import { positionForwardChar } from "../../span/Position.ts"
import * as S from "../index.ts"

export class StringConsumer implements S.Consumer {
  kind = "String" as const

  canConsume(lexer: S.Lexer): boolean {
    return lexer.char() === '"'
  }

  consume(lexer: S.Lexer): string {
    const line = lexer.line()
    let index = 2 // over first `"` and the folloing char.
    while (index <= line.length) {
      const head = line.slice(0, index)
      const value = jsonParseString(head)
      if (value === undefined) {
        index++
      } else {
        lexer.forward(index)
        return value
      }
    }

    const start = lexer.position
    const end = positionForwardChar(start, '"')
    let message = `Fail to parse double qouted string: ${line}\n`
    throw new ErrorWithSourceLocation(message, {
      span: { start, end },
      path: lexer.path,
    })
  }
}
