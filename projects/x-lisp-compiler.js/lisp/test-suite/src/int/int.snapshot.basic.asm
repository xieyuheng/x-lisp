define-function square
  local-store x
entry:
  local-load x
  local-load x
  tail-call imul

define-function main
entry:
  literal 3
  call square
  local-store _₁
  local-load _₁
  tail-call println

