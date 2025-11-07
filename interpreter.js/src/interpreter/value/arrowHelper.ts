import * as Values from "./index.ts"

export function arrowNormalize(arrow: Values.Arrow): Values.Arrow {
  if (arrow.retSchema.kind === "Arrow") {
    const retArrow = arrowNormalize(arrow.retSchema)
    return Values.Arrow(
      [...arrow.argSchemas, ...retArrow.argSchemas],
      retArrow.retSchema,
    )
  }

  return arrow
}
