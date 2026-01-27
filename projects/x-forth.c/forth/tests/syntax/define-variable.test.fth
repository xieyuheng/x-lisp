@define-variable x 1 @end

@define-function main
  x 1 @assert-equal
  2 @ref x @assign
  x 2 @assert-equal
@end
