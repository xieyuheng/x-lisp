@define-function main
body:
  call true
  local-store _₁
  local-load _₁
  call println
  drop
  call false
  local-store _₂
  local-load _₂
  tail-call println

