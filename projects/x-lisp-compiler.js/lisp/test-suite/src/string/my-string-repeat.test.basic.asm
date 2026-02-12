@define-function main
body:
  literal 0
  literal "a"
  call my-string-repeat
  local-store _₁
  literal ""
  local-load _₁
  call assert-equal
  drop
  literal 1
  literal "a"
  call my-string-repeat
  local-store _₂
  literal "a"
  local-load _₂
  call assert-equal
  drop
  literal 2
  literal "a"
  call my-string-repeat
  local-store _₃
  literal "aa"
  local-load _₃
  call assert-equal
  drop
  literal 3
  literal "a"
  call my-string-repeat
  local-store _₄
  literal "aaa"
  local-load _₄
  tail-call assert-equal

