---
title: xth project
date: 2025-11-29
---

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
