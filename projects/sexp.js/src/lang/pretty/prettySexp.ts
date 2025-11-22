import { recordIsEmpty } from "@xieyuheng/helpers.js/record"
import * as pp from "../../ppml/index.ts"
import { formatSexp } from "../format/index.ts"
import { isAtom, type Sexp } from "../sexp/index.ts"
import { defaultConfig } from "./defaultConfig.ts"

export type Config = {
  keywords: Array<KeywordConfig>
}

type KeywordConfig = [name: string, headerLength: number]

export function prettySexp(
  maxWidth: number,
  sexp: Sexp,
  config: Config = defaultConfig,
): string {
  return pp.format(maxWidth, renderSexp(sexp)(config))
}

type Render = (config: Config) => pp.Node

export function renderSexp(sexp: Sexp): Render {
  return (config) => {
    if (isAtom(sexp)) {
      return pp.text(formatSexp(sexp))
    }

    if (sexp.elements.length === 0) {
      return renderElementLess(sexp.attributes)(config)
    }

    const [first, ...rest] = sexp.elements

    if (first.kind === "Symbol" && rest.length === 1) {
      switch (first.content) {
        case "@quote":
          return pp.concat(pp.text("'"), renderSexp(rest[0])(config))
        case "@unquote":
          return pp.concat(pp.text(","), renderSexp(rest[0])(config))
        case "@quasiquote":
          return pp.concat(pp.text("`"), renderSexp(rest[0])(config))
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
    const bodyNode = pp.group(
      pp.indent(
        1,
        pp.flex(elements.map((element) => renderSexp(element)(config))),
      ),
    )

    return pp.group(pp.text("{"), bodyNode, pp.text("}"))
  }
}

function renderTael(
  elements: Array<Sexp>,
  attributes: Record<string, Sexp>,
): Render {
  return (config) => {
    if (elements.length === 0) {
      const bodyNode = recordIsEmpty(attributes)
        ? pp.nil()
        : pp.group(pp.indent(1, renderAttributes(attributes)(config)))

      return pp.group(pp.text("["), bodyNode, pp.text("]"))
    } else {
      const bodyNode = pp.group(
        pp.indent(
          1,
          pp.flex(elements.map((element) => renderSexp(element)(config))),
        ),
      )

      const footNode = recordIsEmpty(attributes)
        ? pp.nil()
        : pp.group(pp.indent(1, pp.br(), renderAttributes(attributes)(config)))

      return pp.group(pp.text("["), bodyNode, footNode, pp.text("]"))
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
    const headNode = pp.indent(
      4,
      pp.wrap([
        pp.text(name),
        ...header.map((sexp) => renderSexp(sexp)(config)),
      ]),
    )

    const neckNode = recordIsEmpty(attributes)
      ? pp.nil()
      : pp.group(pp.indent(2, pp.br(), renderAttributes(attributes)(config)))

    const bodyNode =
      body.length === 0
        ? pp.nil()
        : pp.indent(
            2,
            pp.br(),
            pp.flex(body.map((sexp) => renderSexp(sexp)(config))),
          )

    return pp.group(pp.text("("), headNode, neckNode, bodyNode, pp.text(")"))
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
          ? pp.text(head.content)
          : pp.group(
              pp.indent(
                indentation,
                pp.text(head.content),
                pp.text(" "),
                pp.flex(rest.map((element) => renderSexp(element)(config))),
              ),
            )

      const footNode = recordIsEmpty(attributes)
        ? pp.nil()
        : pp.group(
            pp.indent(
              indentation,
              pp.br(),
              renderAttributes(attributes)(config),
            ),
          )

      return pp.group(pp.text("("), bodyNode, footNode, pp.text(")"))
    }

    const bodyNode = pp.group(
      pp.indent(
        1,
        pp.flex(elements.map((element) => renderSexp(element)(config))),
      ),
    )

    const footNode = recordIsEmpty(attributes)
      ? pp.nil()
      : pp.group(pp.indent(1, pp.br(), renderAttributes(attributes)(config)))

    return pp.group(pp.text("("), bodyNode, footNode, pp.text(")"))
  }
}

function renderElementLess(attributes: Record<string, Sexp>): Render {
  return (config) => {
    return recordIsEmpty(attributes)
      ? pp.text("()")
      : pp.group(
          pp.text("("),
          pp.indent(1, renderAttributes(attributes)(config)),
          pp.text(")"),
        )
  }
}

function renderAttribute([key, sexp]: [string, Sexp]): Render {
  return (config) => {
    return pp.group(pp.text(`:${key}`), pp.br(), renderSexp(sexp)(config))
  }
}

function renderAttributes(attributes: Record<string, Sexp>): Render {
  return (config) => {
    return pp.flex(
      Object.entries(attributes).map((entry) => renderAttribute(entry)(config)),
    )
  }
}
