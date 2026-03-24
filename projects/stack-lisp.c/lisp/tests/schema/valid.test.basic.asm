@define-function main
body:
  ref int?
  literal 1
  call valid?
  local-store x
  local-load x
  call assert
  drop
  literal 1
  literal 1
  call valid?
  local-store x
  local-load x
  ref assert-equal
  literal 1
  apply
  drop
  literal 'a
  literal 'a
  call valid?
  local-store x
  local-load x
  ref assert-equal
  literal 1
  apply
  drop
  literal #void
  return

