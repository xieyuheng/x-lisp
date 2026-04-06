import { type SourceLocation } from "@xieyuheng/sexp.js"

export type AboutImport = Import | ImportAll | ImportExcept | ImportAs

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

export type ImportAll = {
  kind: "ImportAll"
  path: string
  location?: SourceLocation
}

export function ImportAll(path: string, location?: SourceLocation): ImportAll {
  return {
    kind: "ImportAll",
    path,
    location,
  }
}

export type ImportExcept = {
  kind: "ImportExcept"
  path: string
  names: Array<string>
  location?: SourceLocation
}

export function ImportExcept(
  path: string,
  names: Array<string>,
  location?: SourceLocation,
): ImportExcept {
  return {
    kind: "ImportExcept",
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
