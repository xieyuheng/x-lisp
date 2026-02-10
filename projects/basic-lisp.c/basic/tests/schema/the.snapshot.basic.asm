@define-function main
body:
  ref int?
  literal 1
  call the
  local-store x
  local-load x
  call println
  drop
  global-load void
  return

