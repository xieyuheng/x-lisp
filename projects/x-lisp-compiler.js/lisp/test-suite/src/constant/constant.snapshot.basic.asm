define-variable one
entry:
  literal 1
  return

define-variable two
entry:
  call one
  local-store _₁
  literal 1
  local-load _₁
  tail-call iadd

define-variable three
entry:
  call two
  local-store _₁
  literal 1
  local-load _₁
  tail-call iadd

define-function main
entry:
  call three
  local-store _₁
  local-load _₁
  tail-call println

