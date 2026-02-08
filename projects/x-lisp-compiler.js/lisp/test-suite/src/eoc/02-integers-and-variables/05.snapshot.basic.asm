define-function main
entry:
  literal 42
  local-store a₁
  local-load a₁
  local-store b₁
  local-load b₁
  tail-call println

