define-function factorial
  local-store n
entry:
  local-load n
  literal 1
  call int-less-or-equal?
  jump-if-not else₂
  jump then₁
then₁:
  literal 1
  return
else₂:
  local-load n
  literal 1
  call isub
  local-store _₁
  local-load _₁
  call factorial
  local-store _₂
  local-load _₂
  local-load n
  tail-call imul

define-function main
entry:
  literal 0
  call factorial
  local-store _₁
  literal 1
  local-load _₁
  call assert-equal
  drop
  literal 1
  call factorial
  local-store _₂
  literal 1
  local-load _₂
  call assert-equal
  drop
  literal 2
  call factorial
  local-store _₃
  literal 2
  local-load _₃
  call assert-equal
  drop
  literal 3
  call factorial
  local-store _₄
  literal 6
  local-load _₄
  call assert-equal
  drop
  literal 4
  call factorial
  local-store _₅
  literal 24
  local-load _₅
  call assert-equal
  drop
  literal 5
  call factorial
  local-store _₆
  literal 120
  local-load _₆
  call assert-equal
  drop
  literal 6
  call factorial
  local-store _₇
  literal 720
  local-load _₇
  tail-call assert-equal

