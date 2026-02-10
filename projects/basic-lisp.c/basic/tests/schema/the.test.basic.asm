@define-function main
body:
  ref int?
  literal 1
  call the
  local-store x
  local-load x
  literal 1
  call assert-equal
  drop
  literal 1
  literal 1
  call the
  local-store x
  local-load x
  literal 1
  call assert-equal
  drop
  literal 'a
  literal 'a
  call the
  local-store x
  local-load x
  literal 'a
  call assert-equal
  drop
  literal #void
  return

