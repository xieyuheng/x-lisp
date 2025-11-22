import type { Consumer } from "../Consumer.ts"
import { lexerBrackets, type Lexer } from "../index.ts"

export class BracketStartConsumer implements Consumer {
  kind = "BracketStart" as const

  canConsume(lexer: Lexer): boolean {
    const char = lexer.char()
    return lexerBrackets()
      .map(({ start }) => start)
      .includes(char)
  }

  consume(lexer: Lexer): string {
    const char = lexer.char()
    lexer.forward(1)
    return char
  }
}
