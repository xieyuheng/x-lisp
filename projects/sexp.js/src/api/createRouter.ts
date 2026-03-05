import * as S from "../lang/index.ts"

export type Router<A> = (sexp: S.Sexp) => A
export type Routes<A> = Record<string, S.MatcherCallback<A>>

export function createRouter<A>(routes: Routes<A>): Router<A> {
  const matchers = Object.entries(routes).map(([patternText, f]) =>
    S.matcher(patternText, f),
  )
  const matcher = S.matcherChoice<A>(matchers)
  return (sexp) => S.match(matcher, sexp)
}
