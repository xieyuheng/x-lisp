---
layout: home
hero:
  name: x-lisp
  text: 编程语言集合
  tagline: 基于 lisp 语法框架的编程语言
  actions:
  - theme: alt
    text: 开发日志
    link: ../diary/
---

## [meta-lisp](../meta-lisp/)

极简的静态类型 lisp。

```meta-lisp
(module math)

(claim factorial (-> int-t int-t))

(define (factorial n)
    (if (int-less-or-equal n 1)
      1
      (imul (factorial (isub n 1)) n)))

(define-test factorial-test
  (assert-equal 1 (factorial 0))
  (assert-equal 1 (factorial 1))
  (assert-equal 2 (factorial 2))
  (assert-equal 6 (factorial 3))
  (assert-equal 24 (factorial 4))
  (assert-equal 120 (factorial 5))
  (assert-equal 720 (factorial 6)))
```

## [元语](../元语/)

meta-lisp 中文翻译为「元语」。<br />
支持中文编程。

```meta-lisp
(模块 数学)

(声明 阶乘 (-> 整数型 整数型))

(定义 (阶乘 数)
  (若 (整数小于等于 数 1)
    1
    (整数乘 (阶乘 (整数减 数 1)) 数)))

(定义测试 阶乘测试
  (断言相等 1 (阶乘 0))
  (断言相等 1 (阶乘 1))
  (断言相等 2 (阶乘 2))
  (断言相等 6 (阶乘 3))
  (断言相等 24 (阶乘 4))
  (断言相等 120 (阶乘 5))
  (断言相等 720 (阶乘 6)))
```

## [basic-lisp](../basic-lisp/syntax)

SSA 中间表示。

```basic-lisp
(define-function (math/factorial n)
  (block body
    (= n (argument :index 0))
    (= int.3 (int :content 1))
    (= value.4 (int-less-or-equal n int.3))
    (branch value.4 :then-label then.1 :else-label else.2))
  (block then.1
    (= int.1 (int :content 1))
    (return int.1))
  (block else.2
    (= int.2 (int :content 1))
    (= value.3 (isub n int.2))
    (= value.2 (call value.3 :name math/factorial))
    (= value.1 (imul value.2 n))
    (return value.1)))
```

## [xvm-lisp](../xvm-lisp/syntax)

XVM 虚拟机。

```xvm-lisp
(define-function (math/factorial n)
  body
  (load-int int.3 1)
  (int-less-or-equal value.4 n int.3)
  (branch value.4 (label then.1) (label else.2))
  then.1
  (load-int int.1 1)
  (return int.1)
  else.2
  (load-int int.2 1)
  (isub value.3 n int.2)
  (call-1 (fn math/factorial) value.3)
  (load-result value.2)
  (imul value.1 value.2 n)
  (return value.1))
```

## [x86-lisp](../x86-lisp/syntax)

使用 lisp 语法的 x86-64 汇编。

```x86-lisp
; conditional branch
;
;   10 > 3, takes is-greater path, returns 1
;

(define-code main
  (mov (reg rax) 10)
  (mov (reg rcx) 3)
  (cmp (reg rax) (reg rcx))
  (j (cc g) (label is-greater))
  (mov (reg rax) 0)
  (ret)
  is-greater
  (mov (reg rax) 1)
  (ret))
```
