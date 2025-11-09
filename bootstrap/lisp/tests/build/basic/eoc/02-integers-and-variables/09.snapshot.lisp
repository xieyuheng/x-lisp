(define-function main
  (block entry
    (= _₁ (const (@function println-non-void 1)))
    (= _₂ (const (@function iadd 2)))
    (= _₃ (const 20))
    (= _₄ (const (@function iadd 2)))
    (= _₅ (const 11))
    (= _₆ (const 11))
    (= _₇ (apply _₄ _₅ _₆))
    (= _₈ (apply _₂ _₃ _₇))
    (= _↩ (apply _₁ _₈))
    (return _↩)))