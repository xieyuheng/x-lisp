define-function main
body:
  call make-list
  local-store tael₁
  literal 'x
  literal 'a
  local-load tael₁
  call record-put!
  drop
  literal 'y
  literal 'b
  local-load tael₁
  call record-put!
  drop
  call make-list
  local-store tael₁
  literal 'x
  literal 'a
  local-load tael₁
  call record-put!
  drop
  literal 'y
  literal 'b
  local-load tael₁
  call record-put!
  drop
  local-load tael₁
  local-load tael₁
  tail-call assert-equal

