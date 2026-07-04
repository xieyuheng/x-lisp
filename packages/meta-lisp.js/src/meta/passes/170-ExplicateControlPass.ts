import * as S from "@xieyuheng/sexp.js"
import { type SourceLocation } from "@xieyuheng/sexp.js"
import * as B from "../../basic/index.ts"
import * as M from "../index.ts"

export function ExplicateControlPass(pkg: M.Package): B.Mod {
  const basicMod = B.createMod()

  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    for (const mod of orderedPkg.mods.values()) {
      for (const definition of mod.definitions.values()) {
        for (const basicDefinition of explicateControlDefinition(
          basicMod,
          definition,
        )) {
          basicMod.definitions.set(basicDefinition.name, basicDefinition)
        }
      }
    }
  }

  return basicMod
}

function definitionQualifiedName(definition: M.Definition): string {
  return `${definition.mod.pkg.id}/${definition.mod.name}/${definition.name}`
}

function explicateControlDefinition(
  basicMod: B.Mod,
  definition: M.Definition,
): Array<B.Definition> {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveFunctionDefinition": {
      return [
        B.PrimitiveFunctionDeclaration(
          basicMod,
          definitionQualifiedName(definition),
          definition.arity,
          definition.location,
        ),
      ]
    }

    case "PrimitiveVariableDeclaration":
    case "PrimitiveVariableDefinition": {
      return [
        B.PrimitiveVariableDeclaration(
          basicMod,
          definitionQualifiedName(definition),
          definition.location,
        ),
      ]
    }

    // - do not generate code for type.
    case "AlgebraicTypeDefinition":
    case "OpaqueTypeDefinition":
    case "TypeDefinition": {
      return []
    }

    case "FunctionDefinition": {
      const state = createState(definition.mod.pkg)
      const block = B.Block("body", [], definition.location)
      addBlock(state, block)
      block.instrs = explicateControlInTail(state, definition.body)
      return [
        B.FunctionDefinition(
          basicMod,
          definitionQualifiedName(definition),
          definition.parameters,
          state.blocks,
          definition.location,
        ),
      ]
    }

    case "TestDefinition": {
      const state = createState(definition.mod.pkg)
      const block = B.Block("body", [], definition.location)
      addBlock(state, block)
      block.instrs = explicateControlInTail(state, definition.body)
      return [
        B.TestDefinition(
          basicMod,
          definitionQualifiedName(definition),
          state.blocks,
          definition.location,
        ),
      ]
    }

    case "VariableDefinition": {
      const state = createState(definition.mod.pkg)
      const block = B.Block("body", [], definition.location)
      addBlock(state, block)
      block.instrs = explicateControlInTail(state, definition.body)
      return [
        B.VariableDefinition(
          basicMod,
          definitionQualifiedName(definition),
          state.blocks,
          definition.location,
        ),
      ]
    }
  }
}

type State = {
  pkg: M.Package
  blocks: Map<string, B.Block>
}

function createState(pkg: M.Package): State {
  return { pkg, blocks: new Map() }
}

function addBlock(state: State, block: B.Block): void {
  state.blocks.set(block.label, block)
}

function generateLabel(
  state: State,
  name: string,
  instrs: Array<B.Instr>,
  location: SourceLocation,
): string {
  const label = `${name}.${state.blocks.size}`
  const block = B.Block(label, instrs, location)
  addBlock(state, block)
  return label
}

function toBasicExp(term: M.Term, pkg: M.Package): B.Exp {
  switch (term.kind) {
    case "SymbolTerm": {
      return B.SymbolExp(term.content, term.location)
    }
    case "KeywordTerm": {
      return B.KeywordExp(term.content, term.location)
    }
    case "StringTerm": {
      return B.StringExp(term.content, term.location)
    }
    case "IntTerm": {
      return B.IntExp(term.content, term.location)
    }
    case "FloatTerm": {
      return B.FloatExp(term.content, term.location)
    }

    case "VarTerm": {
      return B.VarExp(term.name, term.location)
    }

    case "QualifiedVarTerm": {
      const prefix = resolvePackageId(pkg, term.pkgName)
      return B.VarExp(`${prefix}/${term.modName}/${term.name}`, term.location)
    }

    case "ApplyTerm": {
      return B.ApplyExp(
        toBasicExp(term.target, pkg),
        term.args.map((arg) => toBasicExp(arg, pkg)),
        term.location,
      )
    }

    default: {
      let message = `[ExplicateControlPass] [toBasicExp] unhandled term`
      message += `\n  term kind: ${term.kind}`
      message += `\n  term: ${M.formatTerm(term)}`
      throw new S.ErrorWithSourceLocation(message, term.location)
    }
  }
}

function resolvePackageId(pkg: M.Package, pkgName: string): string {
  if (pkgName === pkg.id) return pkg.id

  const dep = pkg.dependencies.get(pkgName)
  if (!dep) {
    throw new Error(`[resolvePackageId] unknown package: "${pkgName}"`)
  }
  return dep.id
}

function explicateControlInTail(state: State, term: M.Term): Array<B.Instr> {
  if (!M.isAtomOperandTerm(term)) {
    let message = `[explicateControlInTail] expect AtomOperandTerm`
    throw new S.ErrorWithSourceLocation(message, term.location)
  }

  switch (term.kind) {
    case "Let1Term": {
      return explicateControlInLet1(
        state,
        term.name,
        term.rhs,
        explicateControlInTail(state, term.body),
      )
    }

    case "Begin1Term": {
      return explicateControlInBegin1(
        state,
        term.head,
        explicateControlInTail(state, term.body),
      )
    }

    case "IfTerm": {
      return explicateControlInIf(
        state,
        term.condition,
        explicateControlInTail(state, term.consequent),
        explicateControlInTail(state, term.alternative),
      )
    }

    default: {
      return [B.ReturnInstr(toBasicExp(term, state.pkg), term.location)]
    }
  }
}

function explicateControlInLet1(
  state: State,
  name: string,
  rhs: M.Term,
  cont: Array<B.Instr>,
): Array<B.Instr> {
  switch (rhs.kind) {
    case "Let1Term": {
      return explicateControlInLet1(
        state,
        rhs.name,
        rhs.rhs,
        explicateControlInLet1(state, name, rhs.body, cont),
      )
    }

    case "Begin1Term": {
      return explicateControlInBegin1(
        state,
        rhs.head,
        explicateControlInLet1(state, name, rhs.body, cont),
      )
    }

    case "IfTerm": {
      const letBodyLabel = generateLabel(state, "let-body", cont, rhs.location)
      return explicateControlInIf(
        state,
        rhs.condition,
        explicateControlInLet1(state, name, rhs.consequent, [
          B.GotoInstr(letBodyLabel, rhs.location),
        ]),
        explicateControlInLet1(state, name, rhs.alternative, [
          B.GotoInstr(letBodyLabel, rhs.location),
        ]),
      )
    }

    default: {
      return [
        B.AssignInstr(name, toBasicExp(rhs, state.pkg), rhs.location),
        ...cont,
      ]
    }
  }
}

function explicateControlInBegin1(
  state: State,
  head: M.Term,
  cont: Array<B.Instr>,
): Array<B.Instr> {
  switch (head.kind) {
    case "Let1Term": {
      return explicateControlInLet1(
        state,
        head.name,
        head.rhs,
        explicateControlInBegin1(state, head.body, cont),
      )
    }

    case "Begin1Term": {
      return explicateControlInBegin1(
        state,
        head.head,
        explicateControlInBegin1(state, head.body, cont),
      )
    }

    case "IfTerm": {
      const letBodyLabel = generateLabel(state, "let-body", cont, head.location)
      return explicateControlInIf(
        state,
        head.condition,
        explicateControlInBegin1(state, head.consequent, [
          B.GotoInstr(letBodyLabel, head.location),
        ]),
        explicateControlInBegin1(state, head.alternative, [
          B.GotoInstr(letBodyLabel, head.location),
        ]),
      )
    }

    default: {
      return [
        B.PerformInstr(toBasicExp(head, state.pkg), head.location),
        ...cont,
      ]
    }
  }
}

function explicateControlInIf(
  state: State,
  condition: M.Term,
  thenCont: Array<B.Instr>,
  elseCont: Array<B.Instr>,
): Array<B.Instr> {
  if (
    condition.kind === "QualifiedVarTerm" &&
    condition.modName === "builtin" &&
    condition.name === "true"
  ) {
    return thenCont
  }

  if (
    condition.kind === "QualifiedVarTerm" &&
    condition.modName === "builtin" &&
    condition.name === "false"
  ) {
    return elseCont
  }

  switch (condition.kind) {
    case "VarTerm": {
      return [
        B.TestInstr(
          B.ApplyExp(
            B.VarExp("meta-builtin/builtin/same?", condition.location),
            [
              B.VarExp(condition.name, condition.location),
              B.VarExp("meta-builtin/builtin/true", condition.location),
            ],
            condition.location,
          ),
          condition.location,
        ),
        B.BranchInstr(
          generateLabel(state, "then", thenCont, condition.location),
          generateLabel(state, "else", elseCont, condition.location),
          condition.location,
        ),
      ]
    }

    case "ApplyTerm": {
      if (
        condition.target.kind === "VarTerm" &&
        condition.target.name === "not" &&
        condition.args.length === 1
      ) {
        const [negatedCondition] = condition.args
        return explicateControlInIf(state, negatedCondition, elseCont, thenCont)
      }

      return [
        B.TestInstr(toBasicExp(condition, state.pkg), condition.location),
        B.BranchInstr(
          generateLabel(state, "then", thenCont, condition.location),
          generateLabel(state, "else", elseCont, condition.location),
          condition.location,
        ),
      ]
    }

    case "Let1Term": {
      return explicateControlInLet1(
        state,
        condition.name,
        condition.rhs,
        explicateControlInIf(state, condition.body, thenCont, elseCont),
      )
    }

    case "Begin1Term": {
      return explicateControlInBegin1(
        state,
        condition.head,
        explicateControlInIf(state, condition.body, thenCont, elseCont),
      )
    }

    case "IfTerm": {
      thenCont = [
        B.GotoInstr(
          generateLabel(state, "then", thenCont, condition.location),
          condition.location,
        ),
      ]
      elseCont = [
        B.GotoInstr(
          generateLabel(state, "else", elseCont, condition.location),
          condition.location,
        ),
      ]
      return explicateControlInIf(
        state,
        condition.condition,
        explicateControlInIf(state, condition.consequent, thenCont, elseCont),
        explicateControlInIf(state, condition.alternative, thenCont, elseCont),
      )
    }

    default: {
      let message = `[ExplicateControlPass] [explicateControlInIf] unhandled condition`
      message += `\n  condition: ${M.formatTerm(condition)}`
      throw new S.ErrorWithSourceLocation(message, condition.location)
    }
  }
}
