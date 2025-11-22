import * as S from "../sexp/index.ts"

export type Subst = Record<string, S.Sexp>
export type Mode = "NormalMode" | "QuoteMode" | "QuasiquoteMode"
export type Effect = (subst: Subst) => Subst | void

export function matchSexp(mode: Mode, pattern: S.Sexp, sexp: S.Sexp): Effect {
  return choiceEffect([
    matchString(mode, pattern, sexp),
    matchHashtag(mode, pattern, sexp),
    matchSymbol(mode, pattern, sexp),
    matchInt(mode, pattern, sexp),
    matchFloat(mode, pattern, sexp),
    matchList(mode, pattern, sexp),
  ])
}

function matchSymbol(mode: Mode, pattern: S.Sexp, sexp: S.Sexp): Effect {
  switch (mode) {
    case "NormalMode": {
      return ifEffect(pattern.kind === "Symbol", ({ subst }) => {
        const key = S.asSymbol(pattern).content
        const foundSexp = subst[key]
        return (subst) => {
          if (foundSexp) {
            return guardEffect(() => S.sexpEqual(foundSexp, sexp))(subst)
          } else {
            return { ...subst, [key]: sexp }
          }
        }
      })
    }

    case "QuoteMode":
    case "QuasiquoteMode": {
      return guardEffect(
        () =>
          pattern.kind === "Symbol" &&
          sexp.kind === "Symbol" &&
          pattern.content === sexp.content,
      )
    }
  }
}

function matchString(mode: Mode, pattern: S.Sexp, sexp: S.Sexp): Effect {
  return guardEffect(
    () =>
      pattern.kind === "String" &&
      sexp.kind === "String" &&
      pattern.content === sexp.content,
  )
}

function matchHashtag(mode: Mode, pattern: S.Sexp, sexp: S.Sexp): Effect {
  return guardEffect(
    () =>
      pattern.kind === "Hashtag" &&
      sexp.kind === "Hashtag" &&
      pattern.content === sexp.content,
  )
}

function matchInt(mode: Mode, pattern: S.Sexp, sexp: S.Sexp): Effect {
  return guardEffect(
    () =>
      pattern.kind === "Int" &&
      sexp.kind === "Int" &&
      pattern.content === sexp.content,
  )
}

function matchFloat(mode: Mode, pattern: S.Sexp, sexp: S.Sexp): Effect {
  return guardEffect(
    () =>
      pattern.kind === "Float" &&
      sexp.kind === "Float" &&
      pattern.content === sexp.content,
  )
}

function matchAttributes(
  mode: Mode,
  patternAttributes: S.Attributes,
  sexpAttributes: S.Attributes,
): Effect {
  return sequenceEffect(
    Object.keys(patternAttributes).map((key) =>
      ifEffect(Boolean(sexpAttributes[key]), () =>
        matchSexp(mode, patternAttributes[key], sexpAttributes[key]),
      ),
    ),
  )
}

function matchList(mode: Mode, pattern: S.Sexp, sexp: S.Sexp): Effect {
  switch (mode) {
    case "NormalMode": {
      return choiceEffect([
        matchTael(mode, pattern, sexp),
        matchQuote(mode, pattern, sexp),
        matchQuasiquote(mode, pattern, sexp),
        matchCons(mode, pattern, sexp),
        matchConsStar(mode, pattern, sexp),
      ])
    }

    case "QuoteMode": {
      return matchQuotedList(mode, pattern, sexp)
    }

    case "QuasiquoteMode": {
      return choiceEffect([
        matchUnquote(mode, pattern, sexp),
        matchQuotedList(mode, pattern, sexp),
      ])
    }
  }
}

function matchManySexp(
  mode: Mode,
  patternArray: Array<S.Sexp>,
  sexpArray: Array<S.Sexp>,
): Effect {
  return sequenceEffect([
    guardEffect(() => patternArray.length === sexpArray.length),
    ...patternArray
      .keys()
      .map((index) => matchSexp(mode, patternArray[index], sexpArray[index])),
  ])
}

function matchQuotedList(mode: Mode, pattern: S.Sexp, sexp: S.Sexp): Effect {
  return ifEffect(
    pattern.kind === "Tael" &&
      sexp.kind === "Tael" &&
      pattern.elements.length === sexp.elements.length,
    () =>
      sequenceEffect([
        matchManySexp(
          mode,
          S.asTael(pattern).elements,
          S.asTael(sexp).elements,
        ),
        matchAttributes(
          mode,
          S.asTael(pattern).attributes,
          S.asTael(sexp).attributes,
        ),
      ]),
  )
}

function matchUnquote(mode: Mode, pattern: S.Sexp, sexp: S.Sexp): Effect {
  return ifEffect(
    pattern.kind === "Tael" &&
      pattern.elements.length >= 2 &&
      pattern.elements[0].kind === "Symbol" &&
      pattern.elements[0].content === "@unquote",
    () => {
      const firstSexp = S.asTael(pattern).elements[1]
      return sequenceEffect([matchSexp("NormalMode", firstSexp, sexp)])
    },
  )
}

function matchTael(mode: Mode, pattern: S.Sexp, sexp: S.Sexp): Effect {
  return ifEffect(
    pattern.kind === "Tael" &&
      sexp.kind === "Tael" &&
      pattern.elements.length >= 1 &&
      pattern.elements[0].kind === "Symbol" &&
      pattern.elements[0].content === "@tael",
    () => {
      const patternBody = S.asTael(pattern).elements.slice(1)
      const sexpBody = S.asTael(sexp).elements
      return sequenceEffect([
        guardEffect(() => patternBody.length === sexpBody.length),
        ...patternBody
          .keys()
          .map((index) => matchSexp(mode, patternBody[index], sexpBody[index])),
        matchAttributes(
          mode,
          S.asTael(pattern).attributes,
          S.asTael(sexp).attributes,
        ),
      ])
    },
  )
}

function matchQuote(mode: Mode, pattern: S.Sexp, sexp: S.Sexp): Effect {
  return ifEffect(
    pattern.kind === "Tael" &&
      pattern.elements.length >= 2 &&
      pattern.elements[0].kind === "Symbol" &&
      pattern.elements[0].content === "@quote",
    () => {
      const firstSexp = S.asTael(pattern).elements[1]
      return sequenceEffect([matchSexp("QuoteMode", firstSexp, sexp)])
    },
  )
}

function matchQuasiquote(mode: Mode, pattern: S.Sexp, sexp: S.Sexp): Effect {
  return ifEffect(
    pattern.kind === "Tael" &&
      pattern.elements.length >= 2 &&
      pattern.elements[0].kind === "Symbol" &&
      pattern.elements[0].content === "@quasiquote",
    () => {
      const firstSexp = S.asTael(pattern).elements[1]
      return sequenceEffect([matchSexp("QuasiquoteMode", firstSexp, sexp)])
    },
  )
}

function matchCons(mode: Mode, pattern: S.Sexp, sexp: S.Sexp): Effect {
  return ifEffect(
    pattern.kind === "Tael" &&
      sexp.kind === "Tael" &&
      pattern.elements.length === 3 &&
      pattern.elements[0].kind === "Symbol" &&
      pattern.elements[0].content === "cons",
    () => {
      const listPattern = S.asTael(pattern)
      const headPattern = listPattern.elements[1]
      const tailPattern = listPattern.elements[2]

      const listSexp = S.asTael(sexp)
      if (listSexp.elements.length === 0) return failEffect()
      const headSexp = listSexp.elements[0]
      const tailSexp = S.Tael(listSexp.elements.slice(1), {})

      return sequenceEffect([
        matchSexp(mode, headPattern, headSexp),
        matchSexp(mode, tailPattern, tailSexp),
      ])
    },
  )
}

function matchConsStar(mode: Mode, pattern: S.Sexp, sexp: S.Sexp): Effect {
  return ifEffect(
    pattern.kind === "Tael" &&
      sexp.kind === "Tael" &&
      pattern.elements.length >= 3 &&
      pattern.elements[0].kind === "Symbol" &&
      pattern.elements[0].content === "cons*",
    () => {
      const listPattern = S.asTael(pattern)
      const prefixCount = listPattern.elements.length - 2
      const patternPrefix = listPattern.elements.slice(1, prefixCount + 1)
      const tailPattern = listPattern.elements[listPattern.elements.length - 1]

      const listSexp = S.asTael(sexp)
      if (listSexp.elements.length < prefixCount) return failEffect()
      const sexpPrefix = listSexp.elements.slice(0, prefixCount)
      const tailSexp = S.Tael(listSexp.elements.slice(prefixCount), {})

      return sequenceEffect([
        matchManySexp(mode, patternPrefix, sexpPrefix),
        matchSexp(mode, tailPattern, tailSexp),
      ])
    },
  )
}

// effect combinators

function choiceEffect(effects: Array<Effect>): Effect {
  return (subst) => {
    for (const effect of effects) {
      const newSubst = effect(subst)
      if (newSubst) return newSubst
    }
  }
}

function sequenceEffect(effects: Array<Effect>): Effect {
  return (subst) => {
    for (const effect of effects) {
      const newSubst = effect(subst)
      if (!newSubst) return
      subst = newSubst
    }

    return subst
  }
}

function guardEffect(p: () => boolean): Effect {
  return (subst) => {
    if (p()) return subst
  }
}

function ifEffect(
  p: boolean,
  f: (options: { subst: Subst }) => Effect,
): Effect {
  return sequenceEffect([guardEffect(() => p), (subst) => f({ subst })(subst)])
}

function failEffect(): Effect {
  return guardEffect(() => false)
}
