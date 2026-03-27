import { type Span } from "../span/index.ts"

export type SourceLocation = {
  span: Span
  text: string
  path?: string
}
