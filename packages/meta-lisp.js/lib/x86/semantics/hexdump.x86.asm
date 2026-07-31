; hexdump: 读取 stdin，以十六进制逐行输出
;
; 迁移自 nasm 示例:
;   x64ASMSBS/Chapter 9/hexdump1gcc/hexdump1gcc.asm
;
; 与原版的差异：
; - 符号 + 寄存器寻址 ([Digits+rax]) 用基址寄存器 + SIB 展开
; - inc 用 add 1
; - equ / $ 用魔数（注释标出原常量）
; - 遵守 C 调用约定：仅使用 caller-saved 寄存器（rax/rcx/rdx/rsi/rdi/r8-r11），
;   不使用也不破坏 callee-saved 寄存器（rbx/rbp/r12-r15）。
;   原版开头的 (mov (reg rbp) (reg rsp)) 调试行因此被删除（rbp 为 callee-saved）。

(define-space buffer 16)          ; BUFFLEN = 16，每次 sys_read 读取的字节数

(define-data hex-digits "0123456789ABCDEF")
(define-data hex-string " 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00\n")

(define-code main
  (block read
    ; sys_read(0, buffer, BUFFLEN)
    (mov (reg rax) 0)            ; sys_read
    (mov (reg rdi) 0)            ; fd = 0: standard input
    (mov (reg rsi) (address buffer))
    (mov (reg rdx) 16)           ; BUFFLEN
    (syscall)
    (mov (reg r9) (reg rax))    ; 保存本次读取的字节数
    (cmp (reg rax) 0)
    (j (cc e) (label done))      ; EOF 时结束

    ; 计算两张表的基址，Scan 循环内复用
    (mov (reg rdi) (address hex-digits))
    (mov (reg rdi) (deref (reg rdi)))    ; rdi = hex-digits 内容首地址
    (mov (reg r8) (address hex-string))
    (mov (reg r8) (deref (reg r8)))      ; r8  = hex-string 内容首地址
    (xor (reg rcx) (reg rcx)))   ; 行内字节计数

  (block scan
    (xor (reg rax) (reg rax))
    (mov (reg rdx) (reg rcx))
    (lea (reg rdx) (deref (reg rdx) (reg rdx) 2))  ; rdx = rcx * 3，hex-string 偏移
    (mov (reg al) (deref byte (reg rsi) (reg rcx) 1))  ; al = buffer[rcx]
    (mov (reg r10) (reg rax))

    ; 低半字节 → hex-string[rdx + 2]
    (and (reg al) 0x0f)                          ; 掩掉高半字节
    (mov (reg al) (deref byte (reg rdi) (reg rax) 1))  ; al = hex-digits[rax]
    (mov (deref byte (reg r8) (reg rdx) 1 2) (reg al)) ; hex-string[rdx+2] = al

    ; 高半字节 → hex-string[rdx + 1]
    (shr (reg r10b) 4)                           ; 高 4 位移到低 4 位
    (mov (reg r10b) (deref byte (reg rdi) (reg r10) 1))  ; r10b = hex-digits[r10]
    (mov (deref byte (reg r8) (reg rdx) 1 1) (reg r10b)) ; hex-string[rdx+1] = r10b

    (add (reg rcx) 1)
    (cmp (reg rcx) (reg r9))
    (j (cc be) (label scan)))    ; rcx <= 读取字节数时继续

  (block write
    ; sys_write(1, hex-string, HEXLEN)
    (mov (reg rax) 1)            ; sys_write
    (mov (reg rdi) 1)            ; fd = 1: standard output
    (mov (reg rsi) (reg r8))     ; hex-string 内容首地址
    (mov (reg rdx) 49)           ; HEXLEN = 48 字符 + 换行
    (syscall)
    (jmp (label read)))

  (block done
    (ret)))
