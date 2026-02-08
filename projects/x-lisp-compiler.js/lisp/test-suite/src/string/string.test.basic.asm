define-function main
entry:
  literal "abc"
  literal "def"
  call string-append
  local-store _₁
  literal "abcdef"
  local-load _₁
  tail-call assert-equal

