define-function main
body:
  literal 1
  literal 1
  call equal?
  jump-if-not else₁₄
  jump then₁₃
then₁:
  call false
  local-store _₅
  local-load _₅
  tail-call assert
else₂:
  call true
  local-store _₆
  local-load _₆
  tail-call assert
let-body₃:
  literal 1
  literal 2
  call equal?
  jump-if-not else₂
  jump then₁
let-body₄:
  jump let-body₃
then₅:
  call true
  local-store _₃
  local-load _₃
  call assert
  drop
  jump let-body₃
else₆:
  call false
  local-store _₄
  local-load _₄
  call assert
  drop
  jump let-body₄
let-body₇:
  literal 2
  local-load _₂
  call assert-equal
  drop
  literal 1
  literal 1
  call equal?
  jump-if-not else₆
  jump then₅
let-body₈:
  jump let-body₇
then₉:
  literal 1
  local-store _₂
  jump let-body₇
else₁₀:
  literal 2
  local-store _₂
  jump let-body₈
let-body₁₁:
  literal 1
  local-load _₁
  call assert-equal
  drop
  literal 1
  literal 2
  call equal?
  jump-if-not else₁₀
  jump then₉
let-body₁₂:
  jump let-body₁₁
then₁₃:
  literal 1
  local-store _₁
  jump let-body₁₁
else₁₄:
  literal 2
  local-store _₁
  jump let-body₁₂

