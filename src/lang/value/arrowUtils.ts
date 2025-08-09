import * as Values from "../value/index.ts"

export function arrowNormalize(arrow: Values.Arrow): Values.Arrow {
  if (arrow.ret.kind === "Arrow") {
    const retArrow = arrowNormalize(arrow.ret)
    return Values.Arrow([...arrow.args, ...retArrow.args], retArrow.ret)
  }

  return arrow
}
