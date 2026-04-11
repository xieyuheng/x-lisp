@define-variable true

@define-variable false

@define-variable void

@define-function main
body:
  literal 'a
  call println
  drop
  literal 'b
  call println
  drop
  literal 'c
  call println
  drop
  literal #void
  return

