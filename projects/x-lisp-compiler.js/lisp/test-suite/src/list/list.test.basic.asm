define-function main
entry:
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
  local-load list₁
  call assert-equal
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
  local-load tael₁
  call assert-equal
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
  local-load tael₁
  call assert-equal
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
  call list-length
  local-store _₁
  literal 3
  local-load _₁
  call assert-equal
  drop
  call make-list
  local-store tael₁
  local-load tael₁
  call list-length
  local-store _₂
  literal 0
  local-load _₂
  call assert-equal
  drop
  call make-list
  local-store tael₁
  local-load tael₁
  call list-empty?
  local-store _₃
  local-load _₃
  tail-call assert

