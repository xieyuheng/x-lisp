import { range } from "@xieyuheng/helpers.js/range"
import { setUnionMany } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import Path from "node:path"
import * as M from "../index.ts"

export function DesugarPass(project: M.Project): void {
  for (const fragment of project.fragments.values()) {
    fragment.stmts = fragment.stmts.map(desugarStmt)
  }
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
      return desugar(
        state,
        desugarLetrec(exp.bindings, exp.body, exp.location),
      )
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
  location?: S.SourceLocation,
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

function desugarLetrec(
  bindings: Array<M.Binding>,
  body: M.Exp,
  location?: S.SourceLocation,
): M.Exp {
  const usedNames = M.expFreeNames(
    new Set(bindings.map((b) => b.name)),
    body,
  )
  for (const binding of bindings) {
    const rhsFreeNames = M.expFreeNames(
      new Set(bindings.map((b) => b.name)),
      binding.rhs,
    )
    for (const name of rhsFreeNames) {
      usedNames.add(name)
    }
  }

  const thunkBindings: Array<M.Binding> = []
  const callBindings: Array<M.Binding> = []

  for (const binding of bindings) {
    const thunkName = M.generateRelativeFreshName(
      `${binding.name}.thunk`,
      usedNames,
    )
    thunkBindings.push(
      M.Binding(
        thunkName,
        M.Lambda([], binding.rhs, binding.location),
        binding.location,
      ),
    )
    callBindings.push(
      M.Binding(
        binding.name,
        M.Apply(M.Var(thunkName, binding.location), [], binding.location),
        binding.location,
      ),
    )
  }

  return M.LetrecStar(
    [...thunkBindings, ...callBindings],
    body,
    location,
  )
}

function desugarLetrecStar(
  bindings: Array<M.Binding>,
  body: M.Exp,
  location?: S.SourceLocation,
): M.Exp {
  const newRHSes = bindings.map((b) => b.rhs)
  let newBody = body

  for (const b of bindings) {
    const loc = b.location ?? location
    const carExp = M.Apply(
      M.QualifiedVar("builtin", "car", loc),
      [M.Var(b.name, loc)],
      loc,
    )
    for (let i = 0; i < newRHSes.length; i++) {
      newRHSes[i] = M.expSubst(newRHSes[i], b.name, carExp)
    }
    newBody = M.expSubst(newBody, b.name, carExp)
  }

  const letBindings = bindings.map((b) => {
    const loc = b.location ?? location
    return M.Binding(
      b.name,
      M.Apply(M.QualifiedVar("builtin", "make-list", loc), [], loc),
      loc,
    )
  })

  let result: M.Exp = newBody
  for (let i = bindings.length - 1; i >= 0; i--) {
    const loc = bindings[i].location ?? location
    result = M.Begin1(
      M.Apply(
        M.QualifiedVar("builtin", "list-push!", loc),
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
  location?: S.SourceLocation,
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
  location?: S.SourceLocation,
): M.Exp {
  if (sequence.length === 0) {
    let message = `[desugarBegin] (begin) must not be empty`
    if (location) throw new S.ErrorWithSourceLocation(message, location)
    else throw new Error(message)
  }

  const [head, ...rest] = sequence
  if (rest.length === 0) {
    return head
  }

  if (head.kind === "Assign") {
    return M.Let1(head.name, head.rhs, desugarBegin(rest), location)
  } else {
    return M.Begin1(head, desugarBegin(rest), location)
  }
}

function desugarPipe(
  target: M.Exp,
  steps: Array<M.Exp>,
  location?: S.SourceLocation,
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

function desugarChain(steps: Array<M.Exp>, location?: S.SourceLocation): M.Exp {
  const usedNames = setUnionMany(steps.map((s) => M.expFreeNames(new Set(), s)))
  const targetName = M.generateRelativeFreshName("target", usedNames)
  const target = M.Var(targetName, location)
  return M.Lambda([targetName], M.Pipe(target, steps, location), location)
}

function desugarCompose(
  steps: Array<M.Exp>,
  location?: S.SourceLocation,
): M.Exp {
  return desugarChain(steps.toReversed(), location)
}

function desugarAnd(exps: Array<M.Exp>, location?: S.SourceLocation): M.Exp {
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

function desugarOr(exps: Array<M.Exp>, location?: S.SourceLocation): M.Exp {
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
  location?: S.SourceLocation,
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
  location?: S.SourceLocation,
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

function desugarSet(
  elements: Array<M.Exp>,
  location?: S.SourceLocation,
): M.Exp {
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
  location?: S.SourceLocation,
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

function desugarQuote(sexp: S.Sexp, location?: S.SourceLocation): M.Exp {
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

export function simplifyMatch(
  mod: M.Mod,
  targets: Array<M.Exp>,
  clauses: Array<M.MatchClause>,
  defaultExp: M.Exp,
  location?: S.SourceLocation,
): M.Exp {
  for (const clause of clauses) {
    if (clause.patterns.length !== targets.length) {
      let message = `[simplifyMatch] targets length mismatch`
      message += `\n  targets: ${M.formatExps(targets)}`
      message += `\n  patterns: ${M.formatExps(clause.patterns)}`
      throw new Error(message)
    }
  }

  if (clauses.length === 0) {
    return defaultExp
  }

  if (targets.length === 0) {
    const [clause] = clauses
    assert(clause.patterns.length === 0)
    return clause.body
  }

  if (clauses.every(clauseHeadIsVarPattern)) {
    const [target, ...restTargets] = targets
    return simplifyMatch(
      mod,
      restTargets,
      clauses.map((clause) => {
        const [pattern, ...restPatterns] = clause.patterns
        assert(pattern.kind === "Var")
        return M.MatchClause(
          restPatterns,
          M.Let1(pattern.name, target, clause.body, clause.location),
          clause.location,
        )
      }),
      defaultExp,
      location,
    )
  }

  if (clauses.every(clauseHeadIsDataPattern)) {
    const [target, ...restTargets] = targets

    const groups = groupClausesByHeadDataConstructor(mod, clauses)
    return M.Cond(
      groups.map((group) => {
        const usedNames = setUnionMany([
          ...targets.map((t) => M.expFreeNames(new Set(), t)),
          ...group.clauses.map((c) => M.expFreeNames(new Set(), c.body)),
        ])
        const freshVars = group.dataConstructor.fields.map((field) => {
          const freshName = M.generateRelativeFreshName(field.name, usedNames)
          usedNames.add(freshName)
          return M.Var(freshName, location)
        })

        const definition = group.dataConstructor.definition

        const path = Path.relative(Path.dirname(mod.name), definition.mod.name)

        const dataConstructorPredicateName = `${group.dataConstructor.name}?`
        const dataConstructorPredicate = M.modNameIsAsDefined(
          mod,
          dataConstructorPredicateName,
        )
          ? M.Var(dataConstructorPredicateName, location)
          : M.QualifiedVar(path, dataConstructorPredicateName, location)

        const question = M.Apply(dataConstructorPredicate, [target])

        let answer = simplifyMatch(
          mod,
          [...freshVars, ...restTargets],
          group.clauses,
          defaultExp,
          location,
        )

        for (const i of range(group.dataConstructor.fields.length)) {
          const field = group.dataConstructor.fields[i]

          const dataFieldAccessorName = `${group.dataConstructor.name}-${field.name}`
          const dataFieldAccessor = M.modNameIsAsDefined(
            mod,
            dataFieldAccessorName,
          )
            ? M.Var(dataFieldAccessorName, answer.location)
            : M.QualifiedVar(path, dataFieldAccessorName, answer.location)

          answer = M.Let1(
            freshVars[i].name,
            M.Apply(dataFieldAccessor, [target], answer.location),
            answer,
            answer.location,
          )
        }

        return M.CondClause(question, answer, location)
      }),
      location,
    )
  }

  const groups = groupClausesByHeadPatternKind(clauses)
  return groups.reduceRight(
    (accumulatedExp, group) =>
      simplifyMatch(mod, targets, group, accumulatedExp, location),
    defaultExp,
  )
}

function clauseHeadIsVarPattern(clause: M.MatchClause): boolean {
  assert(clause.patterns.length > 0)
  return M.isVarPattern(clause.patterns[0])
}

function clauseHeadIsDataPattern(clause: M.MatchClause): boolean {
  assert(clause.patterns.length > 0)
  return M.isDataPattern(clause.patterns[0])
}

type GroupByHeadDataConstructor = {
  dataConstructor: M.DataConstructor
  clauses: Array<M.MatchClause>
}

function groupClausesByHeadDataConstructor(
  mod: M.Mod,
  clauses: Array<M.MatchClause>,
): Array<GroupByHeadDataConstructor> {
  const definition = findAlgebraicTypeDefinitionFromClauses(mod, clauses)
  return definition.dataConstructors.map((dataConstructor) => {
    const groupedClauses: Array<M.MatchClause> = []
    for (const clause of clauses) {
      assert(clause.patterns.length > 0)
      const [pattern, ...restPatterns] = clause.patterns
      if (
        M.dataConstructorEqual(
          M.dataPatternDataConstructor(mod, pattern),
          dataConstructor,
        )
      ) {
        const argPatterns = M.dataPatternArgPatterns(pattern)
        const newPatterns = [...argPatterns, ...restPatterns]
        const newClause = M.MatchClause(
          newPatterns,
          clause.body,
          clause.location,
        )
        groupedClauses.push(newClause)
      }
    }

    return { dataConstructor, clauses: groupedClauses }
  })
}

function findAlgebraicTypeDefinitionFromClauses(
  mod: M.Mod,
  clauses: Array<M.MatchClause>,
): M.AlgebraicTypeDefinition {
  let definition: M.AlgebraicTypeDefinition | undefined = undefined
  for (const clause of clauses) {
    assert(clause.patterns.length > 0)
    const [pattern, ...restPatterns] = clause.patterns
    const dataConstructor = M.dataPatternDataConstructor(mod, pattern)
    if (definition === undefined) {
      definition = dataConstructor.definition
    } else if (dataConstructor.definition !== definition) {
      let message = `[findAlgebraicTypeDefinitionFromClauses] datatype definition mismatch`
      message += `\n  definition name: ${definition.name}`
      if (clause.location)
        throw new S.ErrorWithSourceLocation(message, clause.location)
      else throw new Error(message)
    }
  }

  assert(definition)
  return definition
}

function groupClausesByHeadPatternKind(
  clauses: Array<M.MatchClause>,
): Array<Array<M.MatchClause>> {
  const groups: Array<Array<M.MatchClause>> = []
  for (const clause of clauses) {
    if (groups.length === 0) {
      groups.push([clause])
      continue
    }

    const group = groups[groups.length - 1]
    if (
      [clause, ...group].every(clauseHeadIsVarPattern) ||
      [clause, ...group].every(clauseHeadIsDataPattern)
    ) {
      group.push(clause)
      continue
    } else {
      groups.push([clause])
      continue
    }
  }

  return groups
}
