@define-function swap
( f x y ) y x f 2 @tail-apply 
@end

@define-function drop
( f ) f @ref drop©λ₁ 1 @tail-apply 
@end

@define-function drop©λ₁
( f dropped₁ ) f @ref drop©λ₁©λ₁ 1 @tail-apply 
@end

@define-function drop©λ₁©λ₁
( f x₁ ) x₁ f 1 @tail-apply 
@end

@define-function dup
( f ) f @ref dup©λ₁ 1 @tail-apply 
@end

@define-function dup©λ₁
( f x₁ ) x₁ x₁ f 2 @tail-apply 
@end

@define-function identity
( x ) x @return 
@end

@define-function main
@ref
identity
( f₁ )
@ref
identity
dup
( g₁ )
f₁
f₁
g₁
2
@apply
@tail-call
println

@end


