define-function main
body:
  literal 6
  local-store y₁
  literal 42
  call ineg
  local-store y₂
  local-load y₂
  local-store x₁
  local-load x₁
  local-load y₁
  call iadd
  local-store _₁
  local-load _₁
  tail-call println

