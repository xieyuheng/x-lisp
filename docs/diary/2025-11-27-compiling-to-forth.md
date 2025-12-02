---
title: compiling to forth
date: 2025-11-27
---

相比于 compiling to native code，
compiling to forth 也能形成独立可控的语言实现：

- 用 c 实现 x-forth 解释器。

- x-lisp 直接编译到 x-forth。
  x-forth 大概代替 basic-lisp 的位置。

这种实现方式的好处是：

- x-forth 可移植。

- 可以和未来的编译器 runtime 重用一部分代码：

  - value encoding
  - primitive-function
  - GC

[2025-11-29]

对于要实现 auto curry 的语言来说，
forth 并不能让实现变简单。

除非所有的 call 都是 explicit，
否则引用一个 name 时有 implicit 的规则，
有时需要 call 有时需要 value。

也就是除了对 apply 的 overload 之外，
还有一层对 lookup 的 overload（根据不同 definition）。

另外为了实现 curry，
还需要有对 function 的 quote 语法。

每个 function 也没有自己身的 arity 信息。

有差异，就需要编译器处理。
这样反而会复杂。

除非我们以汇编的形式设计 forth（类似 uxn/tal）：

```ruby
@main
  LIT 2 square LIT 4 EQ OK
  LIT 3 square LIT 9 EQ OK

  LIT 2 CALL &square LIT 4 EQ OK
  LIT 3 CALL &square LIT 9 EQ OK

  LIT 2 LIT &square APPLY LIT 4 EQ OK
  LIT 3 LIT &square APPLY LIT 9 EQ OK

  RET

@square DUP MUL RET
```

`square` 是 `CALL &square` 的缩写，
其效果与 `LIT &square APPLY` 相同。

或者避免用大写来区分：

```ruby
main:
  @lit 2 square @lit 4 @eq @ok
  @lit 3 square @lit 9 @eq @ok

  @lit 2 @call &square @lit 4 @eq @ok
  @lit 3 @call &square @lit 9 @eq @ok

  @lit 2 @lit &square @apply @lit 4 @eq @ok
  @lit 3 @lit &square @apply @lit 9 @eq @ok

  @ret

square: @dup @mul @ret
```

此时所实现的，其实是一个 stack-based byte code interpreter 的汇编器。

要求，所有的 value 都是 tagged。

由于是变长指令集，所以可以用特殊的 op code 来处理 string literal，
比如 `@string "..."`，其中 `"..."` 就是 byte array end with null。

# 参数顺序

[2025-12-02]

为了方便 curry，在 applicative 语言中，
被 curry 的参数在前，target 通常在最后。

在 concatenative 语言中，为了方便 curry，
参数在栈中的顺序要和所对应的
applicative 语言中 parameters 的顺序相反。

比如 `(list-put index value list)`
对应于 `list value index list-put`。
`(list-put index value)` 是一个 curry 了的函数，
`value index list-put` 也可以被定义为一个 curry 了的函数。

但是如果在编译到 forth 时，
反转每个 parameters 的顺序，
这会导致认知上很大的困扰。

并且不能要求每个函数的参数顺序都与 applicative 相反，
比如 `2 1 sub` 应该对应 `(sub 2 1)`。

这基本上就导致了编译到 forth 并不合适。
