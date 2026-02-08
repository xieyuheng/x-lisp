define-function main
entry:
  call random-dice
  local-store x₁
  call random-dice
  local-store y₁
  local-load x₁
  literal 1
  call int-less?
  jump-if-not else₉
  jump then₈
let-body₁:
  local-load _₁
  tail-call println
then₂:
  local-load y₁
  literal 2
  call iadd
  local-store _₁
  jump let-body₁
else₃:
  local-load y₁
  literal 10
  call iadd
  local-store _₁
  jump let-body₁
then₄:
  jump then₂
else₅:
  jump else₃
then₆:
  jump then₂
else₇:
  jump else₃
then₈:
  local-load x₁
  literal 0
  call equal?
  jump-if-not else₅
  jump then₄
else₉:
  local-load x₁
  literal 2
  call equal?
  jump-if-not else₇
  jump then₆

