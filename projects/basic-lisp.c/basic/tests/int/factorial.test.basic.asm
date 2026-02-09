@define-function factorial
  local-store n
body:
  local-load n
  literal 1
  call int-less-or-equal?
  jump-if-not recur-case
  jump base-case
base-case:
  literal 1
  return
recur-case:
  local-load n
  literal 1
  call isub
  local-store n1
  local-load n1
  call factorial
  local-store f1
  local-load n
  local-load f1
  tail-call imul

@define-function main
body:
  literal 0
  call factorial
  local-store v
  local-load v
  call println
  drop
  literal 1
  call factorial
  local-store v
  local-load v
  call println
  drop
  literal 2
  call factorial
  local-store v
  local-load v
  call println
  drop
  literal 3
  call factorial
  local-store v
  local-load v
  call println
  drop
  literal 4
  call factorial
  local-store v
  local-load v
  call println
  drop
  call void
  return

