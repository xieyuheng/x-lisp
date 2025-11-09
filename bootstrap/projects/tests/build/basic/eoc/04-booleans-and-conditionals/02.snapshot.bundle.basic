(define-function main
  (block entry
    (= _₁ (const (@function println-non-void 1)))
    (= _₂ (const (@function random-dice 0)))
    (= x₁ (apply _₂))
    (= _₃ (const (@function random-dice 0)))
    (= y₁ (apply _₃))
    (= _₄ (const (@function iadd 2)))
    (= _₇ (const (@function int-less? 2)))
    (= _₈ (const 1))
    (= _₉ (apply _₇ x₁ _₈))
    (branch _₉ main/then₁₁ main/else₁₂))
  (block main/let-body₁
    (= _₃₁ (apply _₄ _₅ _₁₈))
    (= _↩ (apply _₁ _₃₁))
    (return _↩))
  (block main/then₂
    (= _₂₇ (const (@function iadd 2)))
    (= _₂₈ (const 2))
    (= _₁₈ (apply _₂₇ y₁ _₂₈))
    (goto main/let-body₁))
  (block main/else₃
    (= _₂₉ (const (@function iadd 2)))
    (= _₃₀ (const 10))
    (= _₁₈ (apply _₂₉ y₁ _₃₀))
    (goto main/let-body₁))
  (block main/let-body₄ (branch _₁₉ main/then₂ main/else₃))
  (block main/then₅
    (= _₂₃ (const (@function equal? 2)))
    (= _₂₄ (const 0))
    (= _₁₉ (apply _₂₃ x₁ _₂₄))
    (goto main/let-body₄))
  (block main/else₆
    (= _₂₅ (const (@function equal? 2)))
    (= _₂₆ (const 2))
    (= _₁₉ (apply _₂₅ x₁ _₂₆))
    (goto main/let-body₄))
  (block main/let-body₇
    (= _₂₀ (const (@function int-less? 2)))
    (= _₂₁ (const 1))
    (= _₂₂ (apply _₂₀ x₁ _₂₁))
    (branch _₂₂ main/then₅ main/else₆))
  (block main/then₈
    (= _₁₄ (const (@function iadd 2)))
    (= _₁₅ (const 2))
    (= _₅ (apply _₁₄ y₁ _₁₅))
    (goto main/let-body₇))
  (block main/else₉
    (= _₁₆ (const (@function iadd 2)))
    (= _₁₇ (const 10))
    (= _₅ (apply _₁₆ y₁ _₁₇))
    (goto main/let-body₇))
  (block main/let-body₁₀ (branch _₆ main/then₈ main/else₉))
  (block main/then₁₁
    (= _₁₀ (const (@function equal? 2)))
    (= _₁₁ (const 0))
    (= _₆ (apply _₁₀ x₁ _₁₁))
    (goto main/let-body₁₀))
  (block main/else₁₂
    (= _₁₂ (const (@function equal? 2)))
    (= _₁₃ (const 2))
    (= _₆ (apply _₁₂ x₁ _₁₃))
    (goto main/let-body₁₀)))