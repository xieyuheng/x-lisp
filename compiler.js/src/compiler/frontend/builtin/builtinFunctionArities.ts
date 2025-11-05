export const builtinFunctionArities: Record<string, number> = {
  iadd: 2,
  isub: 2,
  ineg: 1,
  imul: 2,
  idiv: 2,
  imod: 2,

  newline: 0,
  print: 1,
  "println-non-void": 1,

  "make-curry": 3,
  "curry-put!": 3,

  "random-dice": 0,
}
