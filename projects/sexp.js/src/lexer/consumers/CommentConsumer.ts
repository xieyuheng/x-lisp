import type { Consumer } from "../Consumer.ts"
import type { Lexer } from "../Lexer.ts"

export class CommentConsumer implements Consumer {
  kind = undefined

  canConsume(lexer: Lexer): boolean {
    return lexer.remain().startsWith(";")
  }

  consume(lexer: Lexer): string {
    let value = lexer.char()
    lexer.forward(1)
    while (!lexer.isEnd() && lexer.char() !== "\n") {
      value += lexer.char()
      lexer.forward(1)
    }

    return value
  }
}
