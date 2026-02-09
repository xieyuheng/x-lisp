@define-function even?
  local-store n
body:
  local-load n
  literal 0
  call equal?
  jump-if-not recur-case
  jump base-case
base-case:
  literal #t
  return
recur-case:
  local-load n
  literal 1
  call isub
  local-store n1
  local-load n1
  tail-call odd?

@define-function main
body:
  literal 0
  call even?
  local-store x
  local-load x
  call assert
  drop
  literal 1
  call even?
  local-store x
  local-load x
  call assert-not
  drop
  literal 2
  call even?
  local-store x
  local-load x
  call assert
  drop
  literal 3
  call even?
  local-store x
  local-load x
  call assert-not
  drop
  literal 0
  call odd?
  local-store x
  local-load x
  call assert-not
  drop
  literal 1
  call odd?
  local-store x
  local-load x
  call assert
  drop
  literal 2
  call odd?
  local-store x
  local-load x
  call assert-not
  drop
  literal 3
  call odd?
  local-store x
  local-load x
  call assert
  drop
  literal #void
  return

