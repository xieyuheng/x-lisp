; x86.exe: pointer chain with non-recursive structs — A -> B -> C
;
; node-a.next -> node-b.next -> node-c (value=77)
; define-code derefs a->b->c->value, returns 77
;
; Tests: deferred emit across multiple pointer levels with separate struct types

(define-struct node-c-t
  (value int64-t))

(define-struct node-b-t
  (next pointer-t)
  (value int64-t))

(define-struct node-a-t
  (next pointer-t)
  (value int64-t))

(define-data chain
  (struct node-a-t
    (next (pointer
            (struct node-b-t
              (next (pointer
                      (struct node-c-t
                        (value 77))))
              (value 0))))
    (value 0)))

(define-code read-chain
  (block entry
    (mov (reg rax) (address chain))
    (mov (reg rax) (reg-deref (reg rax) (offset-of node-a-t next)))
    (mov (reg rax) (reg-deref (reg rax)))
    (mov (reg rax) (reg-deref (reg rax)))
    (ret)))
