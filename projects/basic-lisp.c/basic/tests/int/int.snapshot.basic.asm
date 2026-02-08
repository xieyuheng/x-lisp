define-function main
body:
  literal 1
  call println
  drop
  literal 2
  call println
  drop
  literal 3
  call println
  drop
  literal 2
  literal 2
  call iadd
  local-store x
  local-load x
  call println
  drop
  literal #void
  return

