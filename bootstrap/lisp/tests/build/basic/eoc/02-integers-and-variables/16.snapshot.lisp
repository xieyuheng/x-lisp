(define-function main
  (block entry
    (= _₁ (const (@function println-non-void 1)))
    (= _₂ (const (@function isub 2)))
    (= _₃ (const 50))
    (= _₄ (const 8))
    (= _₅ (apply _₂ _₃ _₄))
    (= _↩ (apply _₁ _₅))
    (return _↩)))