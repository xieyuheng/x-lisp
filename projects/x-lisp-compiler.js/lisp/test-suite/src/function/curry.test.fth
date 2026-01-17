@define-function main
  @ref iadd
  @ref iadd
  @assert-equal
  1
  @ref iadd
  1
  @apply
  1
  @ref iadd
  1
  @apply
  @assert-equal
  1
  @ref iadd
  1
  @apply
  2
  @ref iadd
  1
  @apply
  @assert-not-equal
  2
  1
  @ref iadd
  1
  @apply
  1
  @apply
  1
  2
  iadd
  @assert-equal
  1
  1
  2
  @ref isub
  1
  @apply
  1
  @apply
  @assert-equal
  1
  2
  1
  isub
  @assert-equal
  
@end


