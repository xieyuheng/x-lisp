define-function main
entry:
  literal 1
  local-store x₁
  literal 5
  local-store y₁
  local-load y₁
  local-load x₁
  call iadd
  local-store x₂
  local-load x₂
  literal 100
  call iadd
  local-store _₁
  local-load x₁
  local-load _₁
  call iadd
  local-store _₂
  local-load _₂
  tail-call println

