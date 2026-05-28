import * as S from "../index.ts"

export class CommentConsumer implements S.Consumer {
  kind = undefined

  canConsume(lexer: S.Lexer): boolean {
    return lexer.remain().startsWith(";")
  }

  consume(lexer: S.Lexer): string {
    let value = lexer.char()
    lexer.forward(1)
    while (!lexer.isEnd() && lexer.char() !== "\n") {
      value += lexer.char()
      lexer.forward(1)
    }

    return value
  }
}
