define-function main
entry:
  literal 1
  local-store _₁
  jump let-body₁
let-body₁:
  local-load _₁
  tail-call println

