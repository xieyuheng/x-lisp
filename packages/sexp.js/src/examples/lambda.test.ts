import { errorReport } from "@xieyuheng/helpers.js/error"
import { snapshot } from "@xieyuheng/helpers.js/snapshot"
import assert from "node:assert"
import Path from "node:path"
import { test } from "node:test"
import { fileURLToPath } from "node:url"
import * as S from "../index.ts"

const currentDir = Path.dirname(fileURLToPath(import.meta.url))
const snapshotDir = Path.join(currentDir, "..", "..", "snapshot")

type Exp = Var | Lambda | Apply | Let
type Var = { kind: "Var"; name: string }
type Lambda = { kind: "Lambda"; name: string; ret: Exp }
type Apply = { kind: "Apply"; target: Exp; arg: Exp }
type Let = { kind: "Let"; name: string; rhs: Exp; body: Exp }

function Var(name: string): Var {
  return { kind: "Var", name }
}

function Lambda(name: string, ret: Exp): Lambda {
  return { kind: "Lambda", name, ret }
}

function Apply(target: Exp, arg: Exp): Apply {
  return { kind: "Apply", target, arg }
}

function Let(name: string, rhs: Exp, body: Exp): Let {
  return { kind: "Let", name, rhs, body }
}

const parseExp: S.Router<Exp> = S.createRouter<Exp>({
  "`(lambda (,name) ,ret)": ({ name, ret }) =>
    Lambda(S.asSymbolSexp(name).content, parseExp(ret)),
  "`(let ((,name ,rhs)) ,body)": ({ name, rhs, body }) =>
    Let(S.asSymbolSexp(name).content, parseExp(rhs), parseExp(body)),
  "`(,target ,arg)": ({ target, arg }) =>
    Apply(parseExp(target), parseExp(arg)),
  name: ({ name }, { location }) => {
    const nameSymbol = S.asSymbolSexp(name).content
    if (keywords.includes(nameSymbol)) {
      let message = "keywork should not be used as variable\n"
      throw new S.ErrorWithSourceLocation(message, location)
    }
    return Var(nameSymbol)
  },
})

const keywords = ["lambda", "let"]

function assertParse(text: string, exp: Exp): void {
  const path = "test:lambda"
  assert.deepStrictEqual(parseExp(S.parseSexp(text, { path })), exp)
}

test("examples/lambda", () => {
  assertParse("x", Var("x"))

  assertParse("(f x)", Apply(Var("f"), Var("x")))

  assertParse("(lambda (x) x)", Lambda("x", Var("x")))

  assertParse(
    "((lambda (x) x) (lambda (x) x))",
    Apply(Lambda("x", Var("x")), Lambda("x", Var("x"))),
  )

  assertParse(
    "(let ((id (lambda (x) x))) (id id))",
    Let("id", Lambda("x", Var("x")), Apply(Var("id"), Var("id"))),
  )
})

function assertErrorWithSourceLocation(text: string): string {
  try {
    const path = "test:lambda"
    parseExp(S.parseSexp(text, { path }))
    return ""
  } catch (error) {
    return errorReport(error)
  }
}

test("examples/lambda -- parsing errors", () => {
  const errors: Array<string> = []
  errors.push(assertErrorWithSourceLocation("(f x"))
  errors.push(assertErrorWithSourceLocation("(f x\n(g y)"))
  errors.push(assertErrorWithSourceLocation("f x)"))
  errors.push(assertErrorWithSourceLocation("(lambda x)"))
  snapshot(snapshotDir, "examples/lambda.test.out", errors.join(""))
})
