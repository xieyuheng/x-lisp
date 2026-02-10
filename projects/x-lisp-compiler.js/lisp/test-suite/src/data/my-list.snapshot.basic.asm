@define-function main
body:
  global-load nil
  local-store _₁
  local-load _₁
  call println
  drop
  global-load nil
  local-store _₂
  literal 3
  local-load _₂
  call li
  local-store _₃
  literal 2
  local-load _₃
  call li
  local-store _₄
  literal 1
  local-load _₄
  call li
  local-store _₅
  local-load _₅
  tail-call println

