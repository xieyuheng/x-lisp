import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import { Block } from "../block/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import * as Values from "../value/index.ts"
import { parseInstr } from "./parseInstr.ts"
import { parseMetadata } from "./parseMetadata.ts"
import { parseValue } from "./parseValue.ts"

export function parseStmt(sexp: S.Sexp): Stmt {
  return S.match(
    S.matcherChoice<Stmt>([
      S.matcher(
        "(cons* 'define-function name blocks)",
        ({ name, blocks }, { sexp }) => {
          const keyword = S.asTael(sexp).elements[1]
          const meta = S.tokenMetaFromSexpMeta(keyword.meta)
          return Stmts.DefineFunction(
            S.symbolContent(name),
            new Map(
              S.listElements(blocks)
                .map(parseBlock)
                .map((block) => [block.label, block]),
            ),
            meta,
          )
        },
      ),

      S.matcher(
        "(cons* 'define-setup name blocks)",
        ({ name, blocks }, { sexp }) => {
          const keyword = S.asTael(sexp).elements[1]
          const meta = S.tokenMetaFromSexpMeta(keyword.meta)
          return Stmts.DefineSetup(
            S.symbolContent(name),
            new Map(
              S.listElements(blocks)
                .map(parseBlock)
                .map((block) => [block.label, block]),
            ),
            meta,
          )
        },
      ),

      S.matcher("(cons* 'define-metadata name _tail)", ({ name }, { sexp }) => {
        const keyword = S.asTael(sexp).elements[1]
        const meta = S.tokenMetaFromSexpMeta(keyword.meta)
        const attributes = S.asTael(sexp).attributes
        return Stmts.DefineMetadata(
          S.symbolContent(name),
          recordMapValue(attributes, parseMetadata),
          meta,
        )
      }),

      S.matcher(
        "`(define-variable ,name ,value)",
        ({ name, value }, { sexp }) => {
          const keyword = S.asTael(sexp).elements[1]
          const meta = S.tokenMetaFromSexpMeta(keyword.meta)
          return Stmts.DefineVariable(
            S.symbolContent(name),
            parseValue(value),
            meta,
          )
        },
      ),

      S.matcher("`(define-variable ,name)", ({ name }, { sexp }) => {
        const keyword = S.asTael(sexp).elements[1]
        const meta = S.tokenMetaFromSexpMeta(keyword.meta)
        return Stmts.DefineVariable(
          S.symbolContent(name),
          Values.Undefined(),
          meta,
        )
      }),

      S.matcher("(cons* 'export names)", ({ names }, { meta }) => {
        return Stmts.Export(S.listElements(names).map(S.symbolContent), meta)
      }),

      S.matcher("`(import-all ,source)", ({ source }, { meta }) => {
        return Stmts.ImportAll(S.stringContent(source), meta)
      }),

      S.matcher("`(include-all ,source)", ({ source }, { meta }) => {
        return Stmts.IncludeAll(S.stringContent(source), meta)
      }),

      S.matcher(
        "(cons* 'import source entries)",
        ({ source, entries }, { meta }) => {
          return Stmts.Import(
            S.stringContent(source),
            S.listElements(entries).map(S.symbolContent),
            meta,
          )
        },
      ),

      S.matcher(
        "(cons* 'include source names)",
        ({ source, names }, { meta }) => {
          return Stmts.Include(
            S.stringContent(source),
            S.listElements(names).map(S.symbolContent),
            meta,
          )
        },
      ),

      S.matcher(
        "(cons* 'import-except source names)",
        ({ source, names }, { meta }) => {
          return Stmts.ImportExcept(
            S.stringContent(source),
            S.listElements(names).map(S.symbolContent),
            meta,
          )
        },
      ),

      S.matcher(
        "(cons* 'include-except source names)",
        ({ source, names }, { meta }) => {
          return Stmts.IncludeExcept(
            S.stringContent(source),
            S.listElements(names).map(S.symbolContent),
            meta,
          )
        },
      ),

      S.matcher(
        "`(import-as ,source ,prefix)",
        ({ source, prefix }, { meta }) => {
          return Stmts.ImportAs(
            S.stringContent(source),
            S.symbolContent(prefix),
            meta,
          )
        },
      ),

      S.matcher(
        "`(include-as ,source ,prefix)",
        ({ source, prefix }, { meta }) => {
          return Stmts.IncludeAs(
            S.stringContent(source),
            S.symbolContent(prefix),
            meta,
          )
        },
      ),
    ]),
    sexp,
  )
}

function parseBlock(sexp: S.Sexp): Block {
  return S.match(
    S.matcher("(cons* 'block label instrs)", ({ label, instrs }) => {
      const meta = S.tokenMetaFromSexpMeta(label.meta)
      return Block(
        S.symbolContent(label),
        S.listElements(instrs).map(parseInstr),
        meta,
      )
    }),
    sexp,
  )
}
