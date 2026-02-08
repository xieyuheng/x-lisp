define-function main
body:
  literal 42
  call ineg
  local-store x₁
  local-load x₁
  local-store y₁
  local-load y₁
  local-store z₁
  local-load z₁
  call ineg
  local-store _₁
  local-load _₁
  tail-call println

