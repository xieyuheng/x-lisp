(define-function main
  (block entry
    (= _₁ (const (@function println-non-void 1)))
    (= _₂ (const (@function iadd 2)))
    (= _₃ (const 20))
    (= _₄ (const 22))
    (= _₅ (apply _₂ _₃ _₄))
    (= _↩ (apply _₁ _₅))
    (return _↩)))