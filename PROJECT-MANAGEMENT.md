---
title: x-lisp -- project management
date: 2025-10-22
---

# 价值

一个独立自主的语言。

适合用来写新的解释器与编译器，目的是为了探索新的计算模型。比如：

- interaction net
- pi-calculus
- rewrite system
- propagator model
- logic constraint programming
- reactive programming

方便用 C 扩展，可以作为 app 的脚本语言：

- uxn 风格的 canvas
- uxn 风格的 flash card app

# 范围

只实简单的 dynamic type，所有的 value 都有 tag。

第一个阶段实现 bootstrap compiler：

- x-lisp interpreter
- basic-lisp interpreter
- x-lisp compile to basic-lisp
- C runtime
- basic-lisp codegen to x86

第二个阶段实现 self compiler，
可以直接把 js/ts 代码 port 到 x-lisp。

# 说明

项目管理之前已完成的部分：

- [x] x-lisp language design
- [x] x-lisp interpreter
- [x] basic-lisp language design
- [x] basic-lisp interpreter (no module system)

# 关卡 1 -- 编译器前端

从 x-lisp 编译到 basic-lisp。

成果：

- 能够 basic-lisp 的解释器来运行代码。

范围：

- 先实现一个可扩展的 lambda calculus，这是语言的核心部分。
- 先不考虑 module system。
- 先不考虑 SSA，直接生成最可以多次赋值的 basic block。

任务：

- [x] x-lisp compiler (to basic-lisp)
  - [x] shrink
  - [x] uniquify
  - [x] reveal-function
  - [x] lift-lambda
  - [x] unnest-operand
  - [x] explicate-control

总结 [2025-11-06]：

- 完成这个关卡大概花了一周时间。
  主要工作是 port EOC 的代码到 js/ts。

- 先实现一个小的核心，也就是 lambda calculus 很重要。
  这让我们能够不怕重头开始写编译器，
  而不是重用 interpreter 的代码。

- 遇到的一个难点是在需要写 explicate-control 的时候，
  basic-lisp 的设计还没完全确定。
  推迟确定设计可以获得更多实践中的信息，
  但是设计和研究的时间是不确定的，
  会让项目用时不确定。

- explicate-control 在处理 if 的时候与 EOC 有区别，
  因为 basic-lisp if 的 condition 只能是 variable。
  这样就没有了 EOC 中那个避免两次 compare 的优化：

  - 一次 compare 返回 bool variable；
  - 一次 compare 选择 branch。

  但是这应该可以在后续 basic-lisp 的优化 pass 中实现。

- desugar 到一个简单的核心语法很重要，
  比如核心语法中没有 `begin` 和 `=`，只有 `let1`。

# 关卡 2 -- 模块系统

这是补全上一个关卡没有完成的任务，
也是为 codegen 做准备。

难点：

- bundling 问题对于我来说是新问题。

成果：

- 能够编译带有 module system 的 x-lisp 代码到 basic-lisp。

任务：

- [x] basic-lisp interpreter
  - [x] module system
  - [x] bundling
- [x] x-lisp compiler
  - [x] module system
- [x] project.json

总结 [2025-11-08]：

- 完成 basic-lisp 的 bundling。
  由于解释器的 module system 的语义是
  name 到 definition 的 key-value 映射，
  所以实现 bundler 也很简单。

- 下面需要实现 x-lisp 的模块系统，
  但是在这之前，可能需要有 project 的概念了。

  因为 x-lisp 需要生成中间文件，
  如果不想修改后缀，就要有专门的地方存放中间文件，
  如果不想每次都在命令行参数中重复指明存放中间文件的地方，
  就要有配置文件，也就是 project 的概念。

  也可以尝试跳过 project 的概念，
  以更直接的方式解决问题，
  也就是要把命令行的参数保存成配置文件。

总结 [2025-11-10]：

- 完成 x-lisp 模块系统。

- 需要支持 project 概念，这是任务开始时没有预料到的。

反思 [2025-11-25]：

- 其实还是需要「修改后缀并且把中间文件保存在源代码文件旁边」这个功能。

  这对于对比输出和做 snapshot testing 来说都很方便。

  所以说，在解决一个问题时，大多数时候都应该先考虑最简单的方案。

# 关卡 3 -- machine-lisp

这个关卡也是为 codegen 做准备。

成果：

- 能够用 lisp 语法写汇编代码，这将成为我们未来的独立的汇编器的基础。

范围：

- 不考虑扩展，先忠实的翻译 GAS 语法。
- 不直接编译到 ELF，先依赖 GAS。
- 有 `Mod` 的概念，但是不实现模块系统。

任务：

- [x] machine-lisp
  - [x] language design
  - [x] transpile to GAS

总结 [2025-11-12]：

- 现在所实现的 machine-lisp 可以用来作为编译器的后端工具，
  但是还不能用来手写汇编代码，因为没有像 GAS 一样的编译时变量功能。
  比如，根据当前地址，计算字符串的长度，并且保存在编译时的变量中。

  这个最好在未来用 x-lisp 扩展，
  就是把 x-lisp 作为汇编器的 meta language。

- machine-lisp 与 basic-lisp 是完全相反的两个底层语言：

  - machine-lisp 的 `Instr` 数据类型是通用的 -- `op` + `operands`，
  - basic-lisp 的 `Operand` 数据类型是通用的 -- 就是 `string`。

  对于 machine-lisp 的通用的 `Instr`，可以实现 instr-db 的概念。
  用来描述在编译时所需要知道的，每个 instruction 的各个方面的信息。

- 这个任务的代码很简单，很多可以抄 basic-lisp。

  任务的难点在于想要在未来作为通用的汇编器，
  因此要理解 instruction encoding 本身。

- 了解了一下 X86 的 instruction encoding：

  - https://wiki.osdev.org/X86-64_Instruction_Encoding
  - https://blog.yossarian.net/2020/06/13/How-x86_64-addresses-memory

  确实非常复杂，
  「machine-lisp 作为独立的汇编器」这个项目，
  是需要在 x-lisp 完成之后再做的。

- 想要实现一般的汇编语言，只知道 x86 是不行的，还需要知道 risc-v。

# 关卡 4 -- 代码生成

成果：

- 能够完全脱离 js 的 runtime。

范围：

- GC 可以只支持 tagged value。
- allocate-register 被当作一个优化，之后再做。
- 完全不考虑速度，所有的 builtin 都翻译成函数调用，
  就算是简单的算术运算也是如此。

任务：

- [x] basic-lisp to machine-lisp
  - [x] select-instruction
  - [x] assign-home
  - [x] patch-instruction
  - [x] prolog-and-epilog
- [x] C runtime (with GC)
  - [x] value tag encoding
  - [x] builtin
  - [-] GC

总结 [2025-11-17]：

- 可以编译出来 binary 了（经过 GAS）。
  还差 GC 没有完成。

- 注意，在 runtime 只能有固定参数个数的 apply 函数，
  比如 `apply-unary` 和 `apply-nullary`。

- 另外没有预料到的一点是：
  `apply` 的 target 不能是单纯的 function 地址，
  因为在 `apply` 的过程中可能要形成 `make-curry`，
  而 `make-curry` 需要知道 function 的 arity，
  但是单纯的 function 地址是不带 arity 的。

  EOC 中虽然没有 auto currying，
  但是 flat closure 也需要 arity，
  所以也面临同样的问题。
  解决方案是把每个 function ref 都包在 curry（closure）中。

  只有有了全局变量机制之后，
  可以把所构造的 curry 处理为全局变量，
  以避免在每次引用 function 时都构造 curry。

  - 之前设想的是通过 overload application 来扩展语言的语义，
    但是目前 apply 的 target 只能是 curry（closure）。
    这让我怀疑 overload application 的想法是否正确。

    因为不能使用带有可变参数的 apply，而只能使用 apply-unary，
    意味着 apply overload 到不同 arity 的语义只能是「形成 curry」。
    而 inet-lisp 和 propagator-lisp 中「返回多个值」的语义，
    可能要用新的语法关键词才能表达出来。

    或者可以 overload assignment，
    也就是 `(= (f x y))` 这种语法组合，
    而不是 overload apply 本身。

- 汇编定义的函数不会自动 align 到 8，
  生成 GAS 代码时，需要明确 `.align 8`。

  由于忘记了这个 align，debug 了很久，差点对自己产生怀疑。
  我 gdb 使用地不熟练，我的汇编底层知识也不熟练。
  之后可以尝试逆向一下 gcc 和 clang 所编译出来的汇编，
  补充底层汇编的知识。

总结 [2025-11-24]：

- GC 卡了很久，拆分到一个新的关卡来做。

# 关卡 5 -- 垃圾回收器

为下一个关卡用 C 扩展语言做准备。

成果：

- 能够自动回收动态分配的内存。

范围：

- GC 只需要支持 tagged value。

任务：

- [x] machine-lisp.js
  - [x] define-space
- [x] basic-lisp.js
  - [x] define-variable
  - [x] define-setup
  - [ ] define-metadata
- [x] x-lisp-boot.js
  - [x] `(define <name> <body>)`
  - [ ] setup code for function definition
- [x] runtime
  - [ ] scan stack for root objects
  - [ ] GC

# 关卡 6 -- 功能完备

用 C 扩展语言。

成果：

- 从一个可扩展的 lambda calculus 核心，变成完整的 x-lisp。

任务：

- [ ] feature complete
  - [ ] global variable
  - [ ] symbol
  - [ ] hashtag
  - [ ] string
  - [ ] tael
  - [ ] hash
  - [ ] set
  - [ ] claim

# 关卡 待定 -- 寄存器分配

成果：

- 作为第一个重要的优化，
  语言的运行效率会增加很多。

任务：

- [ ] graph libraries
  - [ ] graph
  - [ ] graph-coloring
  - [ ] digraph
  - [ ] digraph-topological-order
- [ ] basic-lisp codegen (to x86 via GNU assembler)
  - [ ] uncover-live
  - [ ] build-interference
  - [ ] allocate-register

# 关卡 待定 -- SSA

SSA 是后续所有 optimization 的前提。

如果不考虑优化，SSA 对于 codegen 来说是可选的。

难点：

- 研究转化 SSA 的各种方式。

成果：

- 将 basic-lisp 转化为 SSA。

任务：

- [ ] basic-lisp interpreter
  - [ ] SSA

# 关卡 待定 -- 优化

优化放到最后，具体任务待定。
