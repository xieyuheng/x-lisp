import * as S from "@xieyuheng/sexp.js"
import * as B from "../index.ts"

const typeNameMap: Record<string, () => B.Type> = {
  "int64-t": B.Int64Type,
  "float64-t": B.Float64Type,
  "bool-t": B.BoolType,
  "void-t": B.VoidType,
  "pointer-t": B.PointerType,
  "value-t": B.ValueType,
}

export function parseType(sexp: S.Sexp): B.Type {
  if (S.isSymbolSexp(sexp)) {
    const factory = typeNameMap[sexp.content]
    if (factory) {
      return factory()
    }
    return B.NamedType(sexp.content)
  }

  const list = S.asListSexp(sexp)
  const head = S.asSymbolSexp(list.elements[0])

  if (head.content === "->") {
    const args = list.elements.slice(1)
    if (args.length === 0) {
      throw new S.ErrorWithSourceLocation(
        "[parseType] arrow type requires at least a ret-type",
        sexp.location,
      )
    }
    const argTypes = args.slice(0, -1).map(parseType)
    const retType = parseType(args[args.length - 1])
    return B.ArrowType(argTypes, retType)
  }

  throw new S.ErrorWithSourceLocation(
    `[parseType] unknown type form: ${S.formatSexp(sexp)}`,
    sexp.location,
  )
}
