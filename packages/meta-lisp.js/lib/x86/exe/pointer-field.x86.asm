; x86.exe: pointer-t field — anonymous struct, read sub-field via deref
;
; data layout (depth-first):
;   config.table  → 8B placeholder (reloc → entry bytes)
;   entry bytes   → key(8B zeros, reloc → "foo") + value(42)
;   "foo\0"
;
; define-code: load config.table pointer, deref to entry.value, return 42
;   step 1: mov rax,(address my-config)                       — &my-config
;   step 2: mov rax,[rax + offset-of(config-t table)]         — table pointer (entry addr)
;   step 3: mov rax,[rax + offset-of(entry-t value)]          — entry.value
;   step 4: ret

(define-struct entry-t
  (key string-t)
  (value int64-t))

(define-struct config-t
  (version int64-t)
  (table pointer-t))

(define-data my-config
  (struct config-t
    (version 1)
    (table (pointer
             (struct entry-t
               (key "foo")
               (value 42))))))

(define-code read-entry-value
  (block entry
    (mov (reg rax) (address my-config))
    (mov (reg rax) (reg-deref (reg rax) (offset-of config-t table)))
    (mov (reg rax) (reg-deref (reg rax) (offset-of entry-t value)))
    (ret)))
