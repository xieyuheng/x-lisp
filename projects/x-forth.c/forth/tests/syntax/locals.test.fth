@def square [x]
  x x imul
@end

2 square 4 @assert-equal
2 square square 16 @assert-equal

@def my-isub [x y]
  x y isub
@end

6 3 my-isub 3 @assert-equal
