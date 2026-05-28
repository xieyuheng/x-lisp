export type Position = {
  index: number
  row: number
  column: number
}

export function initPosition(): Position {
  return { index: 0, column: 0, row: 0 }
}

export function positionForwardChar(
  position: Position,
  char: string,
): Position {
  if (char.length !== 1) {
    throw new Error(`I expect the char to be length of one: ${char}`)
  }

  const nextPosition = { ...position }

  nextPosition.index++

  if (char === "\n") {
    nextPosition.column = 0
    nextPosition.row++
  } else {
    nextPosition.column++
  }

  return nextPosition
}
