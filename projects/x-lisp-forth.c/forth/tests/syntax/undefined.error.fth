@def main
  2 square 4 @assert-equal
  2 square square 16 @assert-equal
@end

main

@def square [x]
  x x imul
@end
