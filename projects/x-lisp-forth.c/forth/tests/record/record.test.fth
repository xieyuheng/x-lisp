@def main
  make-record ( record )
  record record-length 0 @assert-equal
  record record-empty? @assert

  'a 1 record record-put! @drop
  'b 2 record record-put! @drop
  'c 3 record record-put! @drop
  record record-length 3 @assert-equal
  record record-empty? not @assert

  'a record record-get 1 @assert-equal
  'b record record-get 2 @assert-equal
  'c record record-get 3 @assert-equal
  'd record record-get null @assert-equal

  'a record record-delete! @drop
  'b record record-delete! @drop
  'c record record-delete! @drop
  'd record record-delete! @drop

  'a record record-get null @assert-equal
  'b record record-get null @assert-equal
  'c record record-get null @assert-equal
  'd record record-get null @assert-equal

  record record-copy ( record2 )
  'a 1 record2 record-put! ( record2 )
  'b 2 record2 record-put! ( record2 )
  'c 3 record2 record-put! ( record2 )
  record2 record-length 3 @assert-equal
  record record-length 0 @assert-equal
  'a record2 record-delete record-length 2 @assert-equal
  record2 record-length 3 @assert-equal

  -- record-append

  make-record ( record )
  'a 1 record record-put! @drop
  'b 2 record record-put! @drop
  'c 3 record record-put! @drop

  make-record ( record2 )
  'x 1 record2 record-put! @drop
  'y 2 record2 record-put! @drop
  'z 3 record2 record-put! @drop

  record record2 record-append ( record3 )

  'a record3 record-get 1 @assert-equal
  'b record3 record-get 2 @assert-equal
  'c record3 record-get 3 @assert-equal
  'x record3 record-get 1 @assert-equal
  'y record3 record-get 2 @assert-equal
  'z record3 record-get 3 @assert-equal

  -- record-[keys|values|entries]

  make-record ( record )
  'a 1 record record-put! @drop
  'b 2 record record-put! @drop
  'c 3 record record-put! @drop

  record record-keys ( keys )
  0 keys list-get 'a @assert-equal
  1 keys list-get 'b @assert-equal
  2 keys list-get 'c @assert-equal

  record record-values ( values )
  0 values list-get 1 @assert-equal
  1 values list-get 2 @assert-equal
  2 values list-get 3 @assert-equal

  record record-entries ( entries )
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
