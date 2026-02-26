@define-function main
body:
  literal 1
  call print
  drop
  call newline
  drop
  literal 2
  call print
  drop
  call newline
  drop
  literal 3
  call print
  drop
  call newline
  drop
  global-load void
  return

