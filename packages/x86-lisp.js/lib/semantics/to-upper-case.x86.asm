(define-space buffer 8)

;; 注意：必须符合 c 的调用约定

(define-code main
  read
  (mov (reg rax) 0)                  ; specify sys_read call
  (mov (reg rdi) 0)                  ; specify file descriptor 0: standard input
  (mov (reg rsi) (address buffer))   ; pass address of the buffer to read to
  (mov (reg rdx) 1)                  ; tell sys_read to read one char from stdin
  (syscall)

  (cmp (reg rax) 0)              ; look at sys_read's return value in rax
  (j (cc e) (label exit))        ; jump if equal to 0 (0 means eof) to exit:
                                 ; or fall through to test for lowercase

  (cmp (mem byte (address buffer)) 0x61)  ; test input char against lowercase 'a'
  (j (cc b) (label write))                 ; if below 'a' in ascii chart, not lowercase
  (cmp (mem byte (address buffer)) 0x7a)  ; test input char against lowercase 'z'
  (j (cc a) (label write))                 ; if above 'z' in ascii chart, not lowercase

  ; at this point, we have a lowercase character
  ; subtract 20h from lowercase to give uppercase
  ; and then write out the char to stdout:
  (sub (mem byte (address buffer)) 0x20)

  write
  (mov (reg rax) 1)         ; specify sys_write call
  (mov (reg rdi) 1)         ; specify file descriptor 1: standard output
  (mov (reg rsi) (address buffer))     ; pass address of the character to write
  (mov (reg rdx) 1)         ; pass number of chars to write
  (syscall)
  (jmp (label read))

  exit
  (ret))
