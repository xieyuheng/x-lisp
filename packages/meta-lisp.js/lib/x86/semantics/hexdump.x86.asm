; hexdump: 读取 stdin，以十六进制逐行输出
;
; 迁移自 nasm 示例:
;   x64ASMSBS/Chapter 9/hexdump1gcc/hexdump1gcc.asm
;
; 与原版的差异：
; - 符号 + 寄存器寻址 ([Digits+rax]) 用基址寄存器 + SIB 展开
; - inc 用 add 1
; - equ / $ 用魔数（注释标出原常量）
; - 遵守 C 调用约定：
;   - caller-saved 寄存器可用：rax rcx rdx rsi rdi r8-r11
;   - callee-saved 寄存器需要保存才可用：rbx rbp r12-r15

; Text buffer, reserve 16 bytes
; We read the file 16 bytes at a time
(define-space buffer 16)

(define-data hex-digits "0123456789ABCDEF")
(define-data hex-output " 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00\n")

(define-code main
  (block prelog
    (push (reg rbx))
    (push (reg r15)))

  (block read
    ; Read a buffer full of text from stdin:
    (mov (reg rax) 0)                   ; Specify sys_read call 0
    (mov (reg rdi) 0)                   ; Specify File Descriptor 0: Standard Input
    (mov (reg rsi) (address buffer))    ; Pass offset of the buffer to read to
    (mov (reg rdx) 16)                  ; Pass number of bytes to read at one pass
    (syscall)                           ; Call sys_read to fill the buffer
    (mov (reg r15) (reg rax))           ; Save # of bytes read from file for later
    (cmp (reg rax) 0)                   ; If rax=0, sys_read reached EOF on stdin
    (j (cc e) (label done))             ; Jump If Equal (to 0, from compare)

    (xor (reg rcx) (reg rcx)))          ; Clear hex-output pointer to 0

  (block scan
    ; Here we calculate the offset into the hex-output, which is rcx X 3
    (mov (reg rdx) (reg rcx))                 ; Copy the pointer into hex-output into rdx
    (shl (reg rdx) 1)                         ; Multiply pointer by 2 using left shift
    (add (reg rdx) (reg rcx))                 ; Complete the multiplication X3

    ; Get a character from the buffer and put it in both rax and rbx:
    (xor (reg rax) (reg rax))                 ; Clear rax to 0
    (mov (reg rsi) (address buffer))          ; Place address of file buffer into rsi
    (add (reg rsi) (reg rcx))
    (mov (reg al) (deref (reg rsi)))          ; Put a byte from the input buffer into al
    (mov (reg rbx) (reg rax))                 ; Duplicate byte in bl for second nybble

    ; Place address of hex-output into rdi
    (mov (reg rdi) (address hex-output))
    (mov (reg rdi) (deref (reg rdi)))

    ; Look up low nybble character and insert it into the string:
    (and (reg al) 0x0f)                       ; Mask out all but the low nybble
    (mov (reg rsi) (deref (address hex-digits)))
    (add (reg rsi) (reg rax))
    (mov (reg al) (deref (reg rsi)))           ; Look up the char equivalent of nybble
    (mov (deref (reg rdi) (reg rdx) 1 2) (reg al)) ; Write the char equivalent to hex-output

    ; Look up high nybble character and insert it into the string:
    (shr (reg bl) 4)                           ; Shift high 4 bits of char into low 4 bits
    (mov (reg rsi) (deref (address hex-digits)))
    (add (reg rsi) (reg rbx))
    (mov (reg bl) (deref (reg rsi)))           ; Look up the char equivalent of nybble
    (mov (deref (reg rdi) (reg rdx) 1 1) (reg bl)) ; hex-output[rdx+1] = r10b

    ; Bump the buffer pointer to the next character and see if we're done:
    (add (reg rcx) 1)                 ; Increment hex-output pointer
    (cmp (reg rcx) (reg r15))         ; Compare to the number of characters in the buffer
    (j (cc be) (label scan)))         ; Loop back if rcx is <= number of chars in buffer

  (block write
    ; Write the line of hexadecimal values to stdout:
    (mov (reg rax) 1)                  ; Specify syscall call 1: sys_write
    (mov (reg rdi) 1)                  ; Specify File Descriptor 1: Standard output
    (mov (reg rsi) (deref (address hex-output)))   ; Pass address of hex-output in rsi
    (mov (reg rdx) 49)                 ; Pass size of the hex-output in rdx
    (syscall)
    (jmp (label read)))

  (block done
    (pop (reg r15))
    (pop (reg rbx))
    (ret)))
