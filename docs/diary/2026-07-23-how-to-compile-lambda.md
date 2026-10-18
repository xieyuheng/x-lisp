---
title: how to compile lambda?
author: xieyuheng
date:  2026-07-23
---

# 目标

关于 lambda 想要支持的特性：

- auto currying -- 参数个数不够时，自动 currying
- 函数 body 内可以有 lambda 匿名函数
- 函数可以返回 lambda 匿名函数

# lambda lifting

首先想到 lambda lifting 这个方案。
把函数内部的 lambda 都提升到顶层，
把 scope 中需要被捕捉的变量作为额外的参数。

例如：

```meta-lisp
(define (main)
  (= one 1)
  (= add1 (lambda (x) (iadd x one)))
  (add1 (add1 0)))

;; =>

(define (main)
  (= one 1)
  (= add1 (main@add1 one))
  (add1 (add1 0)))

(define (main@add1 one x)
  (iadd x one))
```

lambda 原来出现的位置要用一个 partial application 代替，
例如这个例子中的 `(main@add1 one)`。

但是，这种使用 partial application 的方式，
假设了我们的语言支持 auto currying。

# auto currying

实现 auto currying 有两类方案：

- 运行时 auto currying
- 编译时 auto currying

## 运行时 auto currying

首先是运行时实现。

运行时有 curry value：

```c
struct curry_t {
  value_t target;
  value_array_t *args;
};
```

例如 `(@curry main@add1 one)`。

运行时的 `apply` 可以支持重载于任何类型的 value，
比如 function 和 curry。

这意味着 curry 是可以嵌套的，
实现起来非常复杂，很难为 `apply` 直接生成简单的汇编代码，
很难支持隐藏在 `apply` 中的 tall call。

优点是运行时的重载很灵活。

## 编译时 auto currying

更好的实现方式是编译时实现 auto curry。

参数不足时 eta 展开：

```meta-lisp
(iadd 1)

;; =>

(lambda (curried.1)
  (iadd 1 curried.1))
```

参数过量时提前 apply：

```meta-lisp
(define (adder n)
  (lambda (x)
    (iadd n x)))

(adder 1 2)

;; =>

((adder 1) 2)
```

最简单的实现方式是在类型检查的过程中做 elaboration，
即根据 apply 表达式的 target 的 arity，和 apply 的参数个数，
来决定应该做「eta 展开」还是「提前 apply」。

经过 elaboration 之后，所有的 apply 都是参数个数刚好正确的。
也就是说语言中的 auto currying 全被消除了，
语言又回到了简单的、类似 scheme 的语言。

这意味着 arrow type 之间有更严格的等价关系。

在理论上的 lambda calculus 中：

```meta-lisp
(-> int-t int-t int-t) == (-> int-t (-> int-t int-t))
```

但是我们必须严格区分这些 arrow type 的差异，
才能在需要 eta 展开的时候确定 target 的 arity。

另外，如果使用编译时的 auto curry 方案，
就不能使用 lambda lifting 来实现 lambda，
应该使用更简单的 closure conversion。

# closure conversion

运行时有 closure value，与 curry value 类似，
但是 target 只能是 function pointer，不能嵌套。

```c
struct closure_t {
  function_t *function;
  value_array_t *args;
};
```

```meta-lisp
(define (main)
  (= one 1)
  (= add1 (lambda (x) (iadd x one)))
  (add1 (add1 0)))

;; =>

(define (main)
  (= one 1)
  (= add1 (@closure main@add1 one))
  (add1 (add1 0)))

(define (main@add1 @closure x)
  (let ((one (closure-arg 0 @closure)))
    (iadd x one)))
```

编译时可以为 apply 和 tail apply 生成很简单的汇编代码：

```asm
                 ; 假设闭包保存在 rbx 中
  mov rax, [rbx] ; 将闭包元组指针中的第一个元素（函数指针）加载到 rax
  mov rdi, rbx   ; 将闭包自身作为第一个参数传入
  ...            ; 将普通参数放入其他寄存器（rsi 等）
  call rax       ; 间接调用
                 ; 或者对于尾调用
  tail-jmp rax   ; 间接跳转
```

`tail-jmp` 是伪指令，
需要在寄存器分配之后，
确定了 prolog 和 epilog 之后，
才能处理为的真实 `jmp` 指令。

# tail call

想要理解编译 tail call 的方式，
首先要理解编译 call 的方式。

编译 call 时，需要根据函数的所有局部变量使用寄存器的方式，
来生成 .prolog 代码，以在栈中预留空间，给寄存器中保存不下的局部变量，
并且生成 .epilog 代码，以返还在栈中预留的空间。

```asm
.prolog:
  <prolog-body>

.body:
  <function-body>

.epilog:
  <epilog-body>
  ret
```

编译 tail call 时，
只需要把之前预留的 `tall-jmp` 伪指令，
翻译为 `<epilog-body>` + 真实的 `jmp` 指令：

```asm
  tail-jmp rax

;; =>

  <epilog-body>
  jmp rax
```

# limit arity

在使用 x86-64 时，
linux 的寄存器参数是 6 个，
windows 的寄存器参数是 4 个。
C 的 calling convention 都要求，
多余的参数从 caller 的 stack 中取。

按照上面的编译 tail call 的方式，
`<epilog-body>` 会清除这些多余的变量。

因此，为了简化 tail call 的实现，
我们需要把所有的函数的参数个数有限制在 6 个或 4 个之内。
多余的参数都转化为 vector 来传递。

也就是说需要有一个 limit arity pass，
把所有的函数都转化为 arity 在限定范围内的函数。
所有函数调用也都要跟着修改。

由于在 elaboration 处理完 auto currying 之后，
所有的 apply 语法都是参数个数正好的，
所有这个 pass 实现起来很简单。
