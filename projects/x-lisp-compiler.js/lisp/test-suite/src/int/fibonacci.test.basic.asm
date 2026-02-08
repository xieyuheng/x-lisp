define-function fibonacci
  local-store n
body:
  local-load n
  literal 1
  call int-less-or-equal?
  jump-if-not else₂
  jump then₁
then₁:
  local-load n
  return
else₂:
  local-load n
  literal 1
  call isub
  local-store _₁
  local-load _₁
  call fibonacci
  local-store _₂
  local-load n
  literal 2
  call isub
  local-store _₃
  local-load _₃
  call fibonacci
  local-store _₄
  local-load _₂
  local-load _₄
  tail-call iadd

define-function main
body:
  literal 0
  call fibonacci
  local-store _₁
  literal 0
  local-load _₁
  call assert-equal
  drop
  literal 1
  call fibonacci
  local-store _₂
  literal 1
  local-load _₂
  call assert-equal
  drop
  literal 2
  call fibonacci
  local-store _₃
  literal 1
  local-load _₃
  call assert-equal
  drop
  literal 3
  call fibonacci
  local-store _₄
  literal 2
  local-load _₄
  call assert-equal
  drop
  literal 4
  call fibonacci
  local-store _₅
  literal 3
  local-load _₅
  call assert-equal
  drop
  literal 5
  call fibonacci
  local-store _₆
  literal 5
  local-load _₆
  call assert-equal
  drop
  literal 6
  call fibonacci
  local-store _₇
  literal 8
  local-load _₇
  call assert-equal
  drop
  literal 7
  call fibonacci
  local-store _₈
  literal 13
  local-load _₈
  call assert-equal
  drop
  literal 8
  call fibonacci
  local-store _₉
  literal 21
  local-load _₉
  call assert-equal
  drop
  literal 9
  call fibonacci
  local-store _₁₀
  literal 34
  local-load _₁₀
  tail-call assert-equal

