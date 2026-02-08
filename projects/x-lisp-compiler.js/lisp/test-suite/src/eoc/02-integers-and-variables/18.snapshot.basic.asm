define-function main
entry:
  call random-dice
  local-store _₁
  local-load _₁
  literal 1
  call iadd
  local-store _₂
  local-load _₂
  literal 1
  call iadd
  local-store _₃
  local-load _₃
  literal 1
  call iadd
  local-store _₄
  local-load _₄
  literal 1
  call iadd
  local-store _₅
  local-load _₅
  tail-call println

