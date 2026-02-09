@define-function square
  local-store x
body:
  local-load x
  local-load x
  tail-call imul

@define-function main
body:
  literal 3
  call square
  local-store _₁
  local-load _₁
  tail-call println

