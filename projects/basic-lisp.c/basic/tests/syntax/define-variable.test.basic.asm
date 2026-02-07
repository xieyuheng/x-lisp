define-variable x
entry:
  literal 1
  return

define-function main
entry:
  call x
  literal 1
  call assert-equal
  drop
  call x
  call println
  drop
  literal #void
  return

