@def main
  make-hash ( hash )
  hash any-hash? @assert
  hash hash-length 0 equal? @assert
  hash hash-empty? @assert

  hash hash-copy ( hash )
  hash any-hash? @assert
  hash hash-length 0 equal? @assert
  hash hash-empty? @assert

  0 hash hash-get null @assert-equal
  0 hash hash-has? not @assert
@end
