@def square [x]
  x x imul
@end

2 square println
2 square square println

@def my-isub [x y]
  x y isub
@end

6 3 my-isub println
