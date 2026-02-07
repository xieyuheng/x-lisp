define-function fibonacci
  local-store n
entry:
  local-load n
  literal 1
  call int-less-or-equal?
  jump-if-not recur-case
  jump base-case
base-case:
  local-load n
  return
recur-case:
  local-load n
  literal 1
  call isub
  local-store n1
  local-load n1
  call fibonacci
  local-store f1
  local-load n
  literal 2
  call isub
  local-store n2
  local-load n2
  call fibonacci
  local-store f2
  local-load f1
  local-load f2
  tail-call iadd

define-function main
entry:
  literal 0
  call fibonacci
  local-store v
  local-load v
  call println
  drop
  literal 1
  call fibonacci
  local-store v
  local-load v
  call println
  drop
  literal 2
  call fibonacci
  local-store v
  local-load v
  call println
  drop
  literal 3
  call fibonacci
  local-store v
  local-load v
  call println
  drop
  literal 4
  call fibonacci
  local-store v
  local-load v
  call println
  drop
  literal 5
  call fibonacci
  local-store v
  local-load v
  call println
  drop
  literal 6
  call fibonacci
  local-store v
  local-load v
  call println
  drop
  literal 7
  call fibonacci
  local-store v
  local-load v
  call println
  drop
  literal 8
  call fibonacci
  local-store v
  local-load v
  call println
  drop
  literal 9
  call fibonacci
  local-store v
  local-load v
  call println
  drop
  call void
  return

