---
:title 模块系统
---

meta-lisp 的模块系统基于文件：每个 `.meta` 文件就是一个模块。

# 模块声明

每个 `.meta` 文件必须以 `(module name)` 开头：

```scheme
;; src/math.meta —— math 是用户自定义模块，并非语言内置
(module math)

(claim pi float-t)
(define pi 3.14159)

(claim circumference (-> float-t float-t))
(define (circumference r)
  (fmul 2.0 (fmul pi r)))
```

# 导入

| 语句 | 语法 | 语义 |
|---|---|---|
| `import` | `(import mod name ...)` | 从模块导入指定名字 |
| `import-as` | `(import-as mod prefix)` | 导入模块并用前缀重命名 |
| `import-all` | `(import-all mod)` | 导入模块中所有名字 |

```scheme
;; src/main.meta
(module main)

(import math circumference pi)
(import-as list L)

;; 直接使用导入的名字
(define r (circumference 5.0))

;; 使用重命名的前缀
(claim len (L/list-t int-t))
(define len (list 1 2 3))

;; import-all
(import-all set)

(make-set 1 2 3)
```

# 限定名

无论是否导入，都可以用 `mod/name` 语法通过限定名访问：

```scheme
;; 不导入，直接使用限定名
(claim r float-t)
(= r math/circumference 5.0)
```

限定名始终可用，不需要先 `import`。

# (private)

使用 `(private name ...)` 将名字标记为私有，外部模块不可见：

```scheme
(module counter)

(claim counter-state int-t)
(define counter-state 0)

(claim increment (-> void-t))
(define (increment)
  (= counter-state (iadd counter-state 1)))

(claim get-count (-> int-t))
(define (get-count)
  counter-state)

(claim internal-reset (-> void-t))
(define (internal-reset)
  (= counter-state 0))

(private internal-reset counter-state)
```

另一个模块只能访问 `increment` 和 `get-count`，不能访问 `counter-state` 和 `internal-reset`。

# 内置函数

内置函数通过 `builtin/` 前缀访问：

```scheme
(builtin/string-length "hello")  ;; => 5
(builtin/iadd 1 2)               ;; => 3
```

内置函数的声明在 `meta-builtin.meta/src/` 项目中，按类型分组到不同目录。

# (exempt) 声明

如果一个名字定义了但没有使用，编译器会报错。使用 `(exempt name ...)` 免除这个检查：

```scheme
(module my-lib)

(claim helper (-> int-t int-t))
(define (helper x) (imul x 2))

(claim public-fn (-> int-t int-t))
(define (public-fn x) (helper x))

(exempt helper)  ;; helper 只在模块内部使用，标记为 exempt
```

# 整体结构

```
project/
├── project.json           ← 项目配置
└── src/
    ├── main.meta           ← (module main)
    ├── math.meta           ← (module math)
    └── list-utils.meta     ← (module list-utils)
```

```
;; main.meta
(module main)
(import math pi)
(import-as list-utils L)
(import-all list-utils)

(define (start)
  (L/process-all (list 1 2 3)))
```

# 模块解析规则

- 编译器在 `source-directory` 中搜索 `.meta` 文件
- 模块名对应文件名（不含 `.meta` 后缀）
- 同一项目中不能有两个同名模块
- 不能导入项目范围之外的名字（没有包管理器）
