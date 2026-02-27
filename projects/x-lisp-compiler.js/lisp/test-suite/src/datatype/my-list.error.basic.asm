@define-variable my-list
body:
  literal "3"
  global-load nil
  call li
  local-store _₁
  literal 1
  local-load _₁
  tail-call li

