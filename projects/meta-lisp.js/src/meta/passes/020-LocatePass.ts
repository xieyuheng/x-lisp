import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"

export function LocatePass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const mod of project.mods.values()) {
    for (const definition of mod.definitions.values()) {
      locateDefinition(definition)
    }
  }

  if (options.dump) projectDumpMods(project, "030-locate")
}

function locateDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      return null
    }

    case "FunctionDefinition": {
      definition.body = locateSpecialApply(definition.body)
      return null
    }

    case "VariableDefinition": {
      definition.body = locateSpecialApply(definition.body)
      return null
    }

    case "TestDefinition": {
      definition.body = locateSpecialApply(definition.body)
      return null
    }

    case "TypeDefinition": {
      definition.body = locateSpecialApply(definition.body)
      return null
    }

    case "DataDefinition": {
      definition.dataConstructors = definition.dataConstructors.map(
        ({ name, fields }) => ({
          definition,
          name,
          fields: fields.map(({ name, type }) => ({
            name,
            type: locateSpecialApply(type),
          })),
        }),
      )

      return null
    }

    case "InterfaceDefinition": {
      definition.attributeTypes = recordMapValue(
        definition.attributeTypes,
        (attributeType) => locateSpecialApply(attributeType),
      )

      return null
    }
  }
}

function locateSpecialApply(exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float":
    case "Quote":
    case "QualifiedVar":
    case "Var": {
      return exp
    }

    case "Apply": {
      if (isSpecialTarget(exp.target)) {
        if (!exp.location) {
          let message = `[locateSpecialApply] expect source location`
          message += `\n  exp: ${M.formatExp(exp)}`
          throw new Error(message)
        }

        return M.Apply(
          targetWithLocation(exp.target),
          [
            ...exp.args.map((e) => locateSpecialApply(e)),
            expFromSourceLocation(exp.location),
          ],
          exp.location,
        )
      } else {
        return M.Apply(
          exp.target,
          exp.args.map((e) => locateSpecialApply(e)),
          exp.location,
        )
      }
    }

    default: {
      return M.expTraverse((child) => locateSpecialApply(child), exp)
    }
  }
}

const specialNameRecord: Record<string, string> = {
  error: "error-with-location",
  assert: "assert-with-location",
  "assert-equal": "assert-equal-with-location",
}

function isSpecialTarget(exp: M.Exp): boolean {
  return (
    exp.kind === "QualifiedVar" &&
    exp.modName === "builtin" &&
    exp.name in specialNameRecord
  )
}

function targetWithLocation(exp: M.Exp): M.Exp {
  assert(exp.kind === "QualifiedVar")
  return M.QualifiedVar(exp.modName, specialNameRecord[exp.name], exp.location)
}

function expFromSourceLocation(location: S.SourceLocation): M.Exp {
  return M.LiteralRecord(
    {
      path: M.String(location.path, location),
      span: expFromSpan(location.span, location),
    },
    location,
  )
}

function expFromSpan(span: S.Span, location: S.SourceLocation): M.Exp {
  return M.LiteralRecord(
    {
      start: expFromPosition(span.start, location),
      end: expFromPosition(span.end, location),
    },
    location,
  )
}

function expFromPosition(
  position: S.Position,
  location: S.SourceLocation,
): M.Exp {
  return M.LiteralRecord(
    {
      index: M.Int(BigInt(position.index), location),
      row: M.Int(BigInt(position.row), location),
      column: M.Int(BigInt(position.column), location),
    },
    location,
  )
}
