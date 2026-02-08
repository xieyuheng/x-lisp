define-function main
entry:
  literal 32
  local-store x₁
  literal 10
  local-store x₂
  local-load x₂
  local-load x₁
  call iadd
  local-store _₁
  local-load _₁
  tail-call println

