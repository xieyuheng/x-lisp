@define-function main
body:
  literal 20
  literal 22
  call iadd
  local-store _₁
  local-load _₁
  tail-call println

