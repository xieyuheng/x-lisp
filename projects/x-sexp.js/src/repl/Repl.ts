import assert from "node:assert"
import process from "node:process"
import * as Readline from "node:readline"
import { errorReport } from "../helpers/error/errorReport.ts"
import * as S from "../lang/index.ts"

type ReplOptions = {
  welcome?: string
  prompt: string
  onSexps: (sexps: Array<S.Sexp>) => void
  onClose?: () => void
}

type Repl = ReplOptions & {
  parser: S.Parser
  text: string
  count: number
  rl?: Readline.Interface
}

export function createRepl(options: ReplOptions): Repl {
  return {
    ...options,
    parser: new S.Parser(),
    text: "",
    count: 0,
  }
}

function replPrompt(repl: Repl) {
  assert(repl.rl)
  const preserveCursor = true
  repl.rl.prompt(preserveCursor)
  repl.text = ""
}

export function replStart(repl: Repl): void {
  repl.rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  repl.rl.setPrompt(repl.prompt)

  if (repl.welcome) {
    console.log(repl.welcome)
  }

  replPrompt(repl)

  repl.rl.on("close", async () => {
    if (repl.onClose) {
      await repl.onClose()
    }
  })

  repl.rl.on("line", (line) => {
    replHandleLine(repl, line)
  })
}

function replHandleLine(repl: Repl, line: string) {
  assert(repl.rl)
  repl.text += line + "\n"
  const tokens = repl.parser.lexer.lex(repl.text)
  const balance = bracketBalance(tokens)
  switch (balance) {
    case "Ok": {
      return
    }

    case "Wrong": {
      let message = `[repl] Unbalanced brackets\n`
      message += "```\n"
      message += repl.text
      message += "\n"
      message += "```\n"
      process.stdout.write(message)
      replPrompt(repl)
    }

    case "Perfect": {
      try {
        const url = new URL(`repl:${++repl.count}`)
        const sexps = repl.parser.parse(repl.text, { url })
        repl.onSexps(sexps)
        replPrompt(repl)
      } catch (error) {
        let message = `[repl] error\n`
        message += errorReport(error)
        message += `\n`
        process.stdout.write(message)
        replPrompt(repl)
      }
    }
  }
}

export function replClose(repl: Repl): void {
  assert(repl.rl)
  repl.rl.close()
}

type Balance = "Ok" | "Wrong" | "Perfect"

function bracketBalance(tokens: Array<S.Token>): Balance {
  const bracketStack: Array<string> = []
  for (const token of tokens) {
    if (token.kind === "BracketStart") {
      bracketStack.push(token.value)
    }

    if (token.kind === "BracketEnd") {
      const start = bracketStack.pop()
      if (start === undefined) return "Wrong"
      if (!S.lexerMatchBrackets(start, token.value)) return "Wrong"
    }
  }

  if (bracketStack.length === 0) {
    return "Perfect"
  } else {
    return "Ok"
  }
}
