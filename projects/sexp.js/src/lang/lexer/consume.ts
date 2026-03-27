import { type Token } from "../token/index.ts"
import { useConsumers } from "./consumers/useConsumers.ts"
import { Lexer } from "./Lexer.ts"

export function consume(lexer: Lexer): Token | undefined {
  for (const consumer of useConsumers()) {
    if (consumer.canConsume(lexer)) {
      const start = lexer.position
      const value = consumer.consume(lexer)
      if (consumer.kind === undefined) {
        return undefined
      }

      const end = lexer.position
      return {
        kind: consumer.kind,
        value,
        location: {
          span: { start, end },
          text: lexer.text,
          path: lexer.path,
        },
      }
    }
  }

  let message = `Can not consume char: ${lexer.char()}\n`
  throw new Error(message)
}
