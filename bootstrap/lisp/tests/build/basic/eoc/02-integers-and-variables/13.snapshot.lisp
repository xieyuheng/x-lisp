(define-function main
  (block entry
    (= _₁ (const (@function println-non-void 1)))
    (= _₂ (const (@function iadd 2)))
    (= _₃ (const 42))
    (= _₄ (const (@function ineg 1)))
    (= _₅ (const 10))
    (= _₆ (apply _₄ _₅))
    (= x₁ (apply _₂ _₃ _₆))
    (= _₇ (const (@function iadd 2)))
    (= _₈ (const 10))
    (= _₉ (apply _₇ x₁ _₈))
    (= _↩ (apply _₁ _₉))
    (return _↩)))