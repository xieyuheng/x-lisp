define-function main
body:
  literal 1
  literal 2
  call equal?
  jump-if-not else₄
  jump then₃
then₁:
  literal 2
  return
else₂:
  literal #f
  tail-call assert
then₃:
  literal 1
  return
else₄:
  literal 1
  literal 2
  call equal?
  jump-if-not else₂
  jump then₁

