# 常见问题（FAQ）

## 有 for/while 循环吗？

没有。用**尾递归函数**代替：

```scheme
(define (sum-list xs)
  (define (iter xs acc)
    (match xs
      ((nil) acc)
      ((li head tail) (iter tail (iadd acc head)))))
  (iter xs 0))
```

编译器会将尾递归优化为循环，不消耗栈空间。

## 怎么定义局部变量？

三种方式：

```scheme
;; 1. let（并行绑定）
(let ((x 1) (y 2)) (iadd x y))

;; 2. let*（顺序绑定）
(let* ((x 1) (y (iadd x 1))) y)

;; 3. = 在函数体中直接赋值
(define (f n)
  (= x (iadd n 1))
  (imul x 2))
```

`(let ((x e1)) body)` 等价于 `(begin (= x e1) body)`。

## 如何比较两个值？

```scheme
(equal? a b)     ;; 结构相等（推荐）
(same? a b)      ;; 引用同一性
```

`equal?` 比较结构，`same?` 比较引用。

## 如何输出调试信息？

```scheme
(display x)      ;; 输出值
(println x)      ;; 输出值并换行
(print x)        ;; 输出值（不换行）
(write s)        ;; 输出字符串
(format x)       ;; 将值格式化为字符串
```

## 和 TypeScript 有什么区别？

| TypeScript | meta-lisp |
|---|---|
| union 类型 `string \| number` | ❌ 不支持 |
| intersection 类型 | ❌ 不支持 |
| 子类型（interface extends） | ❌ 不支持 |
| 泛型 `<T>` | ✅ `(polymorphic (A) ...)` |
| `any` / `unknown` | ❌ 不支持 |
| 结构类型（structural typing） | ❌ 仅有 nominal 类型 |

## 和 Scheme 有什么区别？

- **静态类型**：Scheme 是动态类型，meta-lisp 是静态类型
- **没有 `set!`**：meta-lisp 的 `=` 只是 let 的语法等价物，不是真正的可变赋值
- **没有 `define` 嵌套**：不能像 Scheme 那样在函数体内用 `define`
- **没有宏**：meta-lisp 当前没有宏系统
- **模块系统**：meta-lisp 有基于文件的模块系统

## 和 Haskell 有什么区别？

- **语法**：S-expression vs Haskell 的数学风格语法
- **无类型类**：meta-lisp 没有 typeclass，多态通过 Hindley-Milner 实现
- **无惰性求值**：meta-lisp 是严格求值（call-by-value）
- **副作用**：meta-lisp 允许副作用（I/O、打印等）

## (claim) 和 (define) 的规则？

所有函数和变量必须先声明类型再定义：

```scheme
(claim add1 (-> int-t int-t))
(define (add1 x) (iadd x 1))
```

测试（`define-test`）不需要 `claim`。

## 自定义构造器名？

单构造器时用 `define-struct*`：

```scheme
(define-struct* point-t (cons-point (x int-t) (y int-t)))
(cons-point 1 2)
```

多构造器时每个构造器名就是其名字。

## 为什么类型名必须用 `-t` 结尾？

这是命名约定。`define-struct` 会自动将类型名末尾的 `-t` 替换为 `make-` 来生成构造器名（如 `point-t` → `make-point`）。如果不想用这个约定，用 `define-struct*` 或 `define-algebraic-type`。

## 类型错误看不懂怎么办？

启用 verbose 模式获取更多信息：

```bash
./meta-lisp.js check --verbose
```

常见的类型错误：

```
Type mismatch: expected int-t, got string-t    ← 参数类型不对
Expected function type, got int-t               ← 把非函数当函数作用了
Unbound variable: foo                           ← 变量未定义或未导入
```
