define-function square
  local-store x
entry:
  local-load x
  local-load x
  tail-call imul

