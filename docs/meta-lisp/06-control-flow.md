---
:title 控制流
---

# 顺序执行

# (begin)

`(begin e1 e2 ... en)` 依次执行表达式，返回最后一个表达式的值。

```scheme
(begin
  (display "step 1")
  (display "step 2")
  42)  ;; => 42
```

# 函数体中的 begin

在函数体中，`begin` 可以省略。多个表达式直接写：

```scheme
(define (f x)
  (= y (iadd x 1))     ;; 第一个表达式
  (imul y 2))          ;; 最后一个表达式作为返回值

;; 等价于：
(define (f x)
  (begin
    (= y (iadd x 1))
    (imul y 2)))
```

# 局部变量

# (let)

```scheme
(let ((x 1) (y 2))
  (iadd x y))  ;; => 3
```

`let` 的绑定是**并行**的：所有右侧表达式在同一个作用域中求值，互相不可见。

```scheme
(let ((x 1)
      (y (iadd x 1)))  ;; ❌ 错误：x 在右侧不可见
  (iadd x y))
```

# (let*)

```scheme
(let* ((x 1)
       (y (iadd x 1)))  ;; ✅ 顺序绑定，x 已定义
  (iadd x y))           ;; => 3
```

# 单绑定 let

`(let (name rhs) body)` 是 `(let ((name rhs)) body)` 的简写。

```scheme
(let (x 1)
  (iadd x 1))  ;; => 2
```

# (let) 与 (=) 的关系

```scheme
(let ((x 1)) body)
;; 等价于
(begin (= x 1) body)
```

这意味着你完全可以用 `(=)` 代替 `(let)` 来节省缩进：

```scheme
(define (f x)
  (= y (iadd x 1))
  (= z (iadd y 1))
  (iadd y z))
```

# 赋值 =

`(= name exp)` 修改已有变量的值。变量必须先通过 `let`、`let*` 或函数参数绑定。

```scheme
(define (f n)
  (= x 0)
  (= x n)
  x)
```

`=` 不是可变变量意义上的赋值——变量本身仍然是不可变的。`=` 只是 `let` 的语法等价物。

# 条件

# (if)

`if` 必须有 else 分支：

```scheme
(if (int-positive? x)
  (display "正数")
  (display "非正数"))
```

`if` 是表达式，返回一个值：

```scheme
(claim abs (-> int-t int-t))
(define (abs x)
  (if (int-less? x 0) (ineg x) x))
```

# (when) / (unless)

`when` 在条件为真时执行，没有 else 分支：

```scheme
(when debug?
  (display "debug: ")
  (display x))
```

`unless` 在条件为假时执行：

```scheme
(unless (equal? x 0)
  (display (idiv 1 x)))
```

# (cond)

`cond` 是多分支条件。最后一个条件可以是 `else`：

```scheme
(define (sign x)
  (cond
   ((int-positive? x) "positive")
   ((int-negative? x) "negative")
   (else "zero")))
```

# (and) / (or)

短路求值：

```scheme
(and (int? x) (int-positive? x))   ;; 全真才真
(or (equal? x 0) (equal? x 1))     ;; 一真便真
```

# 函数组合

# (pipe)

`(pipe init f1 f2 ... fn)` 将 `init` 传入 `f1`，结果传入 `f2`，以此类推。

```scheme
(pipe 5 add1 double)  ;; 等价于 (double (add1 5)) => 12
```

# (chain)

`(chain f1 f2 ... fn)` 返回一个函数，等价于从左到右组合。

```scheme
((chain add1 double) 5)  ;; 等价于 (double (add1 5)) => 12
```

# (compose)

`(compose f1 f2 ... fn)` 返回一个函数，等价于从右到左组合。

```scheme
((compose add1 double) 5)  ;; 等价于 (add1 (double 5)) => 11
```

# 区别总结

| 形式 | 方向 | 接收 | 返回 |
|---|---|---|---|
| `(pipe init f1 f2)` | 左→右 | 初始值 | 最终值 |
| `(chain f1 f2)` | 左→右 | 初始值 | 函数 |
| `(compose f1 f2)` | 右→左 | 初始值 | 函数 |

# 循环：用尾递归代替

meta-lisp 没有 `for`、`while`、`loop` 等循环控制结构。所有"循环"都用**尾递归函数**实现。

# 累加器模式

```scheme
(claim factorial (-> int-t int-t))
(define (factorial n)
  (define (iter n acc)
    (if (int-less-or-equal? n 1)
      acc
      (iter (isub n 1) (imul acc n))))
  (iter n 1))
```

# 遍历列表

```scheme
(claim sum-list (-> (list-t int-t) int-t))
(define (sum-list xs)
  (define (iter xs acc)
    (match xs
      ((nil) acc)
      ((li head tail) (iter tail (iadd acc head)))))
  (iter xs 0))
```

# GCD（尾递归）

```scheme
(claim gcd (-> int-t int-t int-t))
(define (gcd a b)
  (if (equal? b 0)
    a
    (gcd b (imod a b))))
```

编译器会将尾递归优化为循环，不会消耗栈空间。
