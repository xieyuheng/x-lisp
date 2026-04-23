---
title: li over-engineering
date: 2026-04-23
---

反思一下 li 的设计过程中的 over-engineering。

所需要的程序其实是一个汇编器，
汇编器更简洁的本质是 layout bytes。

但是对于 li 这个汇编器，我设计成了一个可嵌套的 kv 数据库。
其实只是因为我需要在 runtime 拿到一些 metadata：

- primitive function 和 function 的 arity。
- function 是否代表 variable。
- function 是否代表 test。

最直接的解决方案是，在汇编语言中设计特殊的语法来保存这些 metadata。

- 就方案的一般性而言，设计新语法并处理 sexp，比使用一个 kv db 更一般。

本质的问题在于，可否避免这些 metadata。

- function 的 arity 是为了让 runtime 的 apply 可以处理不同 value。
  可否完全避免在 runtime 的 apply 中做 dispatch？
- variable 可以用 variable setup function 来处理。

over-engineering 会让人忽略本质问题，
比如这里本质的问题是「可否在编译时处理 arity」。

- arity 信息带到运行时，可能是无法避免的，

  因为函数可以作为参数，当一个函数拿到一个 arrow 类型的参数时，
  由于带有不同 arity 结构的 arrow 之间可能是等价的。
  - 比如 `(-> int-t int-t int-t)`
    和 `(-> int-t (-> int-t int-t))` 的 arity 结构不同。
    但是作为类型，是等价的。
  所以具体的 arity 结构信息没法再编译时确定。

  但是只有论证过这一点，才算是处理了本质的问题。

over-engineering 会产生新的伪需求，
比如设计了数据库，就自然需要持久化。

# 关于汇编语言的设计

```li
put factorial/arity 1
fn factorial :local-store 0 :n
fn factorial :label :body
fn factorial :local-load 0 :n
fn factorial :literal 1
fn factorial :call :builtin/int-less-or-equal?
fn factorial :jump-if-not :else₂
fn factorial :jump :then₁
fn factorial :label :then₁
fn factorial :literal 1
fn factorial :return
fn factorial :label :else₂
fn factorial :local-load 0 :n
fn factorial :literal 1
fn factorial :call :builtin/isub
fn factorial :local-store 1 :_₁
fn factorial :local-load 1 :_₁
fn factorial :call :factorial
fn factorial :local-store 2 :_₂
fn factorial :local-load 2 :_₂
fn factorial :local-load 0 :n
fn factorial :tail-call :builtin/imul
```

改为：

```scheme
(define-function factorial/1
  (local-store 0 n)
 body
  (local-load 0 n)
  (literal 1)
  (call builtin/int-less-or-equal?)
  (jump-if-not else₂)
  (jump then₁)
 then₁
  (literal 1)
  (return)
 else₂
  (local-load 0 n)
  (literal 1)
  (call builtin/isub)
  (local-store 1 _₁)
  (local-load 1 _₁)
  (call factorial)
  (local-store 2 _₂)
  (local-load 2 _₂)
  (local-load 0 n)
  (tail-call builtin/imul))
```

或者，用更传统的汇编语法：

```asm
.arity factorial 1
factorial:
  local-store 0
.body:
  local-load 0
  literal 1
  call builtin/int-less-or-equal?
  jump-if-not .else₂
  jump .then₁
.then₁:
  literal 1
  return
.else₂:
  local-load 0
  literal 1
  call builtin/isub
  local-store 1
  local-load 1
  call factorial
  local-store 2
  local-load 2
  local-load 0
  tail-call builtin/imul
```
