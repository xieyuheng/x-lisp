(define-code main
  (block entry
    (mov (reg rax) 1)      ; 系统调用号：对应 sys_write
    (mov (reg rdi) 1)      ; 第1个参数：文件描述符，1 代表标准输出 (stdout)
    (mov (reg rsi) "hello world\n") ; 第2个参数：写入内容的指针
    (mov (reg rdx) 12)     ; 第3个参数：写入内容的长度
    (syscall)              ; 执行 sys_write(1, "hello world\n", 12)
    (ret)))
