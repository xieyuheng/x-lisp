import * as Ppml from "@xieyuheng/ppml.js"
import { type Exp } from "../exp/index.ts"
import { prettyApplication, prettyText } from "./layout.ts"

export function prettyExp(exp: Exp): Ppml.Node {
  switch (exp.kind) {
    case "KeywordExp": {
      return prettyText(`:${exp.content}`)
    }

    case "SymbolExp": {
      return prettyText(`'${exp.content}`)
    }

    case "StringExp": {
      return prettyText(JSON.stringify(exp.content))
    }

    case "IntExp": {
      return prettyText(exp.content.toString())
    }

    case "FloatExp": {
      if (Number.isInteger(exp.content)) {
        return prettyText(`${exp.content.toString()}.0`)
      } else {
        return prettyText(exp.content.toString())
      }
    }

    case "VarExp": {
      return prettyText(exp.name)
    }

    case "ApplyExp": {
      const target = prettyExp(exp.target)
      const args = exp.args.map(prettyExp)
      return prettyApplication([target, ...args])
    }
  }
}
