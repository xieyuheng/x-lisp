---
title: program development by stepwise refinement
subtitle: learning from niklaus wirth
module: stepwise
---

# problem

> Given are an 8 X 8 chessboard and 8 queens which are
> hostile to each other. Find a position for each queen (a
> configuration) such that no queen may be taken by any
> other queen (i.e. such that every row, column, and
> diagonal contains at most one queen).

# trial and error

> This problem is characteristic for the rather frequent
> situation where an analytical solution is not known, and
> where one has to resort to the method of trial and
> error. Typically, there exists a set `A` of candidates for
> solutions, among which one is to be selected which
> satisfies a certain condition `p`. Thus a solution is
> characterized as an `x` such that `(x in A) and p(x)`.

```meta-lisp skip
(define (trial-and-error)
  (unless (no-more-elements)
    (let ((x (generate-next-element)))
      (if (p x)
        (collect-solution x)
        (trial-and-error)))))
```
