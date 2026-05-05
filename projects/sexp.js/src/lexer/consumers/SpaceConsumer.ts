import { stringIsBlank } from "@xieyuheng/helpers.js/string"
import * as S from "../index.ts"

export class SpaceConsumer implements S.Consumer {
  kind = undefined

  canConsume(lexer: S.Lexer): boolean {
    return stringIsBlank(lexer.char())
  }

  consume(lexer: S.Lexer): string {
    let value = lexer.char()
    lexer.forward(1)
    while (!lexer.isEnd() && lexer.char().trim() === "") {
      value += lexer.char()
      lexer.forward(1)
    }

    return value
  }
}
