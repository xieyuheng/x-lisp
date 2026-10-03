import assert from "node:assert/strict"
import { test } from "node:test"
import { matchRoute, routeName } from "./Route.ts"
import { makeRouter } from "./Router.ts"

function makeTestRouter() {
  const router = makeRouter("test", "0.0.0")

  router.defineRoutes([
    {
      path: ["provider", "list"],
      handler() {},
    },
    {
      path: ["model", "enable"],
      args: ["model-name"],
      options: {
        "--provider": { valueName: "provider-name" },
        "--all": {},
      },
      handler() {},
    },
  ])

  return router
}

test("router matches nested routes by longest path", () => {
  const router = makeTestRouter()

  const matched = router.match([
    "model",
    "enable",
    "m1",
    "--provider",
    "deepseek",
    "--all",
  ])

  assert.ok(matched)
  assert.equal(routeName(matched.route), "model enable")
  assert.deepEqual(matched.path, ["model", "enable"])
  assert.deepEqual(matched.tokens, ["m1", "--provider", "deepseek", "--all"])
})

test("matchRoute parses args, named args, options and flags", () => {
  const router = makeTestRouter()
  const matched = router.match([
    "model",
    "enable",
    "m1",
    "--provider",
    "deepseek",
    "--all",
  ])

  assert.ok(matched)

  const input = matchRoute(matched.route, matched.tokens)

  assert.deepEqual(input.args, ["m1"])
  assert.deepEqual(input.argValues, { "model-name": "m1" })
  assert.deepEqual(input.options, {
    "--provider": "deepseek",
    "--all": true,
  })
})

test("matchRoute rejects invalid input", () => {
  const router = makeTestRouter()
  const route = router.routes["model enable"]
  assert.ok(route)

  assert.throws(() => matchRoute(route, []), /missing argument/)
  assert.throws(() => matchRoute(route, ["m1", "--nope"]), /unknown option/)
  assert.throws(() => matchRoute(route, ["m1", "extra"]), /unexpected argument/)
})
