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

# xth project

[2025-11-29]

设置 xth 这个新项目，用来探索栈虚拟机。

- 所有 value 带有 tag。

  可以和未来的编译器 runtime 重用一部分代码：

  - value encoding
  - primitive-function
  - GC

- 为作为动态语言的编译器后端而设计。

  与 basic-lisp 的生态位相同，但是不强调优化。

- 学习 uxn/tal，用汇编器的形式来实现类 forth 语言。

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

- 变长指令集架构。

  所以可以用特殊的 op code 来处理 string literal，
  比如 `@string "..."`，其中 `"..."` 就是 byte array end with null。

- 结构化的 label，这样 label 可以带有 metadata。

  比如 `f:` 可以带有 `f/arity:` 或者 `f/metadata:`。
  metadata 具体实现方式待定。

# forth vs assembly

[2025-12-02]

从语法的本是上看，
assembly 在于 layout bytes，
而 forth 在于 interpret token stream。

forth 更灵活，在不同的语法 context 下，
对于某段 token stream 的解释方式可以是任意的。

比如可以用 `[]` 来处理 collection。

单纯 layout bytes 的 assembly 中如何处理类似的 collection？
也许可以让下面两种语法等价：

```ruby
@hex [ 01 02 03 ]
@hex 01 @hex 02 @hex 03
```

但是之前的汇编器，
opcode 和后面跟着的 token，
不是被当作一个整体来看处理的。

比如：

```ruby
@lit 2 @call &square
```

```ruby
@lit     -- layout opcode
2        -- layout tagged value (int)
@call    -- layout opcode
&square  -- layout tagged value (address)
```

也就是说 opcode 不能改变 token stream 的语法。
也许应该改成 opcode 和后面的 token 一起处理。
这样 `@lit` 应该被拆分成 `@int` 和 `@float`，
`&square` 可以写成 `@address square`。
call 可以直接是 `@call square`。

```ruby
@function main
  @int 2 square @int 4 @eq @ok
  @int 3 square @int 9 @eq @ok

  @int 2 @call square @int 4 @eq @ok
  @int 3 @call square @int 9 @eq @ok

  @int 2 @int @address square @apply @int 4 @eq @ok
  @int 3 @int @address square @apply @int 9 @eq @ok

  @ret

@function square
  @dup @mul @ret
```

但是感觉这样也不太对，还是传统的 forth 比较好。
forth 设计之初没有使用类似汇编的方案，
就是为了突破传统汇编的限制。

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
除非完全不考虑手写 forth 的感受，或者大量使用变量。

注意，其他语言在使用 stack-based vm 时，
会使用 explicit 指令来把参数加载到 stack 中，
而不是直接用一个 global stack 传递参数。
对于有局部变量的 stack vm 来说，
这也许是合理的设计。

这也可以解决 arity 的问题，
因为函数的声明需要带有 parameter list，
其中就带有 arity 信息了。

```ruby
def add ( x y )
  x y add
end
```

# x-forth

[2025-12-04]

- stack machine
- tagged value (64 bits)
- extensible by c
- 用类 forth 的方式实现，而不是用汇编器的方式。
  - 方便定义 metadata。
  - 函数内使用 变长指令集。
