(define-function square
  (block entry
    (= x (argument 0))
    (= _₁ (const (@function imul 2)))
    (= _↩ (apply _₁ x x))
    (return _↩)))

(define-function main
  (block entry
    (= _₁ (const (@function println-non-void 1)))
    (= _₂ (const (@function square 1)))
    (= _₃ (const (@function square 1)))
    (= _₄ (const 3))
    (= _₅ (apply _₃ _₄))
    (= _₆ (apply _₂ _₅))
    (= _↩ (apply _₁ _₆))
    (return _↩)))