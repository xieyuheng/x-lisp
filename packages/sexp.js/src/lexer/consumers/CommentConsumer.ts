import * as S from "../index.ts"

export class CommentConsumer implements S.Consumer {
  kind = undefined

  canConsume(lexer: S.Lexer): boolean {
    return lexer.char() === ";"
  }

  consume(lexer: S.Lexer): string {
    const start = lexer.position.index
    while (!lexer.isEnd() && lexer.char() !== "\n") {
      lexer.forward(1)
    }

    return lexer.text.slice(start, lexer.position.index)
  }
}
