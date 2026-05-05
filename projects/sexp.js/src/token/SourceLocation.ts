import { type Span } from "../span/index.ts"

export type SourceLocation = {
  path: string
  span: Span
}
