@define-function main
body:
  global-load true
  call println
  drop
  global-load false
  tail-call println

