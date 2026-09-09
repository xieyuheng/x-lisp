import * as S from "../index.ts"
import { charIsBlank } from "../lexerHelpers.ts"

export class SpaceConsumer implements S.Consumer {
  kind = undefined

  canConsume(lexer: S.Lexer): boolean {
    return charIsBlank(lexer.char())
  }

  consume(lexer: S.Lexer): string {
    const start = lexer.cursor
    while (!lexer.isEnd() && charIsBlank(lexer.char())) {
      lexer.forward(1)
    }

    return lexer.text.slice(start, lexer.cursor)
  }
}
