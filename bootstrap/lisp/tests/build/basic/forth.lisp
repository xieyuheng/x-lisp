(define-function identity
  (block entry (= x (argument 0)) (return x)))

(define-function swap
  (block entry
    (= f (argument 0))
    (= x (argument 1))
    (= y (argument 2))
    (= _↩ (apply f y x))
    (return _↩)))

(define-function drop
  (block entry
    (= f (argument 0))
    (= _₁ (const (@function curry-put! 3)))
    (= _₂ (const 0))
    (= _₃ (const (@function make-curry 3)))
    (= _₄ (const (@function drop/λ₁ 2)))
    (= _₅ (const 2))
    (= _₆ (const 1))
    (= _₇ (apply _₃ _₄ _₅ _₆))
    (= _↩ (apply _₁ _₂ f _₇))
    (return _↩)))

(define-function drop/λ₁
  (block entry
    (= f (argument 0))
    (= dropped₁ (argument 1))
    (= _₁ (const (@function curry-put! 3)))
    (= _₂ (const 0))
    (= _₃ (const (@function make-curry 3)))
    (= _₄ (const (@function drop/λ₁/λ₁ 2)))
    (= _₅ (const 2))
    (= _₆ (const 1))
    (= _₇ (apply _₃ _₄ _₅ _₆))
    (= _↩ (apply _₁ _₂ f _₇))
    (return _↩)))

(define-function drop/λ₁/λ₁
  (block entry
    (= f (argument 0))
    (= x₁ (argument 1))
    (= _↩ (apply f x₁))
    (return _↩)))

(define-function dup
  (block entry
    (= f (argument 0))
    (= _₁ (const (@function curry-put! 3)))
    (= _₂ (const 0))
    (= _₃ (const (@function make-curry 3)))
    (= _₄ (const (@function dup/λ₁ 2)))
    (= _₅ (const 2))
    (= _₆ (const 1))
    (= _₇ (apply _₃ _₄ _₅ _₆))
    (= _↩ (apply _₁ _₂ f _₇))
    (return _↩)))

(define-function dup/λ₁
  (block entry
    (= f (argument 0))
    (= x₁ (argument 1))
    (= _↩ (apply f x₁ x₁))
    (return _↩)))

(define-function main
  (block entry
    (= _₁ (const (@function println-non-void 1)))
    (= f₁ (const (@function identity 1)))
    (= _₂ (const (@function dup 1)))
    (= _₃ (const (@function identity 1)))
    (= g₁ (apply _₂ _₃))
    (= _₄ (apply g₁ f₁ f₁))
    (= _↩ (apply _₁ _₄))
    (return _↩)))