@define-function main
body:
  literal 3
  call square
  local-store _₁
  local-load _₁
  call square
  local-store _₂
  literal 81
  local-load _₂
  tail-call assert-equal

