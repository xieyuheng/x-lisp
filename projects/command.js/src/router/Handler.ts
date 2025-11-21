import type { MaybePromise } from "../helpers/promise/index.ts"
import { applyMiddleware, type Middleware } from "./Middleware.ts"
import type { Route } from "./Route.ts"
import type { Router } from "./Router.ts"

export type HandlerArgs = Array<any>
export type HandlerOptions = Record<string, any>
export type HandlerResult = MaybePromise<any>

export type HandlerContext = {
  router: Router
  route: Route
  tokens: Array<string>
  args: HandlerArgs
  options: HandlerOptions
}

export type Handlers = Record<string, Handler>

export type Handler = HandlerFunction | HandlerObject

export type HandlerObject = {
  middleware: Middleware
  handler: Handler
}

export type HandlerFunction = (context: HandlerContext) => HandlerResult

export function applyHandler(handler: Handler): HandlerFunction {
  if (handler instanceof Function) {
    return handler
  } else {
    return applyMiddleware(handler.middleware, applyHandler(handler.handler))
  }
}
