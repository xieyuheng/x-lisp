import * as Cli from "./src/index.ts"

function logger(): Cli.Middleware {
  return (ctx, next) => {
    console.log(ctx)
    return next(ctx)
  }
}

const router = Cli.createRouter("calculator", "0.1.0", {
  middleware: [logger()],
})

router.defineRoutes([
  "add x y -- secretly double the args",
  "mul --x --y",
])

function doubleArgs(): Cli.Middleware {
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
