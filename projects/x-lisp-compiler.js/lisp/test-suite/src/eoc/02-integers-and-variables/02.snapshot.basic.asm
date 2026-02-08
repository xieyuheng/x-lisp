define-function main
body:
  literal 20
  local-store x₁
  literal 22
  local-store x₂
  local-load x₁
  local-load x₂
  call iadd
  local-store y₁
  local-load y₁
  tail-call println

