import type {
  HandlerContext,
  HandlerFunction,
  HandlerResult,
} from "./Handler.ts"

export type Middleware = MiddlewareArray | MiddlewareFunction

export type MiddlewareArray = Array<Middleware>

export type MiddlewareFunction = (
  context: HandlerContext,
  continuation: HandlerFunction,
) => HandlerResult

export function applyMiddleware(
  middleware: Middleware,
  continuation: HandlerFunction,
): HandlerFunction {
  if (middleware instanceof Function) {
    return (context) => middleware(context, continuation)
  } else {
    if (middleware.length === 0) {
      return continuation
    }

    const [head, ...rest] = middleware
    return applyMiddleware(head, applyMiddleware(rest, continuation))
  }
}
