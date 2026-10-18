export type Either<L, R> =
  { kind: "Left"; left: L } | { kind: "Right"; right: R }

export function Left<L, R>(left: L): Either<L, R> {
  return { kind: "Left", left }
}

export function Right<L, R>(right: R): Either<L, R> {
  return { kind: "Right", right }
}

export function isLeft<L, R>(
  either: Either<L, R>,
): either is { kind: "Left"; left: L } {
  return either.kind === "Left"
}

export function isRight<L, R>(
  either: Either<L, R>,
): either is { kind: "Right"; right: R } {
  return either.kind === "Right"
}
