import type { Handler } from "./Handler.ts"

export type RouteOption = {
  valueName?: string
  required?: boolean
}

export type Route = {
  path: Array<string>

  args?: Array<string>
  options?: Record<string, RouteOption>

  description?: string

  handler: Handler
}

export type RouteInput = {
  args: Array<string>
  argValues: Record<string, string>
  options: Record<string, string | true>
}

export function validateRoute(route: Route): void {
  validatePath(route.path)
  validateArgs(route.args)
  validateOptions(route.options)
}

export function routeName(route: Route): string {
  return route.path.join(" ")
}

export function formatRoute(route: Route): string {
  const parts = [...route.path]

  for (const name of route.args ?? []) {
    parts.push(`<${name}>`)
  }

  for (const [name, option] of Object.entries(route.options ?? {})) {
    if (option.valueName === undefined) {
      parts.push(name)
    } else {
      parts.push(`${name} <${option.valueName}>`)
    }
  }

  const usage = parts.join(" ")
  return route.description === undefined
    ? usage
    : `${usage} -- ${route.description}`
}

export function matchRoute(
  route: Route,
  inputTokens: Array<string>,
): RouteInput {
  const argDefinitions = route.args ?? []
  const optionDefinitions = route.options ?? {}

  const tokens = [...inputTokens]
  const args: Array<string> = []
  const argValues: Record<string, string> = {}
  const options: Record<string, string | true> = {}
  let optionsEnded = false

  while (tokens.length > 0) {
    const token = tokens.shift() as string

    if (!optionsEnded && token === "--") {
      optionsEnded = true
      continue
    }

    if (!optionsEnded && token.startsWith("-")) {
      const [name, inlineValue] = splitOptionToken(token)
      const definition = optionDefinitions[name]

      if (definition === undefined) {
        throw new Error(`${formatRoute(route)}\n  unknown option: ${name}`)
      }

      if (definition.valueName !== undefined) {
        const value = inlineValue ?? tokens.shift()
        if (value === undefined) {
          throw new Error(
            `${formatRoute(route)}\n  missing value for option: ${name} <${definition.valueName}>`,
          )
        }

        options[name] = value
      } else {
        if (inlineValue !== undefined) {
          throw new Error(
            `${formatRoute(route)}\n  option does not take a value: ${name}`,
          )
        }

        options[name] = true
      }

      continue
    }

    const argName = argDefinitions[args.length]
    if (argName === undefined) {
      throw new Error(`${formatRoute(route)}\n  unexpected argument: ${token}`)
    }

    args.push(token)
    argValues[argName] = token
  }

  if (args.length < argDefinitions.length) {
    const argName = argDefinitions[args.length] as string
    throw new Error(`${formatRoute(route)}\n  missing argument: <${argName}>`)
  }

  for (const [name, definition] of Object.entries(optionDefinitions)) {
    if (definition.required && !Object.hasOwn(options, name)) {
      throw new Error(`${formatRoute(route)}\n  missing option: ${name}`)
    }
  }

  return { args, argValues, options }
}

function validatePath(path: Array<string>): void {
  if (path.length === 0) {
    throw new Error("invalid route path: path must not be empty")
  }

  for (const token of path) {
    if (token === "" || /\s/.test(token)) {
      throw new Error(`invalid route path token: ${token}`)
    }

    if (token.startsWith("-")) {
      throw new Error(`invalid route path token: ${token}`)
    }
  }
}

function validateArgs(args: Array<string> | undefined): void {
  const names = new Set<string>()

  for (const name of args ?? []) {
    if (name === "") {
      throw new Error("route argument name must not be empty")
    }

    if (names.has(name)) {
      throw new Error(`duplicate route argument: ${name}`)
    }

    names.add(name)
  }
}

function validateOptions(
  options: Record<string, RouteOption> | undefined,
): void {
  for (const [name, option] of Object.entries(options ?? {})) {
    if (!name.startsWith("-")) {
      throw new Error(`invalid route option name: ${name}`)
    }

    if (option.valueName !== undefined && option.valueName === "") {
      throw new Error(`invalid value name for route option: ${name}`)
    }
  }
}

function splitOptionToken(
  token: string,
): [name: string, value: string | undefined] {
  const index = token.indexOf("=")
  if (index === -1) return [token, undefined]
  return [token.slice(0, index), token.slice(index + 1)]
}
