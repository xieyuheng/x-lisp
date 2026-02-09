@define-function main
body:
  literal 4
  local-store x₁
  literal 8
  local-load x₁
  call iadd
  local-store _₁
  local-load _₁
  tail-call println

