(define-function Y
  (block entry
    (= f (argument 0))
    (= _₁ (const (@function make-curry 3)))
    (= _₂ (const (@function Y/λ₁ 1)))
    (= _₃ (const 1))
    (= _₄ (const 0))
    (= _₅ (apply _₁ _₂ _₃ _₄))
    (= _₆ (const (@function curry-put! 3)))
    (= _₇ (const 0))
    (= _₈ (const (@function make-curry 3)))
    (= _₉ (const (@function Y/λ₂ 2)))
    (= _₁₀ (const 2))
    (= _₁₁ (const 1))
    (= _₁₂ (apply _₈ _₉ _₁₀ _₁₁))
    (= _₁₃ (apply _₆ _₇ f _₁₂))
    (= _↩ (apply _₅ _₁₃))
    (return _↩)))

(define-function Y/λ₁
  (block entry
    (= u₁ (argument 0))
    (= _↩ (apply u₁ u₁))
    (return _↩)))

(define-function Y/λ₂
  (block entry
    (= f (argument 0))
    (= x₁ (argument 1))
    (= _₁ (const (@function curry-put! 3)))
    (= _₂ (const 0))
    (= _₃ (const (@function make-curry 3)))
    (= _₄ (const (@function Y/λ₂/λ₁ 2)))
    (= _₅ (const 2))
    (= _₆ (const 1))
    (= _₇ (apply _₃ _₄ _₅ _₆))
    (= _₈ (apply _₁ _₂ x₁ _₇))
    (= _↩ (apply f _₈))
    (return _↩)))

(define-function Y/λ₂/λ₁
  (block entry
    (= x₁ (argument 0))
    (= t₁ (argument 1))
    (= _₁ (apply x₁ x₁))
    (= _↩ (apply _₁ t₁))
    (return _↩)))