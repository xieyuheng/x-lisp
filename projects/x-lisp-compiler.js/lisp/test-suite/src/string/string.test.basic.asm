@define-function main
body:
  literal "abc"
  literal "def"
  call string-append
  local-store _₁
  literal "abcdef"
  local-load _₁
  tail-call assert-equal

