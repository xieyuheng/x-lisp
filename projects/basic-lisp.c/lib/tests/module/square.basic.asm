@define-function square
  local-store x
body:
  local-load x
  local-load x
  tail-call imul

