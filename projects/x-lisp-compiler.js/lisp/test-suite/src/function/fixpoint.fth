@define-function Y
  ( f )
  f
  @ref Y©λ₂
  1
  @apply
  @tail-call Y©λ₁
@end

@define-function Y©λ₁
  ( u₁ )
  u₁
  u₁
  1
  @tail-apply
@end

@define-function Y©λ₂
  ( f x₁ )
  x₁
  @ref Y©λ₂©λ₁
  1
  @apply
  f
  1
  @tail-apply
@end

@define-function Y©λ₂©λ₁
  ( x₁ t₁ )
  t₁
  x₁
  x₁
  1
  @apply
  1
  @tail-apply
@end

