@define-variable one
body:
  literal 1
  return

@define-variable two
body:
  literal 1
  global-load one
  tail-call iadd

@define-variable three
body:
  literal 1
  global-load two
  tail-call iadd

@define-function main
body:
  global-load three
  tail-call println

