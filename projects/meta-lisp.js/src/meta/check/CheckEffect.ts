import * as M from "../index.ts"

export type CheckResult =
  | { kind: "CheckOk"; subst: M.Subst }
  | { kind: "CheckError"; exp: M.Exp; message: string }

export type CheckEffect = (subst: M.Subst) => CheckResult

export function okCheckEffect(): CheckEffect {
  return (subst) => {
    return {
      kind: "CheckOk",
      subst,
    }
  }
}

export function errorCheckEffect(exp: M.Exp, message: string): CheckEffect {
  return () => {
    return {
      kind: "CheckError",
      exp,
      message,
    }
  }
}

export function sequenceCheckEffect(effects: Array<CheckEffect>): CheckEffect {
  if (effects.length === 0) {
    return okCheckEffect()
  }

  const [effect, ...restEffects] = effects

  if (restEffects.length === 0) {
    return effect
  }

  return (subst) => {
    const result = effect(subst)
    switch (result.kind) {
      case "CheckOk": {
        return sequenceCheckEffect(restEffects)(result.subst)
      }

      case "CheckError": {
        return result
      }
    }
  }
}
