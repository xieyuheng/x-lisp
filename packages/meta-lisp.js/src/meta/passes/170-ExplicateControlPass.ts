import * as S from "@xieyuheng/sexp.js"
import { type SourceLocation } from "@xieyuheng/sexp.js"
import * as B from "../../basic/index.ts"
import * as M from "../index.ts"

export function ExplicateControlPass(pkg: M.Package): B.Mod {
  const basicMod = B.createMod()

  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    for (const mod of orderedPkg.mods.values()) {
      for (const definition of mod.definitions.values()) {
        for (const basicDefinition of explicateDefinition(
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

function explicateDefinition(
  basicMod: B.Mod,
  definition: M.Definition,
): Array<B.Definition> {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      return [
        B.PrimitiveFunctionDeclaration(
          basicMod,
          definitionQualifiedName(definition),
          definition.arity,
          definition.location,
        ),
      ]
    }

    case "PrimitiveVariableDeclaration": {
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
      block.instrs = explicateInTail(state, definition.body)
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
      block.instrs = explicateInTail(state, definition.body)
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
      block.instrs = explicateInTail(state, definition.body)
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

function explicateUnnestedTerm(state: State, term: M.Term): B.Exp {
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
      const prefix = resolvePackageId(state.pkg, term.pkgName)
      return B.VarExp(`${prefix}/${term.modName}/${term.name}`, term.location)
    }

    case "ApplyTerm": {
      return B.ApplyExp(
        explicateUnnestedTerm(state, term.target),
        term.args.map((arg) => explicateUnnestedTerm(state, arg)),
        term.location,
      )
    }

    default: {
      let message = `[explicateUnnestedTerm] unhandled term`
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

function explicateInTail(state: State, term: M.Term): Array<B.Instr> {
  if (!M.isAtomOperandTerm(term)) {
    let message = `[explicateInTail] expect AtomOperandTerm`
    throw new S.ErrorWithSourceLocation(message, term.location)
  }

  switch (term.kind) {
    case "Let1Term": {
      return explicateInLet1(
        state,
        term.name,
        term.rhs,
        explicateInTail(state, term.body),
      )
    }

    case "Begin1Term": {
      return explicateInBegin1(
        state,
        term.head,
        explicateInTail(state, term.body),
      )
    }

    case "IfTerm": {
      return explicateInIf(
        state,
        term.condition,
        explicateInTail(state, term.consequent),
        explicateInTail(state, term.alternative),
      )
    }

    default: {
      return [B.ReturnInstr(explicateUnnestedTerm(state, term), term.location)]
    }
  }
}

function explicateInLet1(
  state: State,
  name: string,
  rhs: M.Term,
  cont: Array<B.Instr>,
): Array<B.Instr> {
  switch (rhs.kind) {
    case "Let1Term": {
      return explicateInLet1(
        state,
        rhs.name,
        rhs.rhs,
        explicateInLet1(state, name, rhs.body, cont),
      )
    }

    case "Begin1Term": {
      return explicateInBegin1(
        state,
        rhs.head,
        explicateInLet1(state, name, rhs.body, cont),
      )
    }

    case "IfTerm": {
      const gotoBody = B.GotoInstr(
        generateLabel(state, "let-body", cont, rhs.location),
        rhs.location,
      )
      return explicateInIf(
        state,
        rhs.condition,
        explicateInLet1(state, name, rhs.consequent, [gotoBody]),
        explicateInLet1(state, name, rhs.alternative, [gotoBody]),
      )
    }

    default: {
      return [
        B.AssignInstr(name, explicateUnnestedTerm(state, rhs), rhs.location),
        ...cont,
      ]
    }
  }
}

function explicateInBegin1(
  state: State,
  head: M.Term,
  cont: Array<B.Instr>,
): Array<B.Instr> {
  switch (head.kind) {
    case "Let1Term": {
      return explicateInLet1(
        state,
        head.name,
        head.rhs,
        explicateInBegin1(state, head.body, cont),
      )
    }

    case "Begin1Term": {
      return explicateInBegin1(
        state,
        head.head,
        explicateInBegin1(state, head.body, cont),
      )
    }

    case "IfTerm": {
      const gotoBody = B.GotoInstr(
        generateLabel(state, "begin-body", cont, head.location),
        head.location,
      )
      return explicateInIf(
        state,
        head.condition,
        explicateInBegin1(state, head.consequent, [gotoBody]),
        explicateInBegin1(state, head.alternative, [gotoBody]),
      )
    }

    default: {
      return [
        B.PerformInstr(explicateUnnestedTerm(state, head), head.location),
        ...cont,
      ]
    }
  }
}

function explicateInIf(
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

  if (
    condition.kind === "ApplyTerm" &&
    condition.target.kind === "VarTerm" &&
    condition.target.name === "not" &&
    condition.args.length === 1
  ) {
    const [negatedCondition] = condition.args
    return explicateInIf(state, negatedCondition, elseCont, thenCont)
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
      return [
        B.TestInstr(
          explicateUnnestedTerm(state, condition),
          condition.location,
        ),
        B.BranchInstr(
          generateLabel(state, "then", thenCont, condition.location),
          generateLabel(state, "else", elseCont, condition.location),
          condition.location,
        ),
      ]
    }

    case "Let1Term": {
      return explicateInLet1(
        state,
        condition.name,
        condition.rhs,
        explicateInIf(state, condition.body, thenCont, elseCont),
      )
    }

    case "Begin1Term": {
      return explicateInBegin1(
        state,
        condition.head,
        explicateInIf(state, condition.body, thenCont, elseCont),
      )
    }

    case "IfTerm": {
      const gotoThen = B.GotoInstr(
        generateLabel(state, "then", thenCont, condition.location),
        condition.location,
      )
      const gotoElse = B.GotoInstr(
        generateLabel(state, "else", elseCont, condition.location),
        condition.location,
      )
      return explicateInIf(
        state,
        condition.condition,
        explicateInIf(state, condition.consequent, [gotoThen], [gotoElse]),
        explicateInIf(state, condition.alternative, [gotoThen], [gotoElse]),
      )
    }

    default: {
      let message = `[explicateInIf] unhandled condition`
      message += `\n  condition: ${M.formatTerm(condition)}`
      throw new S.ErrorWithSourceLocation(message, condition.location)
    }
  }
}
