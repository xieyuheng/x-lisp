import { applyHandler } from "./Handler.ts"
import { applyMiddleware, type Middleware } from "./Middleware.ts"
import {
  formatRoute,
  matchRoute,
  routeName,
  validateRoute,
  type Route,
} from "./Route.ts"

export type RouterOptions = {
  middleware?: Middleware
}

export type RouteMatch = {
  route: Route
  path: Array<string>
  tokens: Array<string>
}

export function makeRouter(
  name: string,
  version: string,
  options: RouterOptions = {},
): Router {
  return new Router(name, version, options)
}

export class Router {
  name: string
  version: string
  middleware: Middleware

  routes: Record<string, Route> = {}

  constructor(name: string, version: string, options: RouterOptions = {}) {
    this.name = name
    this.version = version
    this.middleware = options.middleware || []
  }

  defineRoute(route: Route): void {
    validateRoute(route)

    const name = routeName(route)

    if (Object.hasOwn(this.routes, name)) {
      throw new Error(`duplicate route: ${name}`)
    }

    this.routes[name] = route
  }

  defineRoutes(routes: Array<Route>): void {
    for (const route of routes) {
      this.defineRoute(route)
    }
  }

  match(argv: Array<string>): RouteMatch | undefined {
    const candidates = Object.values(this.routes).filter((route) =>
      isPathPrefix(route.path, argv),
    )

    if (candidates.length === 0) return undefined

    candidates.sort((a, b) => b.path.length - a.path.length)
    const route = candidates[0] as Route

    return {
      route,
      path: route.path,
      tokens: argv.slice(route.path.length),
    }
  }

  async run(argv: Array<string>): Promise<void> {
    if (argv.length === 0) {
      this.printNameAndVersion()
      this.printCommands()
      return
    }

    const matched = this.match(argv)

    if (matched === undefined) {
      const groupRoutes = Object.values(this.routes).filter((route) =>
        isPathPrefix(argv, route.path),
      )

      if (groupRoutes.length > 0) {
        this.printNameAndVersion()
        this.printCommands(argv)
        return
      }

      this.printNameAndVersion()
      console.log(`unknown command: ${argv.join(" ")}`)
      this.printCommands()
      return
    }

    const input = matchRoute(matched.route, matched.tokens)

    await applyMiddleware(
      this.middleware,
      applyHandler(matched.route.handler),
    )({
      args: input.args,
      argValues: input.argValues,
      options: input.options,
      router: this,
      route: matched.route,
      path: matched.path,
      tokens: matched.tokens,
    })
  }

  printNameAndVersion(): void {
    console.log(`${this.name} ${this.version}`)
  }

  printCommands(prefix: Array<string> = []): void {
    const routes = Object.values(this.routes).filter((route) =>
      isPathPrefix(prefix, route.path),
    )

    if (routes.length === 0) return

    console.log(`commands:`)
    for (const route of routes) {
      console.log(`  ${formatRoute(route)}`)
    }
  }
}

function isPathPrefix(prefix: Array<string>, path: Array<string>): boolean {
  if (prefix.length > path.length) return false
  return prefix.every((token, index) => path[index] === token)
}
