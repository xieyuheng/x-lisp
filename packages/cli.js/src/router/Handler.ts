import type { MaybePromise } from "@xieyuheng/std.js/promise"
import { applyMiddleware, type Middleware } from "./Middleware.ts"
import type { Route, RouteInput } from "./Route.ts"
import type { Router } from "./Router.ts"

export type HandlerArgs = Array<string>
export type HandlerArgValues = RouteInput["argValues"]
export type HandlerOptions = RouteInput["options"]
export type HandlerResult = MaybePromise<any>

export type HandlerContext = {
  router: Router
  route: Route

  path: Array<string>
  tokens: Array<string>

  args: HandlerArgs
  argValues: HandlerArgValues
  options: HandlerOptions
}

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
