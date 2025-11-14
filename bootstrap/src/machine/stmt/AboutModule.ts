import { type TokenMeta as Meta } from "@xieyuheng/x-sexp.js"

export type AboutModule = Export | Extern

export type Export = {
  kind: "Export"
  names: Array<string>
  meta: Meta
}

export function Export(names: Array<string>, meta: Meta): Export {
  return {
    kind: "Export",
    names,
    meta,
  }
}

export type Extern = {
  kind: "Extern"
  names: Array<string>
  meta: Meta
}

export function Extern(names: Array<string>, meta: Meta): Extern {
  return {
    kind: "Extern",
    names,
    meta,
  }
}
