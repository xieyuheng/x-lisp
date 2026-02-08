define-function main
body:
  ref iadd
  ref iadd
  call assert-equal
  drop
  literal 1
  ref iadd
  literal 1
  apply
  local-store _₁
  literal 1
  ref iadd
  literal 1
  apply
  local-store _₂
  local-load _₁
  local-load _₂
  call assert-equal
  drop
  literal 1
  ref iadd
  literal 1
  apply
  local-store _₃
  literal 2
  ref iadd
  literal 1
  apply
  local-store _₄
  local-load _₃
  local-load _₄
  call assert-not-equal
  drop
  literal 1
  ref iadd
  literal 1
  apply
  local-store _₅
  literal 2
  local-load _₅
  literal 1
  apply
  local-store _₆
  literal 1
  literal 2
  call iadd
  local-store _₇
  local-load _₆
  local-load _₇
  call assert-equal
  drop
  literal 2
  ref isub
  literal 1
  apply
  local-store _₈
  literal 1
  local-load _₈
  literal 1
  apply
  local-store _₉
  literal 1
  local-load _₉
  call assert-equal
  drop
  literal 2
  literal 1
  call isub
  local-store _₁₀
  literal 1
  local-load _₁₀
  tail-call assert-equal

