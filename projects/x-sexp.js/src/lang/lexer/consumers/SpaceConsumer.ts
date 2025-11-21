import { stringIsBlank } from "../../../helpers/string/stringIsBlank.ts"
import type { Consumer } from "../Consumer.ts"
import type { Lexer } from "../Lexer.ts"

export class SpaceConsumer implements Consumer {
  kind = undefined

  canConsume(lexer: Lexer): boolean {
    return stringIsBlank(lexer.char())
  }

  consume(lexer: Lexer): string {
    let value = lexer.char()
    lexer.forward(1)
    while (!lexer.isEnd() && lexer.char().trim() === "") {
      value += lexer.char()
      lexer.forward(1)
    }

    return value
  }
}
