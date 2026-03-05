@define-function swap
  local-store y
  local-store x
  local-store f
body:
  local-load y
  local-load x
  local-load f
  literal 2
  tail-apply

@define-function drop
  local-store f
body:
  local-load f
  ref drop©λ₁
  literal 1
  tail-apply

@define-function drop©λ₁
  local-store dropped₁
  local-store f
body:
  local-load f
  ref drop©λ₁©λ₁
  literal 1
  tail-apply

@define-function drop©λ₁©λ₁
  local-store x₁
  local-store f
body:
  local-load x₁
  local-load f
  literal 1
  tail-apply

@define-function dup
  local-store f
body:
  local-load f
  ref dup©λ₁
  literal 1
  tail-apply

@define-function dup©λ₁
  local-store x₁
  local-store f
body:
  local-load x₁
  local-load x₁
  local-load f
  literal 2
  tail-apply

@define-function identity
  local-store x
body:
  local-load x
  return

@define-function main
body:
  ref identity
  local-store f₁
  ref imul
  call dup
  local-store square₁
  literal 1
  local-load f₁
  literal 1
  apply
  local-store _₁
  local-load _₁
  local-load square₁
  literal 1
  apply
  local-store _₂
  local-load _₂
  call println
  drop
  literal 2
  local-load f₁
  literal 1
  apply
  local-store _₃
  local-load _₃
  local-load square₁
  literal 1
  apply
  local-store _₄
  local-load _₄
  call println
  drop
  literal 3
  local-load f₁
  literal 1
  apply
  local-store _₅
  local-load _₅
  local-load square₁
  literal 1
  apply
  local-store _₆
  local-load _₆
  call println
  drop
  literal 4
  local-load f₁
  literal 1
  apply
  local-store _₇
  local-load _₇
  local-load square₁
  literal 1
  apply
  local-store _₈
  local-load _₈
  tail-call println

