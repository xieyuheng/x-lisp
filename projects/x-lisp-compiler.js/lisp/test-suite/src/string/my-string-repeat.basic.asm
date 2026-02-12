@define-function my-string-repeat
  local-store string
  local-store n
body:
  local-load n
  literal 0
  call equal?
  jump-if-not else₂
  jump then₁
then₁:
  literal ""
  return
else₂:
  local-load n
  literal 1
  call isub
  local-store _₁
  local-load _₁
  local-load string
  call my-string-repeat
  local-store _₂
  local-load string
  local-load _₂
  tail-call string-append

