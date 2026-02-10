@define-variable one
body:
  literal 1
  return

@define-variable two
body:
  global-load one
  local-store _₁
  literal 1
  local-load _₁
  tail-call iadd

@define-variable three
body:
  global-load two
  local-store _₁
  literal 1
  local-load _₁
  tail-call iadd

@define-function main
body:
  global-load three
  local-store _₁
  local-load _₁
  tail-call println

