@define-function main
body:
  literal 1
  local-store _₁
  jump let-body₁₀
let-body₁:
  local-load _₇
  call not
  local-store _₈
  local-load _₈
  tail-call assert
let-body₂:
  jump let-body₁
let-body₃:
  local-load _₆
  call assert
  drop
  literal #f
  local-store _₇
  jump let-body₂
let-body₄:
  jump let-body₃
let-body₅:
  local-load _₄
  call not
  local-store _₅
  local-load _₅
  call assert
  drop
  literal #t
  local-store _₆
  jump let-body₄
let-body₆:
  jump let-body₅
let-body₇:
  local-load _₃
  call assert
  drop
  literal #f
  local-store _₄
  jump let-body₆
let-body₈:
  jump let-body₇
let-body₉:
  local-load _₂
  literal 2
  call assert-equal
  drop
  literal #t
  local-store _₃
  jump let-body₈
let-body₁₀:
  local-load _₁
  literal 1
  call assert-equal
  drop
  literal 2
  local-store _₂
  jump let-body₉

