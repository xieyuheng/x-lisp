;; var

(@pattern x)
(@pattern _)

;; tael

(@pattern [a b c :x x :y y])
(@pattern [a b c :x x :y y :z z])

;; literal

(@pattern 1)
(@pattern "a")
(@pattern #void)
(@pattern #null)
(@pattern 'a)
(@pattern '(a b c))

;; cons and cons*

(@pattern (cons head tail))
(@pattern (cons* first second tail))

;; escape

(@pattern (cons* first (@escape (iadd 1 1)) tail))
(@pattern (cons* first (@escape (iadd 1 2)) tail))
(@pattern (@escape null))

;; quasiquote

(@pattern `(,first ,(@escape (iadd 1 1)) 3))
(@pattern `(,first ,(@escape (iadd 1 2)) 3))

;; occur many times

(@pattern [x x])
