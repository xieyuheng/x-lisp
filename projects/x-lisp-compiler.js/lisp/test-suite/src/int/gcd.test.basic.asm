define-function gcd
  local-store b
  local-store a
body:
  local-load b
  literal 0
  call equal?
  jump-if-not else₂
  jump then₁
then₁:
  local-load a
  return
else₂:
  local-load a
  local-load b
  call imod
  local-store _₁
  local-load b
  local-load _₁
  tail-call gcd

define-function main
body:
  literal 13
  literal 7
  call gcd
  local-store _₁
  literal 1
  local-load _₁
  call assert-equal
  drop
  literal 12
  literal 8
  call gcd
  local-store _₂
  literal 4
  local-load _₂
  tail-call assert-equal

