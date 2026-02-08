define-variable x
body:
  literal 1
  return

define-function main
body:
  call x
  literal 1
  call assert-equal
  drop
  call x
  call println
  drop
  literal #void
  return

