define-function main
entry:
  call random-dice
  local-store _₁
  local-load _₁
  literal 1
  call iadd
  local-store _₂
  literal 1
  local-load _₂
  call iadd
  local-store _₃
  local-load _₃
  tail-call println

