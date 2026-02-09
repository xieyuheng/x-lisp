@define-function main
body:
  call random-dice
  local-store _₁
  call random-dice
  local-store _₂
  local-load _₁
  local-load _₂
  call iadd
  local-store _₃
  local-load _₃
  tail-call println

