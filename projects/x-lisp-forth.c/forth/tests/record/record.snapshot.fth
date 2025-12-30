@def main
  make-record ( record )
  record println @drop

  'a 1 record record-put! @drop
  'b 2 record record-put! @drop
  'c 3 record record-put! @drop
  record println @drop
@end
