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
  literal 1
  literal 2
  call equal?
  jump-if-not else₂
  jump then₁
then₁:
  literal 111
  call print
  drop
  call newline
  drop
  literal 1
  literal 2
  tail-call equal?
else₂:
  literal 222
  call print
  drop
  call newline
  drop
  literal 1
  literal 2
  tail-call equal?

