import * as Ppml from "@xieyuheng/ppml.js"
import { type Exp } from "../exp/index.ts"

export function prettyExp(exp: Exp): Ppml.Node {
  switch (exp.kind) {
    case "KeywordExp": {
      return Ppml.text(`:${exp.content}`)
    }

    case "SymbolExp": {
      return Ppml.text(`'${exp.content}`)
    }

    case "StringExp": {
      return Ppml.text(JSON.stringify(exp.content))
    }

    case "IntExp": {
      return Ppml.text(exp.content.toString())
    }

    case "FloatExp": {
      if (Number.isInteger(exp.content)) {
        return Ppml.text(`${exp.content.toString()}.0`)
      } else {
        return Ppml.text(exp.content.toString())
      }
    }

    case "VarExp": {
      return Ppml.text(exp.name)
    }

    case "ApplyExp": {
      const target = prettyExp(exp.target)
      const args = exp.args.map(prettyExp)
      return Ppml.prettyApplication([target, ...args])
    }
  }
}
