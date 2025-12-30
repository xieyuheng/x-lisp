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

  1 'a hash hash-put! @drop
  2 'b hash hash-put! @drop
  3 'c hash hash-put! @drop

  1 hash hash-get 'a @assert-equal
  2 hash hash-get 'b @assert-equal
  3 hash hash-get 'c @assert-equal
@end
