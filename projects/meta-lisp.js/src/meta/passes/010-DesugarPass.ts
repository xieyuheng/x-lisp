import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function DesugarPass(mod: M.Mod): void {
  M.modForEachOwnDefinition(mod, desugarDefinition)
}

type State = {
  mod: M.Mod
  nameCounts: Map<string, number>
}

export function createDesugarState(mod: M.Mod): State {
  return {
    mod,
    nameCounts: new Map(),
  }
}

function desugarDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      return null
    }

    case "FunctionDefinition": {
      const state = createDesugarState(definition.mod)
      definition.body = desugar(state, definition.body)
      return null
    }

    case "VariableDefinition": {
      const state = createDesugarState(definition.mod)
      definition.body = desugar(state, definition.body)
      return null
    }

    case "TestDefinition": {
      const state = createDesugarState(definition.mod)
      definition.body = desugar(state, definition.body)
      return null
    }

    case "TypeDefinition": {
      const state = createDesugarState(definition.mod)
      definition.body = desugar(state, definition.body)
      return null
    }

    case "DataDefinition": {
      definition.dataConstructors = definition.dataConstructors.map(
        ({ name, fields }) => {
          const state = createDesugarState(definition.mod)
          return {
            definition,
            name,
            fields: fields.map(({ name, type }) => ({
              name,
              type: desugar(state, type),
            })),
          }
        },
      )

      return null
    }

    case "InterfaceDefinition": {
      const state = createDesugarState(definition.mod)
      definition.attributeTypes = recordMapValue(
        definition.attributeTypes,
        (attributeType) => desugar(state, attributeType),
      )

      return null
    }
  }
}

export function desugar(state: State, exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float":
    case "Var":
    case "QualifiedVar": {
      return exp
    }

    case "BeginSugar": {
      return desugar(state, desugarBegin(exp.sequence, exp.location))
    }

    case "AssignSugar": {
      let message = `[desugar] (=) must occur in the head of (begin)`
      message += `\n  exp: ${M.formatExp(exp)}`
      if (exp.location)
        throw new S.ErrorWithSourceLocation(message, exp.location)
      else throw new Error(message)
    }

    case "If": {
      return M.If(
        desugar(state, exp.condition),
        desugar(state, exp.consequent),
        desugar(state, exp.alternative),
        exp.location,
      )
    }

    case "When": {
      return M.If(
        desugar(state, exp.condition),
        M.Begin1(
          desugar(state, exp.consequent),
          M.VoidVar(exp.location),
          exp.location,
        ),
        M.VoidVar(exp.location),
        exp.location,
      )
    }

    case "Unless": {
      return M.If(
        desugar(state, exp.condition),
        M.VoidVar(exp.location),
        M.Begin1(
          desugar(state, exp.alternative),
          M.VoidVar(exp.location),
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

    case "Match": {
      const defaultExp = M.Apply(
        M.QualifiedVar("builtin", "error", exp.location),
        [M.String("match mismatch", exp.location)],
        exp.location,
      )

      return desugar(
        state,
        M.simplifyMatch(
          state.mod,
          exp.targets,
          exp.clauses,
          defaultExp,
          exp.location,
        ),
      )
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

    case "Apply": {
      return M.Apply(
        desugar(state, exp.target),
        exp.args.map((e) => desugar(state, e)),
        exp.location,
      )
    }

    case "Arrow": {
      return M.Arrow(
        exp.argTypes.map((e) => desugar(state, e)),
        desugar(state, exp.retType),
        exp.location,
      )
    }

    case "Begin1": {
      return M.Begin1(
        desugar(state, exp.head),
        desugar(state, exp.body),
        exp.location,
      )
    }

    case "Let1": {
      return M.Let1(
        exp.name,
        desugar(state, exp.rhs),
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

    case "Let": {
      return desugar(
        state,
        desugarLet(state, exp.bindings, exp.body, exp.location),
      )
    }

    case "LiteralRecord": {
      return M.LiteralRecord(
        recordMapValue(exp.attributes, (e) => desugar(state, e)),
        exp.location,
      )
    }

    case "Interface": {
      return M.Interface(
        recordMapValue(exp.attributeTypes, (e) => desugar(state, e)),
        exp.location,
      )
    }

    case "ExtendInterface": {
      return M.ExtendInterface(
        desugar(state, exp.baseType),
        recordMapValue(exp.attributeTypes, (e) => desugar(state, e)),
        exp.location,
      )
    }

    case "Extend": {
      return M.Extend(
        desugar(state, exp.base),
        recordMapValue(exp.attributes, (e) => desugar(state, e)),
        exp.location,
      )
    }

    case "Update": {
      return M.Update(
        desugar(state, exp.base),
        recordMapValue(exp.attributes, (e) => desugar(state, e)),
        exp.location,
      )
    }

    case "UpdateMut": {
      return M.UpdateMut(
        desugar(state, exp.base),
        recordMapValue(exp.attributes, (e) => desugar(state, e)),
        exp.location,
      )
    }

    case "The": {
      return M.The(
        desugar(state, exp.type),
        desugar(state, exp.exp),
        exp.location,
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

  if (head.kind === "AssignSugar") {
    return M.Let1(head.name, head.rhs, desugarBegin(rest), location)
  } else {
    return M.Begin1(head, desugarBegin(rest), location)
  }
}

function desugarAnd(exps: Array<M.Exp>, location?: S.SourceLocation): M.Exp {
  if (exps.length === 0) return M.BoolVar(true, location)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return M.If(
    head,
    desugarAnd(restExps, location),
    M.BoolVar(false, location),
    location,
  )
}

function desugarOr(exps: Array<M.Exp>, location?: S.SourceLocation): M.Exp {
  if (exps.length === 0) return M.BoolVar(false, location)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return M.If(
    head,
    M.BoolVar(true, location),
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
  return M.BeginSugar(
    [
      M.AssignSugar(
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
  return M.BeginSugar(
    [
      M.AssignSugar(
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
  return M.BeginSugar(
    [
      M.AssignSugar(
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
