(define-function main
  (block entry
    (= _₁ (const (@function println-non-void 1)))
    (= _₂ (const (@function random-dice 0)))
    (= x₁ (apply _₂))
    (= _₃ (const (@function random-dice 0)))
    (= y₁ (apply _₃))
    (= _₆ (const (@function int-less? 2)))
    (= _₇ (const 1))
    (= _₈ (apply _₆ x₁ _₇))
    (branch _₈ main/then₅ main/else₆))
  (block main/let-body₁ (= _↩ (apply _₁ _₄)) (return _↩))
  (block main/then₂
    (= _₁₃ (const (@function iadd 2)))
    (= _₁₄ (const 2))
    (= _₄ (apply _₁₃ y₁ _₁₄))
    (goto main/let-body₁))
  (block main/else₃
    (= _₁₅ (const (@function iadd 2)))
    (= _₁₆ (const 10))
    (= _₄ (apply _₁₅ y₁ _₁₆))
    (goto main/let-body₁))
  (block main/let-body₄ (branch _₅ main/then₂ main/else₃))
  (block main/then₅
    (= _₉ (const (@function equal? 2)))
    (= _₁₀ (const 0))
    (= _₅ (apply _₉ x₁ _₁₀))
    (goto main/let-body₄))
  (block main/else₆
    (= _₁₁ (const (@function equal? 2)))
    (= _₁₂ (const 2))
    (= _₅ (apply _₁₁ x₁ _₁₂))
    (goto main/let-body₄)))