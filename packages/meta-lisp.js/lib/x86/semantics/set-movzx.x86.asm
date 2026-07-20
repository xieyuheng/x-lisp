; Semantic: setcc + movzx — materialize comparison result as 0/1
;
; Test 1: 10 > 5  → setg al → al=1 → movzx rax, al → rax=1
; Test 2: rax=1 → cmp rax, 1 → sete al → al=1 → movzx rax, al → rax=1
;
; Verifies both setcc and movzx correctly set/read byte registers

(define-code main
  (block entry
    (mov (reg rax) 10)
    (mov (reg rcx) 5)
    (cmp (reg rax) (reg rcx))
    (set (cc g) (reg al))
    (movzx (reg rax) (reg al))

    (mov (reg rcx) 1)
    (cmp (reg rax) (reg rcx))
    (set (cc e) (reg al))
    (movzx (reg rax) (reg al))
    (ret)))
