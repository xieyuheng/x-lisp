import assert from "node:assert"
import * as S from "../index.ts"

export type Matcher<A> = (sexp: S.Sexp) => A | undefined

export type MatcherCallback<A> = (
  subst: S.Subst,
  options: { sexp: S.Sexp; location: S.SourceLocation },
) => A | undefined

export function matcher<A>(
  patternText: string,
  f: MatcherCallback<A>,
): Matcher<A> {
  const pattern = S.parseSexp(patternText, { path: "[matcher]" })
  return (sexp) => {
    const subst = S.matchSexp("NormalMode", pattern, sexp)({})
    if (!subst) return undefined
    assert(sexp.location)
    return f(subst, {
      sexp: sexp,
      location: sexp.location as S.SourceLocation,
    })
  }
}

export function matcherChoice<A>(matchers: Array<Matcher<A>>): Matcher<A> {
  return (sexp) => {
    for (const matcher of matchers) {
      const result = matcher(sexp)
      if (result) return result
    }
  }
}

export function match<A>(matcher: Matcher<A>, sexp: S.Sexp): A {
  const result = matcher(sexp)
  if (result === undefined) throw new Error("match fail")
  else return result
}
