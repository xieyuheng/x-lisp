import { formatAtom } from "../../lisp/format/formatAtom.ts"
import type { Atom, Exp } from "../exp/index.ts"
import * as  Exps from "../exp/index.ts"
import * as Ppml from "@xieyuheng/ppml.js"

export function prettyExp(maxWidth: number, exp: Exp): string {
  return Ppml.format(maxWidth, renderExp(exp))
}

function renderExp(exp: Exp): Ppml.Node {
  if (Exps.isAtom(exp)) {
    return Ppml.text(formatAtom(exp))
  }

  switch (exp.kind) {
    case "Sequence": {
      return Ppml.nil()
    }

    case "Ref": {
      return Ppml.nil()
    }

    case "Call": {
      return Ppml.nil()
    }

    case "TailCall": {
      return Ppml.nil()
    }

    case "Bindings": {
      return Ppml.nil()
    }

    case "If": {
      return Ppml.nil()
    }

    case "Return": {
      return Ppml.nil()
    }

    case "Assert": {
      return Ppml.nil()
    }

    case "AssertEqual": {
      return Ppml.nil()
    }

    case "AssertNotEqual": {
      return Ppml.nil()
    }

    case "Drop": {
      return Ppml.nil()
    }

    case "Apply": {
      return Ppml.nil()
    }

    case "TailApply": {
      return Ppml.nil()
    }

    case "Assign": {
      return Ppml.nil()
    }

  }
}
