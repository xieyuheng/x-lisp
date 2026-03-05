@define-function main
body:
  literal 11
  literal 11
  call iadd
  local-store _₁
  literal 20
  local-load _₁
  call iadd
  local-store _₂
  local-load _₂
  tail-call println

