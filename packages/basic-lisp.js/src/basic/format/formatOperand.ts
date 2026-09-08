import * as B from "../index.ts"

export function formatOperand(cell: B.Cell): string {
  return cell.id
}

export function formatOperands(cells: Array<B.Cell>): string {
  return cells.map(formatOperand).join(" ")
}
