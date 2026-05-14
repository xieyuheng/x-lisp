---
title: 测试
---

meta-lisp 内置测试框架。

# (define-test)

使用 `(define-test name body)` 定义测试：

```scheme
(define-test add1-test
  (assert-equal 2 (add1 1))
  (assert-equal 0 (add1 -1)))
```

测试体中可以包含多个断言。

# 断言函数

```scheme
(assert cond)                   ;; 断言为真，失败时报错
(assert-not cond)               ;; 断言为假
(assert-equal expected actual)  ;; 断言相等（使用 equal? 比较）
(assert-not-equal a b)          ;; 断言不相等
```

# 运行测试

在项目目录中：

```bash
./meta-lisp.js test --profile
```

包含 builtin 测试：

```bash
./meta-lisp.js test --profile --builtin
```

测试结果示例：

```
test pass
test pass
test pass
```

# 完整示例

```scheme
(module examples)

(claim factorial (-> int-t int-t))

(define (factorial n)
  (if (int-less-or-equal? n 1)
    1
    (imul (factorial (isub n 1)) n)))

(define-test factorial-test
  (assert-equal 1 (factorial 0))
  (assert-equal 1 (factorial 1))
  (assert-equal 2 (factorial 2))
  (assert-equal 6 (factorial 3))
  (assert-equal 24 (factorial 4)))
```

测试失败时：

```scheme
(define-test will-fail
  (assert-equal 1 2))  ;; 运行时报错：assert-equal failed: expected 1, got 2
```

