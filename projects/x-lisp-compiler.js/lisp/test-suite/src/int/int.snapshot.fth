@define-function square
( x ) x x @tail-call imul 
@end

@define-function main
3 square @tail-call println 
@end


