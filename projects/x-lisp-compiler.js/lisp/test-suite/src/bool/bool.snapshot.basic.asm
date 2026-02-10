@define-function main
body:
  global-load true
  local-store _₁
  local-load _₁
  call println
  drop
  global-load false
  local-store _₂
  local-load _₂
  tail-call println

