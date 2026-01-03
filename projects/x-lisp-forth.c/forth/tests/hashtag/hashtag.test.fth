@define-function main
  #abc hashtag? @assert
  #abc #abc same? @assert
  #abc hashtag-length 3 @assert-equal
  #abc hashtag-to-string "abc" @assert-equal
  #abc #def hashtag-append #abcdef @assert-equal
@end
