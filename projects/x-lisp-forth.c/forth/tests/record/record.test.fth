@begin
  make-record [record]
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

  record record-copy [record2]
  'a 1 record2 record-put! [record2]
  'b 2 record2 record-put! [record2]
  'c 3 record2 record-put! [record2]
  record2 record-length 3 @assert-equal
  record record-length 0 @assert-equal
  'a record2 record-delete record-length 2 @assert-equal
  record2 record-length 3 @assert-equal
@end
