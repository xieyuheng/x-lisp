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

  if (options.dump) M.projectDumpFragments(project, "020-desugar")
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
    case "DefineFunction": {
      return {
        ...stmt,
        body: desugar(createDesugarState(), stmt.body),
      }
    }

    case "DefineVariable": {
      return {
        ...stmt,
        body: desugar(createDesugarState(), stmt.body),
      }
    }

    case "DefineTest": {
      return {
        ...stmt,
        body: desugar(createDesugarState(), stmt.body),
      }
    }

    case "DefineType": {
      return {
        ...stmt,
        body: desugar(createDesugarState(), stmt.body),
      }
    }

    case "Claim": {
      return {
        ...stmt,
        type: desugar(createDesugarState(), stmt.type),
      }
    }

    case "Admit": {
      return {
        ...stmt,
        type: desugar(createDesugarState(), stmt.type),
      }
    }

    case "DefineAlgebraicType": {
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
    case "Begin": {
      return desugar(state, desugarBegin(exp.sequence, exp.location))
    }

    case "Assign": {
      let message = `[desugar] (=) must occur in the head of (begin)`
      message += `\n  exp: ${M.formatExp(exp)}`
      if (exp.location)
        throw new S.ErrorWithSourceLocation(message, exp.location)
      else throw new Error(message)
    }

    case "LocalDefine": {
      let message = `[desugar] local (define) must occur in the body of (begin)`
      message += `\n  exp: ${M.formatExp(exp)}`
      if (exp.location)
        throw new S.ErrorWithSourceLocation(message, exp.location)
      else throw new Error(message)
    }

    case "When": {
      return M.If(
        desugar(state, exp.condition),
        M.Begin1(
          desugar(state, exp.consequent),
          M.QualifiedVar("builtin", "void", exp.location),
          exp.location,
        ),
        M.QualifiedVar("builtin", "void", exp.location),
        exp.location,
      )
    }

    case "Unless": {
      return M.If(
        desugar(state, exp.condition),
        M.QualifiedVar("builtin", "void", exp.location),
        M.Begin1(
          desugar(state, exp.alternative),
          M.QualifiedVar("builtin", "void", exp.location),
          exp.location,
        ),
        exp.location,
      )
    }

    case "And": {
      return desugar(state, desugarAnd(exp.exps, exp.location))
    }

    case "Or": {
      return desugar(state, desugarOr(exp.exps, exp.location))
    }

    case "Cond": {
      return desugar(state, desugarCond(exp.clauses, exp.location))
    }

    case "LiteralList": {
      return desugar(state, desugarList(exp.elements, exp.location))
    }

    case "LiteralSet": {
      return desugar(state, desugarSet(exp.elements, exp.location))
    }

    case "LiteralHash": {
      return desugar(state, desugarHash(exp.entries, exp.location))
    }

    case "Quote": {
      return desugar(state, desugarQuote(exp.sexp, exp.location))
    }

    case "Pipe": {
      return desugar(state, desugarPipe(exp.target, exp.steps, exp.location))
    }

    case "Chain": {
      return desugar(state, desugarChain(exp.steps, exp.location))
    }

    case "Compose": {
      return desugar(state, desugarCompose(exp.steps, exp.location))
    }

    case "Begin1": {
      return M.Begin1(
        desugar(state, exp.head),
        desugar(state, exp.body),
        exp.location,
      )
    }

    case "LetStar": {
      return desugar(
        state,
        desugarLetStar(exp.bindings, exp.body, exp.location),
      )
    }

    case "Letrec": {
      return desugar(state, desugarLetrec(exp.bindings, exp.body, exp.location))
    }

    case "LetrecStar": {
      return desugar(
        state,
        desugarLetrecStar(exp.bindings, exp.body, exp.location),
      )
    }

    case "Let": {
      return desugar(
        state,
        desugarLet(state, exp.bindings, exp.body, exp.location),
      )
    }

    case "Lambda": {
      return M.Lambda(exp.parameters, desugar(state, exp.body), exp.location)
    }

    case "Polymorphic": {
      return M.Polymorphic(
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
    return M.Let1(binding.name, binding.rhs, body, location)
  }

  const [binding, ...restBindings] = bindings
  return M.Let1(
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
    const boxGetExp = M.Apply(
      M.QualifiedVar("builtin", "box-get", loc),
      [M.Var(b.name, loc)],
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
      M.Apply(M.QualifiedVar("builtin", "make-box", loc), [], loc),
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
    result = M.Begin1(
      M.Apply(
        M.QualifiedVar("builtin", "box-put!", loc),
        [M.Var(freshNames[i], loc), M.Var(bindings[i].name, loc)],
        loc,
      ),
      result,
      loc,
    )
  }

  result = M.Let(innerBindings, result, location)
  return M.Let(letBindings, result, location)
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
    const carExp = M.Apply(
      M.QualifiedVar("builtin", "box-get", loc),
      [M.Var(b.name, loc)],
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
      M.Apply(M.QualifiedVar("builtin", "make-box", loc), [], loc),
      loc,
    )
  })

  let result: M.Exp = newBody
  for (let i = bindings.length - 1; i >= 0; i--) {
    const loc = bindings[i].location ?? location
    result = M.Begin1(
      M.Apply(
        M.QualifiedVar("builtin", "box-put!", loc),
        [newRHSes[i], M.Var(bindings[i].name, loc)],
        loc,
      ),
      result,
      loc,
    )
  }

  return M.Let(letBindings, result, location)
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
    return M.Let1(binding.name, binding.rhs, body, location)
  }

  const tmpBindings: Array<M.Binding> = []
  const newBindings: Array<M.Binding> = []
  for (const binding of bindings) {
    const tmpName = generateFreshName(state, binding.name)
    tmpBindings.push(M.Binding(tmpName, binding.rhs, binding.location))
    newBindings.push(
      M.Binding(
        binding.name,
        M.Var(tmpName, binding.location),
        binding.location,
      ),
    )
  }

  return M.LetStar([...tmpBindings, ...newBindings], body, location)
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

  if (head.kind === "LocalDefine") {
    const defines = collectAdjacentDefines(sequence)
    const remaining = sequence.slice(defines.length)

    const bindings = defines.map((d) =>
      M.Binding(
        d.name,
        d.parameters.length > 0
          ? M.Lambda(d.parameters, d.body, d.location)
          : d.body,
        d.location,
      ),
    )

    return M.LetrecStar(
      bindings,
      remaining.length === 0
        ? M.QualifiedVar("builtin", "void", location)
        : desugarBegin(remaining, location),
      location,
    )
  }

  if (rest.length === 0) {
    return head
  }

  if (head.kind === "Assign") {
    return M.Let1(head.name, head.rhs, desugarBegin(rest, location), location)
  } else {
    return M.Begin1(head, desugarBegin(rest, location), location)
  }
}

function collectAdjacentDefines(sequence: Array<M.Exp>): Array<M.LocalDefine> {
  let i = 0
  while (i < sequence.length && sequence[i].kind === "LocalDefine") {
    i++
  }
  return sequence.slice(0, i) as Array<M.LocalDefine>
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
    result = M.Apply(step, [result], location)
  }

  return result
}

function desugarChain(steps: Array<M.Exp>, location: S.SourceLocation): M.Exp {
  const usedNames = setUnionMany(steps.map((s) => M.expFreeNames(new Set(), s)))
  const targetName = M.generateRelativeFreshName("target", usedNames)
  const target = M.Var(targetName, location)
  return M.Lambda([targetName], M.Pipe(target, steps, location), location)
}

function desugarCompose(
  steps: Array<M.Exp>,
  location: S.SourceLocation,
): M.Exp {
  return desugarChain(steps.toReversed(), location)
}

function desugarAnd(exps: Array<M.Exp>, location: S.SourceLocation): M.Exp {
  if (exps.length === 0) return M.QualifiedVar("builtin", "true", location)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return M.If(
    head,
    desugarAnd(restExps, location),
    M.QualifiedVar("builtin", "false", location),
    location,
  )
}

function desugarOr(exps: Array<M.Exp>, location: S.SourceLocation): M.Exp {
  if (exps.length === 0) return M.QualifiedVar("builtin", "false", location)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return M.If(
    head,
    M.QualifiedVar("builtin", "true", location),
    desugarOr(restExps, location),
    location,
  )
}

function desugarCond(
  clauses: Array<M.CondClause>,
  location: S.SourceLocation,
): M.Exp {
  if (clauses.length === 0)
    return M.Apply(
      M.QualifiedVar("builtin", "error", location),
      [M.String("cond mismatch", location)],
      location,
    )
  const [headClause, ...resClauses] = clauses
  return M.If(
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
      M.Assign(
        "list",
        M.Apply(M.QualifiedVar("builtin", "make-list", location), [], location),
        location,
      ),
      ...elements.map((e) =>
        M.Apply(
          M.QualifiedVar("builtin", "list-push!", location),
          [e, M.Var("list", location)],
          location,
        ),
      ),
      M.Var("list", location),
    ],
    location,
  )
}

function desugarSet(elements: Array<M.Exp>, location: S.SourceLocation): M.Exp {
  return M.desugarBegin(
    [
      M.Assign(
        "set",
        M.Apply(M.QualifiedVar("builtin", "make-set", location), [], location),
        location,
      ),
      ...elements.map((e) =>
        M.Apply(
          M.QualifiedVar("builtin", "set-add!", location),
          [e, M.Var("set", location)],
          location,
        ),
      ),
      M.Var("set", location),
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
      M.Assign(
        "hash",
        M.Apply(M.QualifiedVar("builtin", "make-hash", location), [], location),
        location,
      ),
      ...entries.map((entry) =>
        M.Apply(
          M.QualifiedVar("builtin", "hash-put!", location),
          [entry.key, entry.value, M.Var("hash", location)],
          location,
        ),
      ),
      M.Var("hash", location),
    ],
    location,
  )
}

function desugarQuote(sexp: S.Sexp, location: S.SourceLocation): M.Exp {
  switch (sexp.kind) {
    case "Symbol": {
      return M.Symbol(sexp.content, location)
    }

    case "String": {
      return M.String(sexp.content, location)
    }

    case "Int": {
      return M.Int(sexp.content, location)
    }

    case "Float": {
      return M.Float(sexp.content, location)
    }

    case "Keyword": {
      return M.Keyword(sexp.content, location)
    }

    case "List": {
      return M.LiteralList(
        sexp.elements.map((e) => desugarQuote(e, location)),
        location,
      )
    }
  }
}
