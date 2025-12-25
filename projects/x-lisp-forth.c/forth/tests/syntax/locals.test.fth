@def square [x]
  x x imul
@end

@def my-isub [x y]
  x y isub
@end

@def main
  2 square 4 @assert-equal
  2 square square 16 @assert-equal

  6 3 my-isub 3 @assert-equal
@end
