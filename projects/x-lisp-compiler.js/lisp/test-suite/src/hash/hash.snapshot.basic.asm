define-function main
entry:
  call make-hash
  local-store hash₁
  local-load hash₁
  call println
  drop
  call make-hash
  local-store hash₁
  literal 1
  literal 2
  local-load hash₁
  call hash-put!
  drop
  local-load hash₁
  call println
  drop
  call make-hash
  local-store hash₁
  literal 1
  literal 3
  local-load hash₁
  call hash-put!
  drop
  local-load hash₁
  call println
  drop
  call make-hash
  local-store hash₁
  literal 1
  literal 2
  local-load hash₁
  call hash-put!
  drop
  literal 3
  literal 4
  local-load hash₁
  call hash-put!
  drop
  local-load hash₁
  tail-call println

