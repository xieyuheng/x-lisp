import { jsonParseString } from "../../../helpers/json/jsonParse.ts"
import { ErrorWithMeta } from "../../errors/ErrorWithMeta.ts"
import { positionForwardChar } from "../../span/Position.ts"
import type { Consumer } from "../Consumer.ts"
import type { Lexer } from "../Lexer.ts"

export class StringConsumer implements Consumer {
  kind = "DoubleQoutedString" as const

  canConsume(lexer: Lexer): boolean {
    return lexer.char() === '"'
  }

  consume(lexer: Lexer): string {
    return consumeDoubleQoutedString(lexer)
  }
}

export function consumeDoubleQoutedString(lexer: Lexer): string {
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
  throw new ErrorWithMeta(message, {
    span: { start, end },
    text: lexer.text,
    url: lexer.url,
  })
}
