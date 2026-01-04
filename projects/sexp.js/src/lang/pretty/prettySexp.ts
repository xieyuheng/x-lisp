import { recordIsEmpty } from "@xieyuheng/helpers.js/record"
import * as Ppml from "@xieyuheng/ppml.js"
import { formatSexp } from "../format/index.ts"
import { isAtom, type Sexp } from "../sexp/index.ts"
import { defaultConfig } from "./defaultConfig.ts"

export type Config = {
  keywords: Array<KeywordConfig>
}

type KeywordConfig = [name: string, headerLength: number]

export function prettySexp(
  width: number,
  sexp: Sexp,
  config: Config = defaultConfig,
): string {
  return Ppml.format(width, renderSexp(sexp)(config))
}

type Render = (config: Config) => Ppml.Node

export function renderSexp(sexp: Sexp): Render {
  return (config) => {
    if (isAtom(sexp)) {
      return Ppml.text(formatSexp(sexp))
    }

    if (sexp.elements.length === 0) {
      return renderElementLess(sexp.attributes)(config)
    }

    const [first, ...rest] = sexp.elements

    if (first.kind === "Symbol" && rest.length === 1) {
      switch (first.content) {
        case "@quote":
          return Ppml.concat(Ppml.text("'"), renderSexp(rest[0])(config))
        case "@unquote":
          return Ppml.concat(Ppml.text(","), renderSexp(rest[0])(config))
        case "@quasiquote":
          return Ppml.concat(Ppml.text("`"), renderSexp(rest[0])(config))
      }
    }

    if (first.kind === "Symbol") {
      switch (first.content) {
        case "@set":
          return renderSet(rest)(config)
        case "@tael":
          return renderTael(rest, sexp.attributes)(config)
      }
    }

    const keywordConfig = findKeywordConfig(config, first)
    if (keywordConfig !== undefined) {
      const [name, headerLength] = keywordConfig
      return renderSyntax(
        name,
        rest.slice(0, headerLength),
        rest.slice(headerLength),
        sexp.attributes,
      )(config)
    }

    return renderApplication(sexp.elements, sexp.attributes)(config)
  }
}

function renderSet(elements: Array<Sexp>): Render {
  return (config) => {
    const bodyNode = Ppml.group(
      Ppml.indent(
        1,
        Ppml.flex(elements.map((element) => renderSexp(element)(config))),
      ),
    )

    return Ppml.group(Ppml.text("{"), bodyNode, Ppml.text("}"))
  }
}

function renderTael(
  elements: Array<Sexp>,
  attributes: Record<string, Sexp>,
): Render {
  return (config) => {
    if (elements.length === 0) {
      const bodyNode = recordIsEmpty(attributes)
        ? Ppml.nil()
        : Ppml.group(Ppml.indent(1, renderAttributes(attributes)(config)))

      return Ppml.group(Ppml.text("["), bodyNode, Ppml.text("]"))
    } else {
      const bodyNode = Ppml.group(
        Ppml.indent(
          1,
          Ppml.flex(elements.map((element) => renderSexp(element)(config))),
        ),
      )

      const footNode = recordIsEmpty(attributes)
        ? Ppml.nil()
        : Ppml.group(
            Ppml.indent(1, Ppml.br(), renderAttributes(attributes)(config)),
          )

      return Ppml.group(Ppml.text("["), bodyNode, footNode, Ppml.text("]"))
    }
  }
}

function findKeywordConfig(
  config: Config,
  sexp: Sexp,
): KeywordConfig | undefined {
  if (sexp.kind === "Symbol") {
    return config.keywords.find(([name]) => name === sexp.content)
  }
}

function renderSyntax(
  name: string,
  header: Array<Sexp>,
  body: Array<Sexp>,
  attributes: Record<string, Sexp>,
): Render {
  return (config) => {
    const headNode = Ppml.indent(
      4,
      Ppml.wrap([
        Ppml.text(name),
        ...header.map((sexp) => renderSexp(sexp)(config)),
      ]),
    )

    const neckNode = recordIsEmpty(attributes)
      ? Ppml.nil()
      : Ppml.group(
          Ppml.indent(2, Ppml.br(), renderAttributes(attributes)(config)),
        )

    const bodyNode =
      body.length === 0
        ? Ppml.nil()
        : Ppml.indent(
            2,
            Ppml.br(),
            Ppml.flex(body.map((sexp) => renderSexp(sexp)(config))),
          )

    return Ppml.group(
      Ppml.text("("),
      headNode,
      neckNode,
      bodyNode,
      Ppml.text(")"),
    )
  }
}

function renderApplication(
  elements: Array<Sexp>,
  attributes: Record<string, Sexp>,
): Render {
  return (config) => {
    // "short target" heuristic -- for `and` `or` `->` `*->`
    const shortLength = 3
    const [head, ...rest] = elements
    if (head.kind === "Symbol" && head.content.length <= shortLength) {
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
                Ppml.flex(rest.map((element) => renderSexp(element)(config))),
              ),
            )

      const footNode = recordIsEmpty(attributes)
        ? Ppml.nil()
        : Ppml.group(
            Ppml.indent(
              indentation,
              Ppml.br(),
              renderAttributes(attributes)(config),
            ),
          )

      return Ppml.group(Ppml.text("("), bodyNode, footNode, Ppml.text(")"))
    }

    const bodyNode = Ppml.group(
      Ppml.indent(
        1,
        Ppml.flex(elements.map((element) => renderSexp(element)(config))),
      ),
    )

    const footNode = recordIsEmpty(attributes)
      ? Ppml.nil()
      : Ppml.group(
          Ppml.indent(1, Ppml.br(), renderAttributes(attributes)(config)),
        )

    return Ppml.group(Ppml.text("("), bodyNode, footNode, Ppml.text(")"))
  }
}

function renderElementLess(attributes: Record<string, Sexp>): Render {
  return (config) => {
    return recordIsEmpty(attributes)
      ? Ppml.text("()")
      : Ppml.group(
          Ppml.text("("),
          Ppml.indent(1, renderAttributes(attributes)(config)),
          Ppml.text(")"),
        )
  }
}

function renderAttribute([key, sexp]: [string, Sexp]): Render {
  return (config) => {
    return Ppml.group(Ppml.text(`:${key}`), Ppml.br(), renderSexp(sexp)(config))
  }
}

function renderAttributes(attributes: Record<string, Sexp>): Render {
  return (config) => {
    return Ppml.flex(
      Object.entries(attributes).map((entry) => renderAttribute(entry)(config)),
    )
  }
}
