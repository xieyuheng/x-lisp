# cli.js

A simple library for building CLI with sub-commands in Node.js.

## Example

```sh
node calculator.example.ts add 2 3
node calculator.example.ts mul --x 3 --y 4
```

```typescript
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
```

## License

[GPLv3](LICENSE)
