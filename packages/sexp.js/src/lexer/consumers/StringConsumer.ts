import { jsonParseString } from "@xieyuheng/std.js/json"
import { ErrorWithSourceLocation } from "../../errors/ErrorWithSourceLocation.ts"
import { positionForwardChar } from "../../location/Position.ts"
import * as S from "../index.ts"

export class StringConsumer implements S.Consumer {
  kind = "String" as const

  canConsume(lexer: S.Lexer): boolean {
    return lexer.char() === '"'
  }

  consume(lexer: S.Lexer): string {
    const start = lexer.position
    const lineEnd = lexer.text.indexOf("\n", start.index)
    const line =
      lineEnd === -1
        ? lexer.text.slice(start.index)
        : lexer.text.slice(start.index, lineEnd)
    const contentStart = start.index + 1

    lexer.forward(1) // over the opening `"`

    while (!lexer.isEnd()) {
      const char = lexer.char()
      if (char === "\\") {
        lexer.forward(2)
      } else if (char === '"') {
        const raw = lexer.text.slice(contentStart, lexer.position.index)
        lexer.forward(1)
        const value = jsonParseString(`"${raw}"`)
        if (value !== undefined) return value
        break
      } else if (char === "\n") {
        break
      } else {
        lexer.forward(1)
      }
    }

    const end = positionForwardChar(start, '"')
    let message = `Fail to parse double qouted string: ${line}\n`
    throw new ErrorWithSourceLocation(message, {
      span: { start, end },
      path: lexer.path,
    })
  }
}
