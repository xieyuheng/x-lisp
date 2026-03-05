@define-function main
body:
  global-load nil
  call println
  drop
  literal 3
  global-load nil
  call li
  local-store _₁
  literal 2
  local-load _₁
  call li
  local-store _₂
  literal 1
  local-load _₂
  call li
  local-store _₃
  local-load _₃
  tail-call println

