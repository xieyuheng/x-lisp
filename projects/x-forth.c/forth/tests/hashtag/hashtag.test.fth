@define-function main
  #abc hashtag? @assert
  #abc #abc same? @assert
  #abc hashtag-length 3 @assert-equal
  #abc hashtag-to-string "abc" @assert-equal
  #abc #def hashtag-append #abcdef @assert-equal

  make-list ( list )
  #abc list list-push!
  #def list list-push!
  #ghi list list-push!
  list hashtag-concat
  #abcdefghi @assert-equal
@end
