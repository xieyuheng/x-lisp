define-function main
entry:
  call make-hash
  local-store hash₁
  local-load hash₁
  call hash-empty?
  local-store _₁
  local-load _₁
  tail-call assert

