import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function DesugarPass(mod: M.Mod): void {
  M.modForEachOwnDefinition(mod, desugarDefinition)
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
      definition.body = desugar(definition.mod, definition.body)
      return null
    }

    case "VariableDefinition": {
      definition.body = desugar(definition.mod, definition.body)
      return null
    }

    case "TestDefinition": {
      definition.body = desugar(definition.mod, definition.body)
      return null
    }

    case "TypeDefinition": {
      definition.body = desugar(definition.mod, definition.body)
      return null
    }

    case "DataDefinition": {
      definition.dataConstructors = definition.dataConstructors.map(
        ({ name, fields }) => ({
          definition,
          name,
          fields: fields.map(({ name, type }) => ({
            name,
            type: desugar(definition.mod, type),
          })),
        }),
      )

      return null
    }

    case "InterfaceDefinition": {
      definition.attributeTypes = recordMapValue(
        definition.attributeTypes,
        (attributeType) => desugar(definition.mod, attributeType),
      )

      return null
    }
  }
}

export function desugar(mod: M.Mod, exp: M.Exp): M.Exp {
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
      return desugar(mod, desugarBegin(exp.sequence, exp.location))
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
        desugar(mod, exp.condition),
        desugar(mod, exp.consequent),
        desugar(mod, exp.alternative),
        exp.location,
      )
    }

    case "When": {
      return M.If(
        desugar(mod, exp.condition),
        M.Begin1(
          desugar(mod, exp.consequent),
          M.VoidVar(exp.location),
          exp.location,
        ),
        M.VoidVar(exp.location),
        exp.location,
      )
    }

    case "Unless": {
      return M.If(
        desugar(mod, exp.condition),
        M.VoidVar(exp.location),
        M.Begin1(
          desugar(mod, exp.alternative),
          M.VoidVar(exp.location),
          exp.location,
        ),
        exp.location,
      )
    }

    case "And": {
      return desugar(mod, desugarAnd(exp.exps, exp.location))
    }

    case "Or": {
      return desugar(mod, desugarOr(exp.exps, exp.location))
    }

    case "Cond": {
      return desugar(mod, desugarCond(exp.clauses, exp.location))
    }

    case "Match": {
      const defaultExp = M.Apply(
        M.QualifiedVar("builtin", "error", exp.location),
        [M.String("match mismatch", exp.location)],
        exp.location,
      )

      return desugar(
        mod,
        M.simplifyMatch(
          mod,
          exp.targets,
          exp.clauses,
          defaultExp,
          exp.location,
        ),
      )
    }

    case "LiteralList": {
      return desugar(mod, desugarList(exp.elements, exp.location))
    }

    case "LiteralSet": {
      return desugar(mod, desugarSet(exp.elements, exp.location))
    }

    case "LiteralHash": {
      return desugar(mod, desugarHash(exp.entries, exp.location))
    }

    case "Quote": {
      return desugar(mod, desugarQuote(exp.sexp, exp.location))
    }

    case "Apply": {
      return M.Apply(
        desugar(mod, exp.target),
        exp.args.map((e) => desugar(mod, e)),
        exp.location,
      )
    }

    case "Arrow": {
      return M.Arrow(
        exp.argTypes.map((e) => desugar(mod, e)),
        desugar(mod, exp.retType),
        exp.location,
      )
    }

    case "Begin1": {
      return M.Begin1(
        desugar(mod, exp.head),
        desugar(mod, exp.body),
        exp.location,
      )
    }

    case "Let1": {
      return M.Let1(
        exp.name,
        desugar(mod, exp.rhs),
        desugar(mod, exp.body),
        exp.location,
      )
    }

    case "LiteralRecord": {
      return M.LiteralRecord(
        recordMapValue(exp.attributes, (e) => desugar(mod, e)),
        exp.location,
      )
    }

    case "Interface": {
      return M.Interface(
        recordMapValue(exp.attributeTypes, (e) => desugar(mod, e)),
        exp.location,
      )
    }

    case "ExtendInterface": {
      return M.ExtendInterface(
        desugar(mod, exp.baseType),
        recordMapValue(exp.attributeTypes, (e) => desugar(mod, e)),
        exp.location,
      )
    }

    case "Extend": {
      return M.Extend(
        desugar(mod, exp.base),
        recordMapValue(exp.attributes, (e) => desugar(mod, e)),
        exp.location,
      )
    }

    case "Update": {
      return M.Update(
        desugar(mod, exp.base),
        recordMapValue(exp.attributes, (e) => desugar(mod, e)),
        exp.location,
      )
    }

    case "UpdateMut": {
      return M.UpdateMut(
        desugar(mod, exp.base),
        recordMapValue(exp.attributes, (e) => desugar(mod, e)),
        exp.location,
      )
    }

    case "The": {
      return M.The(desugar(mod, exp.type), desugar(mod, exp.exp), exp.location)
    }

    case "Lambda": {
      return M.Lambda(exp.parameters, desugar(mod, exp.body), exp.location)
    }

    case "Polymorphic": {
      return M.Polymorphic(exp.parameters, desugar(mod, exp.body), exp.location)
    }
  }
}

function desugarBegin(
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
