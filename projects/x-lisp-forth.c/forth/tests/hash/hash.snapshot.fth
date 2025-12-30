@def main
  make-hash ( hash )
  hash println

  1 'a hash hash-put! @drop
  2 'b hash hash-put! @drop
  3 'c hash hash-put! @drop
  hash println

  'a 1 hash hash-put! @drop
  'b 2 hash hash-put! @drop
  'c 3 hash hash-put! @drop
  hash println
@end
