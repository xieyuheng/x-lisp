import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"
import {
  createDesugarState,
  desugar,
  simplifyMatch,
} from "./020-DesugarPass.ts"

export function LowerMatchPass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const mod of project.mods.values()) {
    for (const definition of mod.definitions.values()) {
      lowerMatchDefinition(mod, definition)
    }
  }

  if (options.dump) projectDumpMods(project, "015-lower-match")
}

function lowerMatchDefinition(mod: M.Mod, definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      return null
    }

    case "FunctionDefinition":
    case "VariableDefinition":
    case "TestDefinition":
    case "TypeDefinition": {
      definition.body = lowerMatch(mod, definition.body)
      return null
    }

    case "AlgebraicTypeDefinition": {
      definition.dataConstructors = definition.dataConstructors.map(
        ({ name, fields }) => ({
          definition,
          name,
          fields: fields.map(({ name, type }) => ({
            name,
            type: lowerMatch(mod, type),
          })),
        }),
      )

      return null
    }
  }
}

function lowerMatch(mod: M.Mod, exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "Match": {
      const state = createDesugarState()

      const defaultExp = M.Apply(
        M.QualifiedVar("builtin", "error", exp.location),
        [
          M.LiteralList(
            [
              M.String("match mismatch", exp.location),
              M.LiteralList(exp.targets, exp.location),
            ],
            exp.location,
          ),
        ],
        exp.location,
      )

      return desugar(
        state,
        simplifyMatch(
          mod,
          exp.targets.map((t) => lowerMatch(mod, t)),
          exp.clauses.map((clause) => ({
            ...clause,
            body: lowerMatch(mod, clause.body),
          })),
          defaultExp,
          exp.location,
        ),
      )
    }

    default: {
      return M.expTraverse((child) => lowerMatch(mod, child), exp)
    }
  }
}
