import { type SourceLocation } from "@xieyuheng/sexp.js"

export type AboutImport = Import | ImportAs

export type Import = {
  kind: "Import"
  modName: string
  names: Array<string>
  location?: SourceLocation
}

export function Import(
  modName: string,
  names: Array<string>,
  location?: SourceLocation,
): Import {
  return {
    kind: "Import",
    modName,
    names,
    location,
  }
}

export type ImportAs = {
  kind: "ImportAs"
  modName: string
  prefix: string
  location?: SourceLocation
}

export function ImportAs(
  modName: string,
  prefix: string,
  location?: SourceLocation,
): ImportAs {
  return {
    kind: "ImportAs",
    modName,
    prefix,
    location,
  }
}
