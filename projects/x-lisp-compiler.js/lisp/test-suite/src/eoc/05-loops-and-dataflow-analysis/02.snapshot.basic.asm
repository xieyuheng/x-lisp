define-function main
entry:
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
  literal 6
  local-store x₁
  literal 4
  call print
  drop
  call newline
  drop
  literal 5
  call print
  drop
  call newline
  drop
  literal 6
  call print
  drop
  call newline
  drop
  local-load x₁
  local-load x₁
  tail-call iadd

