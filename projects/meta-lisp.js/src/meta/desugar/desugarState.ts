export type State = {
  nameCounts: Map<string, number>
}

export function createDesugarState(): State {
  return {
    nameCounts: new Map(),
  }
}
