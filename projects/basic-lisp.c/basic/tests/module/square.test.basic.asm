@define-function main
body:
  literal 2
  call square
  local-store x
  literal 4
  local-load x
  call assert-equal
  drop
  literal 3
  call square
  local-store x
  literal 9
  local-load x
  call assert-equal
  drop
  literal #void
  return

