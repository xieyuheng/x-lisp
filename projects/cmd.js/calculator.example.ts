import * as Cmd from "./src/index.ts"

function logger(): Cmd.Middleware {
  return (ctx, next) => {
    console.log(ctx)
    return next(ctx)
  }
}

const router = Cmd.createRouter("calculator", "0.1.0", {
  middleware: [logger()],
})

router.defineRoutes([
  "add x y -- secretly double the args",
  "mul --x --y",
])

function doubleArgs(): Cmd.Middleware {
  return (ctx, next) => {
    ctx.args = ctx.args.map((arg) => String(Number(arg) * 2))
    return next(ctx)
  }
}

router.defineHandlers({
  add: {
    middleware: [doubleArgs()],
    handler({ args: [x, y] }) {
      console.log(Number(x) + Number(y))
    },
  },
  mul: (options) => {
    console.log(Number(options["--x"]) * Number(options["--y"]))
  },
})

try {
  await router.run(process.argv.slice(2))
} catch (error) {
  console.log(error)
  process.exit(1)
}
