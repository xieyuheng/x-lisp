import { type SourceLocation } from "@xieyuheng/sexp.js"

export type AboutImport = Import | ImportAs

export type Import = {
  kind: "Import"
  path: string
  names: Array<string>
  location?: SourceLocation
}

export function Import(
  path: string,
  names: Array<string>,
  location?: SourceLocation,
): Import {
  return {
    kind: "Import",
    path,
    names,
    location,
  }
}

export type ImportAs = {
  kind: "ImportAs"
  path: string
  prefix: string
  location?: SourceLocation
}

export function ImportAs(
  path: string,
  prefix: string,
  location?: SourceLocation,
): ImportAs {
  return {
    kind: "ImportAs",
    path,
    prefix,
    location,
  }
}
