@define-function main
body:
  literal 50
  literal 8
  call isub
  local-store _₁
  local-load _₁
  tail-call println

