define-function main
entry:
  literal 1
  local-store v₁
  literal 42
  local-store w₁
  local-load v₁
  literal 7
  call iadd
  local-store x₁
  local-load x₁
  local-store y₁
  local-load x₁
  local-load w₁
  call iadd
  local-store z₁
  local-load y₁
  call ineg
  local-store _₁
  local-load z₁
  local-load _₁
  call iadd
  local-store _₂
  local-load _₂
  tail-call println

