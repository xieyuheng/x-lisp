define-variable nil
body:
  literal #nil
  return

define-function li
  local-store tail
  local-store head
body:
  call make-list
  local-store tael₁
  literal #li
  local-load tael₁
  call list-push!
  drop
  local-load head
  local-load tael₁
  call list-push!
  drop
  local-load tail
  local-load tael₁
  call list-push!
  drop
  local-load tael₁
  return

