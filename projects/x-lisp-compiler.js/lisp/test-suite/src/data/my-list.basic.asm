define-variable nil
body:
  literal #nil
  return

define-function nil?
  local-store value
body:
  local-load value
  literal #nil
  tail-call equal?

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

define-function li?
  local-store value
body:
  local-load value
  call any-list?
  jump-if-not else₄
  jump then₃
then₁:
  local-load value
  call list-head
  local-store _₂
  local-load _₂
  literal #li
  tail-call equal?
else₂:
  literal #f
  return
then₃:
  local-load value
  call list-length
  local-store _₁
  local-load _₁
  literal 3
  call equal?
  jump-if-not else₂
  jump then₁
else₄:
  literal #f
  return

define-function li-head
  local-store target
body:
  literal 1
  local-load target
  tail-call list-get

define-function li-tail
  local-store target
body:
  literal 2
  local-load target
  tail-call list-get

define-function li-put-head
  local-store target
  local-store value
body:
  literal 1
  local-load value
  local-load target
  tail-call list-put

define-function li-put-tail
  local-store target
  local-store value
body:
  literal 2
  local-load value
  local-load target
  tail-call list-put

define-function li-put-head!
  local-store target
  local-store value
body:
  literal 1
  local-load value
  local-load target
  tail-call list-put!

define-function li-put-tail!
  local-store target
  local-store value
body:
  literal 2
  local-load value
  local-load target
  tail-call list-put!

