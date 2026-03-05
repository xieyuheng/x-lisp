import * as L from "../index.ts"

export type CheckResult =
  | { kind: "CheckOk"; subst: L.Subst }
  | { kind: "CheckError"; exp: L.Exp; message: string }

export type CheckEffect = (subst: L.Subst) => CheckResult

export function okCheckEffect(): CheckEffect {
  return (subst) => {
    return {
      kind: "CheckOk",
      subst,
    }
  }
}

export function errorCheckEffect(exp: L.Exp, message: string): CheckEffect {
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
        // console.log("[sequenceCheckEffect]")
        // console.log("subst:")
        // console.log(L.formatSubst(subst))
        // console.log("result.subst:")
        // console.log(L.formatSubst(result.subst))
        // console.log()
        return sequenceCheckEffect(restEffects)(result.subst)
      }

      case "CheckError": {
        return result
      }
    }
  }
}
