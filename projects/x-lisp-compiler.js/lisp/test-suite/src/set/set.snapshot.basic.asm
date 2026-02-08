define-function main
body:
  call make-set
  local-store set₁
  literal 1
  local-load set₁
  call set-add!
  drop
  literal 2
  local-load set₁
  call set-add!
  drop
  literal 3
  local-load set₁
  call set-add!
  drop
  local-load set₁
  call println
  drop
  call make-set
  local-store set₁
  literal 1
  local-load set₁
  call set-add!
  drop
  literal 2
  local-load set₁
  call set-add!
  drop
  literal 3
  local-load set₁
  call set-add!
  drop
  local-load set₁
  tail-call println

