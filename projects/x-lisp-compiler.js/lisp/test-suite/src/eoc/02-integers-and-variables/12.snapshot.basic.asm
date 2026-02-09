@define-function main
body:
  literal 1
  literal 2
  call iadd
  local-store _₁
  literal 4
  literal 5
  call iadd
  local-store _₂
  literal 3
  local-load _₂
  call iadd
  local-store _₃
  local-load _₁
  local-load _₃
  call iadd
  local-store _₄
  local-load _₄
  tail-call println

