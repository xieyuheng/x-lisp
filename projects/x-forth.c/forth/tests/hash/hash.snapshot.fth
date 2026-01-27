@define-function main
  make-hash ( hash )
  hash println @drop

  1 'a hash hash-put! @drop
  2 'b hash hash-put! @drop
  3 'c hash hash-put! @drop
  hash println @drop

  'a 1 hash hash-put! @drop
  'b 2 hash hash-put! @drop
  'c 3 hash hash-put! @drop
  hash println @drop
@end
