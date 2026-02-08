define-function main
body:
  call random-dice
  local-store _₂
  local-load _₂
  literal 1
  call equal?
  jump-if-not else₇
  jump then₆
let-body₁:
  local-load _₁
  tail-call println
then₂:
  literal 0
  local-store _₁
  jump let-body₁
else₃:
  literal 42
  local-store _₁
  jump let-body₁
then₄:
  jump then₂
else₅:
  jump else₃
then₆:
  call random-dice
  local-store _₃
  local-load _₃
  literal 2
  call equal?
  jump-if-not else₅
  jump then₄
else₇:
  jump else₃

