define-function main
entry:
  call true
  local-store _₁
  local-load _₁
  call println
  drop
  call false
  local-store _₂
  local-load _₂
  tail-call println

