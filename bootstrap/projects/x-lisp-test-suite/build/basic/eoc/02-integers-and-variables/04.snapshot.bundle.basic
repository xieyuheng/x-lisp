(define-function main
  (block entry
    (= _₁ (const (@function println-non-void 1)))
    (= _₂ (const (@function ineg 1)))
    (= _₃ (const 42))
    (= x₁ (apply _₂ _₃))
    (= y₁ (call identity x₁))
    (= z₁ (call identity y₁))
    (= _₄ (const (@function ineg 1)))
    (= _₅ (apply _₄ z₁))
    (= _↩ (apply _₁ _₅))
    (return _↩)))