define-function Y
  local-store f
entry:
  local-load f
  ref Y©λ₂
  literal 1
  apply
  local-store _₁
  local-load _₁
  tail-call Y©λ₁

define-function Y©λ₁
  local-store u₁
entry:
  local-load u₁
  local-load u₁
  literal 1
  tail-apply

define-function Y©λ₂
  local-store x₁
  local-store f
entry:
  local-load x₁
  ref Y©λ₂©λ₁
  literal 1
  apply
  local-store _₁
  local-load _₁
  local-load f
  literal 1
  tail-apply

define-function Y©λ₂©λ₁
  local-store t₁
  local-store x₁
entry:
  local-load x₁
  local-load x₁
  literal 1
  apply
  local-store _₁
  local-load t₁
  local-load _₁
  literal 1
  tail-apply

