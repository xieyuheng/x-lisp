[diary] xvm-again

需求：

- 我需要 vm 因为 basic-lisp 的 call 指令是带有 dest 变量的，这与 vm 是有差别的。
- 我不需要指令集编码，因为我不需要稳定的二进制接口。
- 我不需要类 forth 的栈 vm，而是需要寄存器 vm，因为 basic-lisp 的函数有很多局部变量。

行动：

- 用 c 实现 xvm 的模拟器（类似 inet-lisp 的 worker）。
- 用 c 实现 xvm.machine 的解释器（lisp 语法）。
- 编译出来 xvm.machine 文件，然后用 xvm 解释执行。

[design] more example about cicada-lisp
