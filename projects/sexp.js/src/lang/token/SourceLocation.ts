import { type Span } from "../span/index.ts"

export type SourceLocation = {
  span: Span
  path: string
}
