import * as Ppml from "@xieyuheng/ppml.js"
import { formatSexp } from "../format/index.ts"
import * as S from "../index.ts"
import { defaultConfig } from "./defaultConfig.ts"

export type Config = {
  keywords: Array<KeywordConfig>
}

type KeywordConfig = [name: string, headerLength: number]

export function formatPrettySexp(
  width: number,
  sexp: S.Sexp,
  config: Config = defaultConfig,
): string {
  return Ppml.format(prettySexp(sexp)(config), { width })
}

type Prettier = (config: Config) => Ppml.Node

export function prettySexp(sexp: S.Sexp): Prettier {
  return (config) => {
    if (
      S.isSymbolSexp(sexp) ||
      S.isStringSexp(sexp) ||
      S.isIntSexp(sexp) ||
      S.isFloatSexp(sexp) ||
      S.isKeywordSexp(sexp)
    ) {
      return Ppml.text(formatSexp(sexp))
    }

    if (sexp.elements.length === 0) {
      return Ppml.text("()")
    }

    const [first, ...rest] = sexp.elements

    if (first.kind === "SymbolSexp" && rest.length === 1) {
      switch (first.content) {
        case "@quote":
          return Ppml.concat(Ppml.text("'"), prettySexp(rest[0])(config))
        case "@unquote":
          return Ppml.concat(Ppml.text(","), prettySexp(rest[0])(config))
        case "@quasiquote":
          return Ppml.concat(Ppml.text("`"), prettySexp(rest[0])(config))
      }
    }

    if (first.kind === "SymbolSexp") {
      switch (first.content) {
        case "@set":
          return prettySet(rest)(config)
        case "@square-bracket":
          return prettyList(rest)(config)
      }
    }

    const keywordConfig = findKeywordConfig(config, first)
    if (keywordConfig !== undefined) {
      const [name, headerLength] = keywordConfig
      return prettySyntax(
        name,
        rest.slice(0, headerLength),
        rest.slice(headerLength),
      )(config)
    }

    return prettyApplication(sexp.elements)(config)
  }
}

function prettySet(elements: Array<S.Sexp>): Prettier {
  return (config) => {
    const bodyNode = Ppml.group(
      Ppml.indent(
        1,
        Ppml.flex(elements.map((element) => prettySexp(element)(config))),
      ),
    )

    return Ppml.group(Ppml.text("(@set"), bodyNode, Ppml.text(")"))
  }
}

function prettyList(elements: Array<S.Sexp>): Prettier {
  return (config) => {
    if (elements.length === 0) {
      return Ppml.group(Ppml.text("["), Ppml.text("]"))
    } else {
      const bodyNode = Ppml.group(
        Ppml.indent(
          1,
          Ppml.flex(elements.map((element) => prettySexp(element)(config))),
        ),
      )

      return Ppml.group(Ppml.text("["), bodyNode, Ppml.text("]"))
    }
  }
}

function findKeywordConfig(
  config: Config,
  sexp: S.Sexp,
): KeywordConfig | undefined {
  if (sexp.kind === "SymbolSexp") {
    return config.keywords.find(([name]) => name === sexp.content)
  }
}

function prettySyntax(
  name: string,
  header: Array<S.Sexp>,
  body: Array<S.Sexp>,
): Prettier {
  return (config) => {
    const headNode = Ppml.indent(
      4,
      Ppml.wrap([
        Ppml.text(name),
        ...header.map((sexp) => prettySexp(sexp)(config)),
      ]),
    )

    const bodyNode =
      body.length === 0
        ? Ppml.nil()
        : Ppml.indent(
            2,
            Ppml.br(),
            Ppml.flex(body.map((sexp) => prettySexp(sexp)(config))),
          )

    return Ppml.group(Ppml.text("("), headNode, bodyNode, Ppml.text(")"))
  }
}

function prettyApplication(elements: Array<S.Sexp>): Prettier {
  return (config) => {
    // "short target" heuristic -- for `and` `or` `->` `*->`
    const shortLength = 3
    const [head, ...rest] = elements
    if (head.kind === "SymbolSexp" && head.content.length <= shortLength) {
      // +1 for "("
      // +1 for " "
      const indentation = head.content.length + 2
      const bodyNode =
        rest.length === 0
          ? Ppml.text(head.content)
          : Ppml.group(
              Ppml.indent(
                indentation,
                Ppml.text(head.content),
                Ppml.text(" "),
                Ppml.flex(rest.map((element) => prettySexp(element)(config))),
              ),
            )
      return Ppml.group(Ppml.text("("), bodyNode, Ppml.text(")"))
    }

    const bodyNode = Ppml.group(
      Ppml.indent(
        1,
        Ppml.flex(elements.map((element) => prettySexp(element)(config))),
      ),
    )

    return Ppml.group(Ppml.text("("), bodyNode, Ppml.text(")"))
  }
}

function prettyAttribute([key, sexp]: [string, S.Sexp]): Prettier {
  return (config) => {
    return Ppml.group(Ppml.text(`:${key}`), Ppml.br(), prettySexp(sexp)(config))
  }
}

function prettyAttributes(attributes: Record<string, S.Sexp>): Prettier {
  return (config) => {
    return Ppml.flex(
      Object.entries(attributes).map((entry) => prettyAttribute(entry)(config)),
    )
  }
}
