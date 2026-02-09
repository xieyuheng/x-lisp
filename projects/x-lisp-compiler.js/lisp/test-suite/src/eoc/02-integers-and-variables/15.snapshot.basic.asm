@define-function main
body:
  literal 4
  local-store x₂
  local-load x₂
  literal 1
  call iadd
  local-store x₁
  local-load x₁
  literal 2
  call iadd
  local-store _₁
  local-load _₁
  tail-call println

