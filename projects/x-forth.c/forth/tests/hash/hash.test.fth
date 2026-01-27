@define-function main
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

  -- hash-[keys|values|entries]

  make-hash ( hash )
  'a 1 hash hash-put! @drop
  'b 2 hash hash-put! @drop
  'c 3 hash hash-put! @drop
  'd null hash hash-put! @drop

  hash hash-keys ( keys )
  0 keys list-get 'a @assert-equal
  1 keys list-get 'b @assert-equal
  2 keys list-get 'c @assert-equal

  hash hash-values ( values )
  0 values list-get 1 @assert-equal
  1 values list-get 2 @assert-equal
  2 values list-get 3 @assert-equal

  hash hash-entries ( entries )
  0 entries list-get ( entry )
    0 entry list-get 'a @assert-equal
    1 entry list-get 1 @assert-equal
  1 entries list-get ( entry )
    0 entry list-get 'b @assert-equal
    1 entry list-get 2 @assert-equal
  2 entries list-get ( entry )
    0 entry list-get 'c @assert-equal
    1 entry list-get 3 @assert-equal
@end
