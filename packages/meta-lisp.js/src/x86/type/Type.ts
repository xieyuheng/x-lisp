export type Type = {
  name: string
}

export function Type(name: string): Type {
  return {
    name,
  }
}
