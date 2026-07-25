import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function desugarBegin(
  sequence: Array<M.Exp>,
  location: S.SourceLocation,
): M.Exp {
  if (sequence.length === 0) {
    let message = `[desugarBegin] (begin) must not be empty`
    throw new S.ErrorWithSourceLocation(message, location)
  }

  const [head, ...rest] = sequence

  if (head.kind === "LocalDefineExp") {
    const defines = collectAdjacentLocalDefines(sequence)
    const remaining = sequence.slice(defines.length)

    const bindings = defines.map((d) =>
      M.Binding(
        d.name,
        d.parameters.length > 0
          ? M.LambdaExp(d.parameters, d.body, d.location)
          : d.body,
        d.location,
      ),
    )

    return M.LetrecStarExp(
      bindings,
      remaining.length === 0
        ? M.QualifiedVarExp("meta-builtin", "builtin", "void", location)
        : desugarBegin(remaining, location),
      location,
    )
  }

  if (rest.length === 0) {
    return head
  }

  return M.Begin1Exp(head, desugarBegin(rest, location), location)
}

function collectAdjacentLocalDefines(
  sequence: Array<M.Exp>,
): Array<M.LocalDefineExp> {
  const localDefines: Array<M.LocalDefineExp> = []
  for (const exp of sequence) {
    if (exp.kind === "LocalDefineExp") {
      localDefines.push(exp)
    } else {
      break
    }
  }

  return localDefines
}
