@define-variable nil
body:
  literal #nil
  return

@define-function li
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

@define-function li-head
  local-store target
body:
  literal 1
  local-load target
  tail-call list-get

@define-function li-tail
  local-store target
body:
  literal 2
  local-load target
  tail-call list-get

@define-function li-put-head
  local-store target
  local-store value
body:
  literal 1
  local-load value
  local-load target
  tail-call list-put

@define-function li-put-tail
  local-store target
  local-store value
body:
  literal 2
  local-load value
  local-load target
  tail-call list-put

@define-function li-put-head!
  local-store target
  local-store value
body:
  literal 1
  local-load value
  local-load target
  tail-call list-put!

@define-function li-put-tail!
  local-store target
  local-store value
body:
  literal 2
  local-load value
  local-load target
  tail-call list-put!

