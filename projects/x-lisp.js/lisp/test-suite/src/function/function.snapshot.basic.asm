@define-function main
body:
  ref iadd
  call println
  drop
  literal 1
  ref iadd
  literal 1
  apply
  local-store _₁
  local-load _₁
  tail-call println

