1 @dup 1 @assert-equal 1 @assert-equal
1 2 @drop 1 @assert-equal
1 2 @swap 1 @assert-equal 2 @assert-equal

@def main
  1 @dup 1 @assert-equal 1 @assert-equal
  1 2 @drop 1 @assert-equal
  1 2 @swap 1 @assert-equal 2 @assert-equal
@end

main
