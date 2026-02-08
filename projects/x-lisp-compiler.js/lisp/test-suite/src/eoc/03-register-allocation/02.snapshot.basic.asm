define-function main
body:
  call random-dice
  local-store x₁
  call random-dice
  local-store y₁
  local-load x₁
  local-load y₁
  call iadd
  local-store _₁
  local-load _₁
  literal 42
  call iadd
  local-store _₂
  local-load _₂
  tail-call println

