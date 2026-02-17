import * as Values from "./index.ts"

export function arrowNormalize(arrow: Values.ArrowValue): Values.ArrowValue {
  if (arrow.retSchema.kind === "Arrow") {
    const retArrow = arrowNormalize(arrow.retSchema)
    return Values.ArrowValue(
      [...arrow.argSchemas, ...retArrow.argSchemas],
      retArrow.retSchema,
    )
  }

  return arrow
}
