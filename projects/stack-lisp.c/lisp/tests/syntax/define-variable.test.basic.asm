@define-variable x
body:
  literal 1
  return

@define-function main
body:
  global-load x
  literal 1
  call assert-equal
  drop
  global-load x
  call println
  drop
  literal #void
  return

