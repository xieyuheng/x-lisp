@define-function main
body:
  literal 1
  literal 2
  call iadd
  local-store _₁
  literal 3
  literal 4
  call iadd
  local-store _₂
  local-load _₁
  local-load _₂
  call iadd
  local-store x₁
  local-load x₁
  literal 5
  call iadd
  local-store _₃
  local-load _₃
  tail-call println

