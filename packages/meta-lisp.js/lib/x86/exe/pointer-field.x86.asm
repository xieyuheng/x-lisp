; x86.exe: pointer-t field — anonymous struct, read sub-field via deref
;
; data layout (depth-first):
;   config.table  → 8B placeholder (reloc → entry bytes)
;   entry bytes   → key(8B zeros, reloc → "foo") + value(42)
;   "foo\0"
;
; define-code: load config.table pointer, deref to entry.value, return 42
;   step 1: lea rax,[rel config/table] — load address of the pointer field
;   step 2: mov rax,[rax]              — load the pointer value (entry addr)
;   step 3: mov rax,[rax+8]            — load entry.value (at offset 8)
;   step 4: ret

(define-struct entry-t
  (key string-t)
  (value int64-t))

(define-struct config-t
  (version int64-t)
  (table (pointer-t entry-t)))

(claim my-config config-t)
(define-data my-config
  (struct
    (version 1)
    (table (pointer
             (struct entry-t
               (key "foo")
               (value 42))))))

(define-code read-entry-value
  (block entry
    (lea (reg rax) (address my-config table))
    (mov (reg rax) (reg-deref (reg rax)))
    (mov (reg rax) (reg-deref (reg rax) 8))
    (ret)))
