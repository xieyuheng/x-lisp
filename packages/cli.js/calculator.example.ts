import * as Cli from "./src/index.ts"

function logger(): Cli.Middleware {
  return (ctx, next) => {
    console.log(ctx)
    return next(ctx)
  }
}

const router = Cli.makeRouter("calculator", "0.1.0", {
  middleware: [logger()],
})

function doubleArgs(): Cli.Middleware {
  return (ctx, next) => {
    ctx.args = ctx.args.map((arg) => String(Number(arg) * 2))
    return next(ctx)
  }
}

router.defineRoutes([
  {
    path: ["add"],
    args: ["x", "y"],
    description: "secretly double the args",
    handler: {
      middleware: [doubleArgs()],
      handler({ args: [x, y] }: Cli.HandlerContext) {
        console.log(Number(x) + Number(y))
      },
    },
  },
  {
    path: ["mul"],
    options: {
      "--x": { valueName: "x" },
      "--y": { valueName: "y" },
    },
    handler({ options }: Cli.HandlerContext) {
      console.log(Number(options["--x"]) * Number(options["--y"]))
    },
  },
])

try {
  await router.run(process.argv.slice(2))
} catch (error) {
  console.log(error)
  process.exit(1)
}
