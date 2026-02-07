define-function main
entry:
  call one
  local-store x
  local-load x
  literal 1
  call assert-equal
  drop
  call two
  local-store x
  local-load x
  literal 2
  call assert-equal
  drop
  call three
  local-store x
  local-load x
  literal 3
  call assert-equal
  drop
  call one
  local-store x
  local-load x
  literal 1
  call assert-equal
  drop
  call two
  local-store x
  local-load x
  literal 2
  call assert-equal
  drop
  call three
  local-store x
  local-load x
  literal 3
  call assert-equal
  drop
  literal #void
  return

