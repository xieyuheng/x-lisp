(define-space buffer 8)

(define-code main
  (block entry
    ; for correct debugging
    (mov (reg rbp) (reg rsp)))

  (block read
    (mov (reg rax) 0)                  ; specify sys_read call
    (mov (reg rdi) 0)                  ; specify file descriptor 0: standard input
    (mov (reg rsi) (address buffer))   ; pass address of the buffer to read to
    (mov (reg rdx) 1)                  ; tell sys_read to read one char from stdin
    (syscall)

    (cmp (reg rax) 0)              ; look at sys_read's return value in rax
    (j (cc e) (label exit))        ; jump if equal to 0 (0 means eof) to exit:
                                   ; or fall through to test for lowercase

    ; - todo:
    ;   we should support:
    ;   cmp byte [buffer], 61h
    (mov (reg al) (deref (address buffer)))
    (cmp (reg al) 97)               ; test input char against lowercase 'a'
    (j (cc b) (label write))        ; if below 'a' in ascii chart, not lowercase
    (cmp (reg al) 122)              ; test input char against lowercase 'z'
    (j (cc a) (label write))        ; if above 'z' in ascii chart, not lowercase

    ; at this point, we have a lowercase character
    ; subtract 20h from lowercase to give uppercase
    ; and then write out the char to stdout:
    ; - todo:
    ;   we should support:
    ;   sub byte [buffer], 20h
    (sub (reg al) 32)
    (mov (reg rbx) (address buffer))
    (mov (deref (reg rbx)) (reg al)))

  (block write
    (mov (reg rax) 1)         ; specify sys_write call
    (mov (reg rdi) 1)         ; specify file descriptor 1: standard output
    (mov (reg rsi) (address buffer))     ; pass address of the character to write
    (mov (reg rdx) 1)         ; pass number of chars to write
    (syscall)
    (jmp (label read)))

  (block exit
    (ret)))
