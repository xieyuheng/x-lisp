@define-function main
body:
  call make-list
  local-store list₁
  literal 1
  local-load list₁
  call list-push!
  drop
  literal 2
  local-load list₁
  call list-push!
  drop
  literal 3
  local-load list₁
  call list-push!
  drop
  local-load list₁
  call println
  drop
  call make-list
  local-store tael₁
  literal 1
  local-load tael₁
  call list-push!
  drop
  literal 2
  local-load tael₁
  call list-push!
  drop
  literal 3
  local-load tael₁
  call list-push!
  drop
  local-load tael₁
  call println
  drop
  call make-list
  local-store tael₁
  literal 1
  local-load tael₁
  call list-push!
  drop
  literal 2
  local-load tael₁
  call list-push!
  drop
  literal 3
  local-load tael₁
  call list-push!
  drop
  local-load tael₁
  call println
  drop
  call make-list
  local-store tael₁
  literal 1
  local-load tael₁
  call list-push!
  drop
  literal 2
  local-load tael₁
  call list-push!
  drop
  literal 3
  local-load tael₁
  call list-push!
  drop
  local-load tael₁
  call println
  drop
  call make-list
  local-store tael₁
  literal 1
  local-load tael₁
  call list-push!
  drop
  literal 2
  local-load tael₁
  call list-push!
  drop
  literal 3
  local-load tael₁
  call list-push!
  drop
  local-load tael₁
  call println
  drop
  call make-list
  local-store tael₁
  literal 'a
  local-load tael₁
  call list-push!
  drop
  literal 'b
  local-load tael₁
  call list-push!
  drop
  literal 'c
  local-load tael₁
  call list-push!
  drop
  local-load tael₁
  call println
  drop
  call make-list
  local-store tael₁
  literal 'a
  local-load tael₁
  call list-push!
  drop
  literal 'b
  local-load tael₁
  call list-push!
  drop
  literal 'c
  local-load tael₁
  call list-push!
  drop
  local-load tael₁
  tail-call println

