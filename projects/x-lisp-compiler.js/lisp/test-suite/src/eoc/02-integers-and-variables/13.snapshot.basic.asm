define-function main
body:
  literal 10
  call ineg
  local-store _₁
  literal 42
  local-load _₁
  call iadd
  local-store x₁
  local-load x₁
  literal 10
  call iadd
  local-store _₂
  local-load _₂
  tail-call println

