import { arrayUnzip } from "@xieyuheng/helpers.js/array"
import * as B from "../basic/index.ts"
import * as M from "../machine/index.ts"
import * as R from "../runtime/index.ts"

export function SelectInstructionPass(mod: B.Mod, machineMod: M.Mod): void {
  generateSetupFunction(mod)
  mod.exported.add("_main")

  machineMod.exported = mod.exported

  for (const definition of B.modOwnDefinitions(mod)) {
    for (const machineDefinition of onDefinition(machineMod, definition)) {
      machineMod.definitions.set(machineDefinition.name, machineDefinition)
    }
  }
}

function generateSetupFunction(mod: B.Mod): void {
  const instrs = []
  for (const definition of B.modOwnDefinitions(mod)) {
    if (definition.kind === "SetupDefinition") {
      instrs.push(
        B.Call(
          "_",
          B.FunctionRef(definition.name, 0, { isPrimitive: false }),
          [],
        ),
      )
    }
  }

  const name = "_setup"
  const blocks = new Map([["body", B.Block("body", instrs)]])
  mod.definitions.set(name, B.FunctionDefinition(mod, name, blocks))
  mod.exported.add(name)
}

function onDefinition(
  machineMod: M.Mod,
  definition: B.Definition,
): Array<M.Definition> {
  switch (definition.kind) {
    case "FunctionDefinition": {
      return onFunctionDefinition(machineMod, definition)
    }

    case "SetupDefinition": {
      return onSetupDefinition(machineMod, definition)
    }

    case "VariableDefinition": {
      return onVariableDefinition(machineMod, definition)
    }

    case "MetadataDefinition": {
      return onMetadataDefinition(machineMod, definition)
    }

    case "PlaceholderDefinition": {
      return []
    }

    default: {
      let message = `[onDefinition] unhandled definition`
      message += `\n  definition kind: ${definition.kind}`
      throw new Error(message)
    }
  }
}

function onFunctionDefinition(
  machineMod: M.Mod,
  definition: B.FunctionDefinition,
): Array<M.Definition> {
  const code = M.CodeDefinition(
    machineMod,
    definition.name,
    new Map(),
    definition.meta,
  )
  for (const block of definition.blocks.values()) {
    const machineBlock = onBlock(block)
    code.blocks.set(machineBlock.label, machineBlock)
  }
  return [code]
}

function onSetupDefinition(
  machineMod: M.Mod,
  definition: B.SetupDefinition,
): Array<M.Definition> {
  const code = M.CodeDefinition(
    machineMod,
    definition.name,
    new Map(),
    definition.meta,
  )
  for (const block of definition.blocks.values()) {
    const machineBlock = onBlock(block)
    code.blocks.set(machineBlock.label, machineBlock)
  }
  return [code]
}

function onVariableDefinition(
  machineMod: M.Mod,
  definition: B.VariableDefinition,
): Array<M.Definition> {
  if (B.isUndefined(definition.value)) {
    return [M.SpaceDefinition(machineMod, definition.name, 8, definition.meta)]
  } else {
    const value = R.encodeValue(definition.value)
    return [
      M.DataDefinition(
        machineMod,
        definition.name,
        [M.Dq([value])],
        definition.meta,
      ),
    ]
  }
}

function onMetadataDefinition(
  machineMod: M.Mod,
  definition: B.MetadataDefinition,
): Array<M.Definition> {
  return setupMetadata(machineMod, definition.name, definition.attributes)
}

export function setupMetadata(
  machineMod: M.Mod,
  rootName: string,
  attributes: Record<string, B.Metadata>,
): Array<M.Definition> {
  const [directives, definitionArrays] = arrayUnzip(
    Object.entries(attributes).map(([key, metadata]) =>
      onMetadata(machineMod, rootName, [key], metadata),
    ),
  )

  return [
    M.DataDefinition(machineMod, rootName, directives),
    ...definitionArrays.flatMap((array) => array),
  ]
}

function onMetadata(
  machineMod: M.Mod,
  rootName: string,
  path: Array<string>,
  metadata: B.Metadata,
): [M.Directive, Array<M.Definition>] {
  switch (metadata.kind) {
    case "IntMetadata": {
      return [M.Int(metadata.content), []]
    }

    case "FloatMetadata": {
      return [M.Float(metadata.content), []]
    }

    case "StringMetadata": {
      const name = [rootName, ...path].join("/")
      return [
        M.Pointer(name),
        [M.DataDefinition(machineMod, name, [M.String(metadata.content)])],
      ]
    }

    case "PointerMetadata": {
      return [M.Pointer(metadata.name), []]
    }

    case "ListMetadata": {
      const name = [rootName, ...path].join("/")
      const [directives, definitionArrays] = arrayUnzip(
        Array.from(metadata.elements.entries()).map(([index, element]) => {
          return onMetadata(
            machineMod,
            rootName,
            [...path, index.toString()],
            element,
          )
        }),
      )

      return [
        M.Pointer(name),
        [
          M.DataDefinition(machineMod, name, directives),
          ...definitionArrays.flatMap((array) => array),
        ],
      ]
    }

    case "RecordMetadata": {
      const name = [rootName, ...path].join("/")
      const [directives, definitionArrays] = arrayUnzip(
        Object.entries(metadata.attributes).map(([key, element]) =>
          onMetadata(machineMod, rootName, [...path, key], element),
        ),
      )

      return [
        M.Pointer(name),
        [
          M.DataDefinition(machineMod, name, directives),
          ...definitionArrays.flatMap((array) => array),
        ],
      ]
    }
  }
}

function onBlock(block: B.Block): M.Block {
  return M.Block(block.label, block.instrs.flatMap(onInstr), block.meta)
}

function onInstr(instr: B.Instr): Array<M.Instr> {
  switch (instr.op) {
    case "Argument": {
      if (instr.index > 6) {
        let message = `[onInstr] can not handle more then 6 argument yet`
        message += `\n  instr: ${B.formatInstr(instr)}`
        throw new Error(message)
      }

      return [M.Instr("movq", [selectArgReg(instr.index), M.Var(instr.dest)])]
    }

    case "Literal": {
      return selectLiteral(instr.dest, instr.value)
    }

    case "Identity": {
      return [M.Instr("movq", [M.Var(instr.source), M.Var(instr.dest)])]
    }

    case "Assert": {
      // TODO
      return []
    }

    case "Return": {
      if (instr.result !== undefined) {
        return [
          M.Instr("movq", [M.Var(instr.result), M.Reg("rax")]),
          M.Instr("retq", []),
        ]
      }

      return [M.Instr("retq", [])]
    }

    case "Goto": {
      return [M.Instr("jmp", [M.Label(instr.label, { isExternal: false })])]
    }

    case "Branch": {
      return [
        M.Instr("movq", [
          M.LabelDeref(M.Label(`x-true`, { isExternal: true })),
          M.Reg("rax"),
        ]),
        M.Instr("cmpq", [M.Var(instr.condition), M.Reg("rax")]),
        M.Instr("branch-if", [
          M.Cc("e"),
          M.Label(instr.thenLabel, { isExternal: false }),
          M.Label(instr.elseLabel, { isExternal: false }),
        ]),
      ]
    }

    case "Call": {
      return selectCall(instr.dest, instr.fn, instr.args)
    }

    case "Apply": {
      const fn = B.FunctionRef("apply-unary", 2, { isPrimitive: true })
      return selectCall(instr.dest, fn, [instr.target, instr.arg])
    }

    case "ApplyNullary": {
      const fn = B.FunctionRef("apply-nullary", 1, { isPrimitive: true })
      return selectCall(instr.dest, fn, [instr.target])
    }

    case "Load": {
      const variableLabel = M.Label(instr.name, { isExternal: false })
      return [M.Instr("movq", [M.LabelDeref(variableLabel), M.Var(instr.dest)])]
    }

    case "Store": {
      const variableLabel = M.Label(instr.name, { isExternal: false })
      return [
        M.Instr("movq", [M.Var(instr.source), M.LabelDeref(variableLabel)]),
      ]
    }
  }
}

function selectArgReg(index: number): M.Reg {
  const argRegName = R.ABIs["x86-64-sysv"]["argument-reg-names"][index]
  return M.Reg(argRegName)
}

function selectCall(
  dest: string,
  fn: B.FunctionRef,
  args: Array<string>,
): Array<M.Instr> {
  const prepareArguments = Array.from(args.entries()).map(([index, arg]) =>
    M.Instr("movq", [M.Var(arg), selectArgReg(index)]),
  )

  return [
    ...prepareArguments,
    M.Instr("callq-n", [selectFunctionLabel(fn), M.Arity(args.length)]),
    M.Instr("movq", [M.Reg("rax"), M.Var(dest)]),
  ]
}

function selectLiteral(dest: string, value: B.Value): Array<M.Instr> {
  if (B.isBool(value)) {
    if (B.isTrue(value)) {
      return [
        M.Instr("movq", [
          M.LabelDeref(M.Label(`x-true`, { isExternal: true })),
          M.Var(dest),
        ]),
      ]
    } else {
      return [
        M.Instr("movq", [
          M.LabelDeref(M.Label(`x-false`, { isExternal: true })),
          M.Var(dest),
        ]),
      ]
    }
  }

  switch (value.kind) {
    case "Int": {
      return [M.Instr("movq", [M.Imm(R.encodeInt(value.content)), M.Var(dest)])]
    }

    case "Address": {
      return [
        M.Instr("movq", [M.LabelImm(selectAddressLabel(value)), M.Var(dest)]),
        ...selectTagEncoding(M.Var(dest), R.AddressTag),
      ]
    }

    case "FunctionRef": {
      return [
        M.Instr("movq", [
          M.LabelDeref(
            M.Label(`${value.name}©constant`, { isExternal: false }),
          ),
          M.Var(dest),
        ]),
      ]
    }

    default: {
      let message = `[selectLiteral] unhandled value`
      message += `\n  value: ${B.formatValue(value)}`
      message += `\n  dest: ${dest}`
      throw new Error(message)
    }
  }
}

function selectTagEncoding(operand: M.Operand, tag: R.Tag): Array<M.Instr> {
  if (tag === R.AddressTag || tag === R.ObjectTag) {
    return [M.Instr("orq", [M.Imm(tag), operand])]
  } else {
    return [
      M.Instr("salq", [M.Imm(BigInt(3)), operand]),
      M.Instr("orq", [M.Imm(tag), operand]),
    ]
  }
}

function selectFunctionLabel(fn: B.FunctionRef): M.Label {
  return fn.attributes.isPrimitive
    ? M.Label(`x-${fn.name}`, { isExternal: true })
    : M.Label(fn.name, { isExternal: false })
}

function selectAddressLabel(address: B.Address): M.Label {
  return address.attributes.isPrimitive
    ? M.Label(`x-${address.name}`, { isExternal: true })
    : M.Label(address.name, { isExternal: false })
}
