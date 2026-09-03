export type NameTable = {
  names: Array<string>
  nameToOffset: Map<string, number>
  offsetToName: Map<number, string>
  nextOffset: number
}

export function makeEmptyNameTable(): NameTable {
  return {
    names: [],
    nameToOffset: new Map(),
    offsetToName: new Map(),
    nextOffset: 0,
  }
}

export function makeNameTable(names: Array<string>): NameTable {
  const nameTable = makeEmptyNameTable()

  for (const name of names) {
    nameTableAddName(nameTable, name)
  }

  return nameTable
}

export function nameTableGetOffset(nameTable: NameTable, name: string): number {
  const offset = nameTable.nameToOffset.get(name)
  if (offset === undefined) {
    throw new Error(`[nameTableGetOffset] name not found: ${name}`)
  }
  return offset
}

export function nameTableGetName(nameTable: NameTable, offset: number): string {
  const name = nameTable.offsetToName.get(offset)
  if (name === undefined) {
    throw new Error(`[nameTableGetName] offset not found: ${offset}`)
  }
  return name
}

export function nameTableAddName(
  nameTable: NameTable,
  name: string,
): number {
  const existing = nameTable.nameToOffset.get(name)
  if (existing !== undefined) {
    return existing
  }

  const offset = nameTable.nextOffset
  const encoder = new TextEncoder()

  nameTable.names.push(name)
  nameTable.nameToOffset.set(name, offset)
  nameTable.offsetToName.set(offset, name)
  nameTable.nextOffset += encoder.encode(name).byteLength + 1

  return offset
}