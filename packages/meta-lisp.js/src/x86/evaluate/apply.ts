import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function apply(
  mod: X86.Mod,
  env: X86.Env,
  target: X86.Value,
  args: Array<X86.Value>,
  location: S.SourceLocation,
): X86.Value {
  if (X86.isTypeConstructorValue(target)) {
    const typeCtor = target.typeConstructor
    if (args.length !== typeCtor.parameters.length) {
      let message = `[apply] type constructor ${typeCtor.name} expects ${typeCtor.parameters.length} arguments, got ${args.length}`
      throw new S.ErrorWithSourceLocation(message, location)
    }
    const argTypes = args.map((arg) => X86.asTypeValue(arg).type)
    return X86.TypeValue(X86.DataType(typeCtor, argTypes))
  }

  let message = `[apply] cannot apply non-callable value: ${target.kind}`
  throw new S.ErrorWithSourceLocation(message, location)
}
