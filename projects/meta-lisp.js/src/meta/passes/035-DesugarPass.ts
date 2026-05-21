import { setUnionMany } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function DesugarPass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const fragment of project.fragments.values()) {
    fragment.stmts = fragment.stmts.map(desugarStmt)
  }

  if (options.dump) M.projectDumpFragments(project, "035-desugar")
}

type State = {
  nameCounts: Map<string, number>
}

export function createDesugarState(): State {
  return {
    nameCounts: new Map(),
  }
}

function desugarStmt(stmt: M.Stmt): M.Stmt {
  switch (stmt.kind) {
    case "DefineFunctionStmt": {
      return {
        ...stmt,
        body: desugar(createDesugarState(), stmt.body),
      }
    }

    case "DefineVariableStmt": {
      return {
        ...stmt,
        body: desugar(createDesugarState(), stmt.body),
      }
    }

    case "DefineTestStmt": {
      return {
        ...stmt,
        body: desugar(createDesugarState(), stmt.body),
      }
    }

    case "DefineTypeStmt": {
      return {
        ...stmt,
        body: desugar(createDesugarState(), stmt.body),
      }
    }

    case "ClaimStmt": {
      return {
        ...stmt,
        type: desugar(createDesugarState(), stmt.type),
      }
    }

    case "AdmitStmt": {
      return {
        ...stmt,
        type: desugar(createDesugarState(), stmt.type),
      }
    }

    case "DefineAlgebraicTypeStmt": {
      return {
        ...stmt,
        dataConstructors: stmt.dataConstructors.map((ctor) => ({
          ...ctor,
          fields: ctor.fields.map((field) => ({
            ...field,
            type: desugar(createDesugarState(), field.type),
          })),
        })),
      }
    }

    default: {
      return stmt
    }
  }
}

export function desugar(state: State, exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "BeginExp": {
      return desugar(state, desugarBegin(exp.sequence, exp.location))
    }

    case "AssignExp": {
      let message = `[desugar] (=) must occur in the head of (begin)`
      message += `\n  exp: ${M.formatExp(exp)}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }

    case "LocalDefineExp": {
      let message = `[desugar] local (define) must occur in the body of (begin)`
      message += `\n  exp: ${M.formatExp(exp)}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }

    case "WhenExp": {
      return M.IfExp(
        desugar(state, exp.condition),
        M.Begin1Exp(
          desugar(state, exp.consequent),
          M.QualifiedVarExp("builtin", "void", exp.location),
          exp.location,
        ),
        M.QualifiedVarExp("builtin", "void", exp.location),
        exp.location,
      )
    }

    case "UnlessExp": {
      return M.IfExp(
        desugar(state, exp.condition),
        M.QualifiedVarExp("builtin", "void", exp.location),
        M.Begin1Exp(
          desugar(state, exp.alternative),
          M.QualifiedVarExp("builtin", "void", exp.location),
          exp.location,
        ),
        exp.location,
      )
    }

    case "AndExp": {
      return desugar(state, desugarAnd(exp.exps, exp.location))
    }

    case "OrExp": {
      return desugar(state, desugarOr(exp.exps, exp.location))
    }

    case "CondExp": {
      return desugar(state, desugarCond(exp.clauses, exp.location))
    }

    case "ListExp": {
      return desugar(state, desugarList(exp.elements, exp.location))
    }

    case "SetExp": {
      return desugar(state, desugarSet(exp.elements, exp.location))
    }

    case "HashExp": {
      return desugar(state, desugarHash(exp.entries, exp.location))
    }

    case "QuoteExp": {
      return desugar(state, desugarQuote(exp.sexp, exp.location))
    }

    case "PipeExp": {
      return desugar(state, desugarPipe(exp.target, exp.steps, exp.location))
    }

    case "ChainExp": {
      return desugar(state, desugarChain(exp.steps, exp.location))
    }

    case "ComposeExp": {
      return desugar(state, desugarCompose(exp.steps, exp.location))
    }

    case "Begin1Exp": {
      return M.Begin1Exp(
        desugar(state, exp.head),
        desugar(state, exp.body),
        exp.location,
      )
    }

    case "LetStarExp": {
      return desugar(
        state,
        desugarLetStar(exp.bindings, exp.body, exp.location),
      )
    }

    case "LetrecExp": {
      return desugar(state, desugarLetrec(exp.bindings, exp.body, exp.location))
    }

    case "LetrecStarExp": {
      return desugar(
        state,
        desugarLetrecStar(exp.bindings, exp.body, exp.location),
      )
    }

    case "LetExp": {
      return desugar(
        state,
        desugarLet(state, exp.bindings, exp.body, exp.location),
      )
    }

    case "LambdaExp": {
      return M.LambdaExp(exp.parameters, desugar(state, exp.body), exp.location)
    }

    case "PolymorphicExp": {
      return M.PolymorphicExp(
        exp.parameters,
        desugar(state, exp.body),
        exp.location,
      )
    }

    default: {
      return M.expTraverse((child) => desugar(state, child), exp)
    }
  }
}

function desugarLetStar(
  bindings: Array<M.Binding>,
  body: M.Exp,
  location: S.SourceLocation,
): M.Exp {
  if (bindings.length === 0) return body
  if (bindings.length === 1) {
    const [binding] = bindings
    return M.Let1Exp(binding.name, binding.rhs, body, location)
  }

  const [binding, ...restBindings] = bindings
  return M.Let1Exp(
    binding.name,
    binding.rhs,
    desugarLetStar(restBindings, body, location),
    location,
  )
}

// Desugar `(letrec)` using box:
//
//     (letrec ((x1 e1)
//              (x2 e2)
//              ...
//              (xn en))
//       body)
//
// where e1, e2, en, and body have their
// x1, x2, xn replaced with (box-get x1), (box-get x2), (box-get xn)
//
//     (let ((x1 (make-box))
//           (x2 (make-box))
//           ...
//           (xn (make-box)))
//       (let ((v1 e1)
//             (v2 e2)
//             ...
//             (vn en))
//         (box-put! x1 v1)
//         (box-put! x2 v2)
//         ...
//         (box-put! xn vn)
//         body))

function desugarLetrec(
  bindings: Array<M.Binding>,
  body: M.Exp,
  location: S.SourceLocation,
): M.Exp {
  const usedNames = M.expFreeNames(new Set(bindings.map((b) => b.name)), body)
  for (const binding of bindings) {
    const rhsFreeNames = M.expFreeNames(
      new Set(bindings.map((b) => b.name)),
      binding.rhs,
    )
    for (const name of rhsFreeNames) {
      usedNames.add(name)
    }
  }

  let newRHSes = bindings.map((b) => b.rhs)
  let newBody = body

  // Using expNaiveSubst is safe here: we replace b.name with
  // (builtin.box-get b.name), whose only free variable is b.name itself.
  // When a binding inside the RHS or body shadows b.name, that occurrence
  // was never a recursive reference — stopping at the shadow is correct.
  for (const b of bindings) {
    const loc = b.location ?? location
    const boxGetExp = M.ApplyExp(
      M.QualifiedVarExp("builtin", "box-get", loc),
      [M.VarExp(b.name, loc)],
      loc,
    )
    for (let i = 0; i < newRHSes.length; i++) {
      newRHSes[i] = M.expNaiveSubst(newRHSes[i], b.name, boxGetExp)
    }
    newBody = M.expNaiveSubst(newBody, b.name, boxGetExp)
  }

  const letBindings = bindings.map((b) => {
    const loc = b.location ?? location
    return M.Binding(
      b.name,
      M.ApplyExp(M.QualifiedVarExp("builtin", "make-box", loc), [], loc),
      loc,
    )
  })

  const freshNames = bindings.map((b) =>
    M.generateRelativeFreshName(`${b.name}.value`, usedNames),
  )

  const innerBindings = bindings.map((b, i) =>
    M.Binding(freshNames[i], newRHSes[i], b.location ?? location),
  )

  let result: M.Exp = newBody
  for (let i = bindings.length - 1; i >= 0; i--) {
    const loc = bindings[i].location ?? location
    result = M.Begin1Exp(
      M.ApplyExp(
        M.QualifiedVarExp("builtin", "box-put!", loc),
        [M.VarExp(freshNames[i], loc), M.VarExp(bindings[i].name, loc)],
        loc,
      ),
      result,
      loc,
    )
  }

  result = M.LetExp(innerBindings, result, location)
  return M.LetExp(letBindings, result, location)
}

// Desugar `(letrec*)` using box:
//
//     (letrec* ((x1 e1)
//               (x2 e2)
//               ...
//               (xn en))
//       body)
//
// where e1, e2, en, and body have their
// x1, x2, xn replaced with (box-get x1), (box-get x2), (box-get xn)
//
//     (let ((x1 (make-box))
//           (x2 (make-box))
//           ...
//           (xn (make-box)))
//       (box-put! e1 x1)
//       (box-put! e2 x2)
//       ...
//       (box-put! en xn)
//       body)

function desugarLetrecStar(
  bindings: Array<M.Binding>,
  body: M.Exp,
  location: S.SourceLocation,
): M.Exp {
  const newRHSes = bindings.map((b) => b.rhs)
  let newBody = body

  // Same reasoning as desugarLetrec — expNaiveSubst is safe here:
  // carExp only refers to b.name, and any inner shadowing means
  // that occurrence was never a recursive reference.
  for (const b of bindings) {
    const loc = b.location ?? location
    const carExp = M.ApplyExp(
      M.QualifiedVarExp("builtin", "box-get", loc),
      [M.VarExp(b.name, loc)],
      loc,
    )
    for (let i = 0; i < newRHSes.length; i++) {
      newRHSes[i] = M.expNaiveSubst(newRHSes[i], b.name, carExp)
    }
    newBody = M.expNaiveSubst(newBody, b.name, carExp)
  }

  const letBindings = bindings.map((b) => {
    const loc = b.location ?? location
    return M.Binding(
      b.name,
      M.ApplyExp(M.QualifiedVarExp("builtin", "make-box", loc), [], loc),
      loc,
    )
  })

  let result: M.Exp = newBody
  for (let i = bindings.length - 1; i >= 0; i--) {
    const loc = bindings[i].location ?? location
    result = M.Begin1Exp(
      M.ApplyExp(
        M.QualifiedVarExp("builtin", "box-put!", loc),
        [newRHSes[i], M.VarExp(bindings[i].name, loc)],
        loc,
      ),
      result,
      loc,
    )
  }

  return M.LetExp(letBindings, result, location)
}

function generateFreshName(state: State, name: string): string {
  const count = state.nameCounts.get(name)
  if (count) {
    state.nameCounts.set(name, count + 1)
    return `${name}.${count + 1}`
  } else {
    state.nameCounts.set(name, 1)
    return `${name}.${1}`
  }
}

function desugarLet(
  state: State,
  bindings: Array<M.Binding>,
  body: M.Exp,
  location: S.SourceLocation,
): M.Exp {
  if (bindings.length === 0) return body
  if (bindings.length === 1) {
    const [binding] = bindings
    return M.Let1Exp(binding.name, binding.rhs, body, location)
  }

  const tmpBindings: Array<M.Binding> = []
  const newBindings: Array<M.Binding> = []
  for (const binding of bindings) {
    const tmpName = generateFreshName(state, binding.name)
    tmpBindings.push(M.Binding(tmpName, binding.rhs, binding.location))
    newBindings.push(
      M.Binding(
        binding.name,
        M.VarExp(tmpName, binding.location),
        binding.location,
      ),
    )
  }

  return M.LetStarExp([...tmpBindings, ...newBindings], body, location)
}

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
    const defines = collectAdjacentDefines(sequence)
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
        ? M.QualifiedVarExp("builtin", "void", location)
        : desugarBegin(remaining, location),
      location,
    )
  }

  if (rest.length === 0) {
    return head
  }

  if (head.kind === "AssignExp") {
    return M.Let1Exp(
      head.name,
      head.rhs,
      desugarBegin(rest, location),
      location,
    )
  } else {
    return M.Begin1Exp(head, desugarBegin(rest, location), location)
  }
}

function collectAdjacentDefines(
  sequence: Array<M.Exp>,
): Array<M.LocalDefineExp> {
  let i = 0
  while (i < sequence.length && sequence[i].kind === "LocalDefineExp") {
    i++
  }
  return sequence.slice(0, i) as Array<M.LocalDefineExp>
}

function desugarPipe(
  target: M.Exp,
  steps: Array<M.Exp>,
  location: S.SourceLocation,
): M.Exp {
  let result = target
  for (const step of steps) {
    const location =
      target.location && step.location
        ? S.sourceLocationUnion(target.location, step.location)
        : target.location === undefined
          ? step.location
          : target.location
    result = M.ApplyExp(step, [result], location)
  }

  return result
}

function desugarChain(steps: Array<M.Exp>, location: S.SourceLocation): M.Exp {
  const usedNames = setUnionMany(steps.map((s) => M.expFreeNames(new Set(), s)))
  const targetName = M.generateRelativeFreshName("target", usedNames)
  const target = M.VarExp(targetName, location)
  return M.LambdaExp([targetName], M.PipeExp(target, steps, location), location)
}

function desugarCompose(
  steps: Array<M.Exp>,
  location: S.SourceLocation,
): M.Exp {
  return desugarChain(steps.toReversed(), location)
}

function desugarAnd(exps: Array<M.Exp>, location: S.SourceLocation): M.Exp {
  if (exps.length === 0) return M.QualifiedVarExp("builtin", "true", location)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return M.IfExp(
    head,
    desugarAnd(restExps, location),
    M.QualifiedVarExp("builtin", "false", location),
    location,
  )
}

function desugarOr(exps: Array<M.Exp>, location: S.SourceLocation): M.Exp {
  if (exps.length === 0) return M.QualifiedVarExp("builtin", "false", location)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return M.IfExp(
    head,
    M.QualifiedVarExp("builtin", "true", location),
    desugarOr(restExps, location),
    location,
  )
}

function desugarCond(
  clauses: Array<M.CondClause>,
  location: S.SourceLocation,
): M.Exp {
  if (clauses.length === 0)
    return M.ApplyExp(
      M.QualifiedVarExp("builtin", "error", location),
      [M.StringExp("cond mismatch", location)],
      location,
    )
  const [headClause, ...resClauses] = clauses
  return M.IfExp(
    headClause.question,
    headClause.answer,
    desugarCond(resClauses, location),
    location,
  )
}

export function desugarList(
  elements: Array<M.Exp>,
  location: S.SourceLocation,
): M.Exp {
  return M.desugarBegin(
    [
      M.AssignExp(
        "list",
        M.ApplyExp(
          M.QualifiedVarExp("builtin", "make-list", location),
          [],
          location,
        ),
        location,
      ),
      ...elements.map((e) =>
        M.ApplyExp(
          M.QualifiedVarExp("builtin", "list-push!", location),
          [e, M.VarExp("list", location)],
          location,
        ),
      ),
      M.VarExp("list", location),
    ],
    location,
  )
}

function desugarSet(elements: Array<M.Exp>, location: S.SourceLocation): M.Exp {
  return M.desugarBegin(
    [
      M.AssignExp(
        "set",
        M.ApplyExp(
          M.QualifiedVarExp("builtin", "make-set", location),
          [],
          location,
        ),
        location,
      ),
      ...elements.map((e) =>
        M.ApplyExp(
          M.QualifiedVarExp("builtin", "set-add!", location),
          [e, M.VarExp("set", location)],
          location,
        ),
      ),
      M.VarExp("set", location),
    ],
    location,
  )
}

function desugarHash(
  entries: Array<{ key: M.Exp; value: M.Exp }>,
  location: S.SourceLocation,
): M.Exp {
  return M.desugarBegin(
    [
      M.AssignExp(
        "hash",
        M.ApplyExp(
          M.QualifiedVarExp("builtin", "make-hash", location),
          [],
          location,
        ),
        location,
      ),
      ...entries.map((entry) =>
        M.ApplyExp(
          M.QualifiedVarExp("builtin", "hash-put!", location),
          [entry.key, entry.value, M.VarExp("hash", location)],
          location,
        ),
      ),
      M.VarExp("hash", location),
    ],
    location,
  )
}

function desugarQuote(sexp: S.Sexp, location: S.SourceLocation): M.Exp {
  switch (sexp.kind) {
    case "SymbolSexp": {
      return M.SymbolExp(sexp.content, location)
    }

    case "StringSexp": {
      return M.StringExp(sexp.content, location)
    }

    case "IntSexp": {
      return M.IntExp(sexp.content, location)
    }

    case "FloatSexp": {
      return M.FloatExp(sexp.content, location)
    }

    case "KeywordSexp": {
      return M.KeywordExp(sexp.content, location)
    }

    case "ListSexp": {
      return M.ListExp(
        sexp.elements.map((e) => desugarQuote(e, location)),
        location,
      )
    }
  }
}
