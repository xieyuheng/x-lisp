@define-variable one
body:
  literal 1
  return

@define-variable two
body:
  call one
  local-store _₁
  literal 1
  local-load _₁
  tail-call iadd

@define-variable three
body:
  call two
  local-store _₁
  literal 1
  local-load _₁
  tail-call iadd

@define-function main
body:
  call three
  local-store _₁
  local-load _₁
  tail-call println

