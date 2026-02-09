@define-function main
body:
  call random-dice
  local-store _₁
  local-load _₁
  call ineg
  local-store _₂
  local-load _₂
  tail-call println

