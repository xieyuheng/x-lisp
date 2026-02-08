define-function swap
  local-store y
  local-store x
  local-store f
body:
  local-load y
  local-load x
  local-load f
  literal 2
  tail-apply

define-function drop
  local-store f
body:
  local-load f
  ref drop©λ₁
  literal 1
  tail-apply

define-function drop©λ₁
  local-store dropped₁
  local-store f
body:
  local-load f
  ref drop©λ₁©λ₁
  literal 1
  tail-apply

define-function drop©λ₁©λ₁
  local-store x₁
  local-store f
body:
  local-load x₁
  local-load f
  literal 1
  tail-apply

define-function dup
  local-store f
body:
  local-load f
  ref dup©λ₁
  literal 1
  tail-apply

define-function dup©λ₁
  local-store x₁
  local-store f
body:
  local-load x₁
  local-load x₁
  local-load f
  literal 2
  tail-apply

define-function identity
  local-store x
body:
  local-load x
  return

define-function main
body:
  ref identity
  local-store f₁
  ref identity
  call dup
  local-store g₁
  local-load f₁
  local-load f₁
  local-load g₁
  literal 2
  apply
  local-store _₁
  local-load _₁
  tail-call println

