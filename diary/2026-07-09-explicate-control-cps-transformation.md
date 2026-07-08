---
title: ExplicateControl 中的 CPS 变换
authors: [xieyuheng, deepseek-v4-pro]
date: 2026-07-09
---

`ExplicateControlPass`（[meta-lisp.js] pass 170）是 meta-lisp 编译流程的
第二次 IR 降级——将 `Term` IR 转换为 basic IR。
核心任务是把嵌套的控制流结构消解为扁平的 basic block + 线性指令。

meta-lisp Term 有三种控制流形式，可以任意嵌套：

```scheme
(let ((x rhs)) body)   — 绑定 rhs 结果到 x，执行 body
(begin head body)      — 执行 head（丢弃结果），执行 body
(if cond then else)    — 条件分支
```

在 basic IR 中这些必须展平为线性指令：`assign` / `perform` / `test` / `branch` / `goto` / `return`。

# 三种上下文

展开逻辑用 continuation-passing style 组织。每个上下文接收一个
`cont`（"做完这步之后要继续执行的东西"）：

| 上下文 | 语义 |
|--------|------|
| `let` 上下文 | rhs 的结果要绑定给 `x`，然后执行 cont |
| `begin` 上下文 | head 的结果要丢弃，然后执行 cont |
| `if` 上下文 | cond 的结果决定走 `then` 还是 `else` |

每种上下文都必须处理 rhs/head/cond 中可能出现的三种形式，
产生 3 × 3 = 9 种变换情况。

# 九种变换

## let 上下文 × 3

### rhs 是 let — 上浮内层绑定

```scheme
;; 变换前
(let ((x (let ((y 1)) (+ y 2))))
  (+ x 3))

;; 变换后
(let ((y 1))
  (let ((x (+ y 2)))
    (+ x 3)))
```

### rhs 是 begin — 副作用提前

```scheme
;; 变换前
(let ((x (begin (f a) 42)))
  (+ x 3))

;; 变换后
(begin (f a)
  (let ((x 42))
    (+ x 3)))
```

### rhs 是 if — 需要 join 节点

`let` 的结果来自 `if` 的两条分支，需要 join block 收敛控制流。

```scheme
;; 变换前
(let ((x (if cond 10 20)))
  (+ x 3))

;; 变换后
(if cond
  (goto then)
  (goto else))

then:
  (let ((x 10))
    (goto join))

else:
  (let ((x 20))
    (goto join))

join:
  (+ x 3)
```

## begin 上下文 × 3

### head 是 let

```scheme
;; 变换前
(begin
  (let ((y 1)) (+ y 2))
  (+ z 3))

;; 变换后
(let ((y 1))
  (begin (+ y 2)
    (+ z 3)))
```

### head 是 begin

```scheme
;; 变换前
(begin
  (begin (f a) (g b))
  (+ z 3))

;; 变换后
(begin (f a)
  (begin (g b)
    (+ z 3)))
```

### head 是 if — 需要 join 节点

```scheme
;; 变换前
(begin
  (if cond (f a) (g b))
  (+ z 3))

;; 变换后
(if cond
  (goto then)
  (goto else))

then:
  (begin (f a)
    (goto join))

else:
  (begin (g b)
    (goto join))

join:
  (+ z 3)
```

## if 上下文 × 3

### condition 是 let

```scheme
;; 变换前
(if (let ((x 1)) (> x 0))
  (f 1)
  (f -1))

;; 变换后
(let ((x 1))
  (if (> x 0)
    (f 1)
    (f -1)))
```

### condition 是 begin

```scheme
;; 变换前
(if (begin (f a) cond)
  (g 1)
  (g -1))

;; 变换后
(begin (f a)
  (if cond
    (g 1)
    (g -1)))
```

### condition 是 if — 嵌套短路，需要 label

这是最复杂的变换。外层 `if` 的 then/else 被 captures 为两个
独立 block，内层测试 b 和 c 时分别跳转到对应 block。

```scheme
;; 变换前
(if (if a b c)
  (f 1)
  (f -1))

;; 变换后
(if a
  (goto then-0)
  (goto else-0))

then-0:
  (if b
    (goto then-1)
    (goto else-1))

else-0:
  (if c
    (goto then-1)
    (goto else-1))

then-1:
  (f 1)

else-1:
  (f -1)
```

# 总结

九个 case 共享相同的底层机制：

1. **上浮**（cases 1, 2, 4, 5, 7, 8）：将嵌套结构的子表达式提取到外层，
   使当前位置只留下原子操作。这些情况不需要创建新 block。

2. **分裂**（cases 3, 6, 9）：`if` 位于绑定或副作用位置时，
   需要创建 join block 用 `goto` 连接控制流。
   case 9 是最复杂的情况——条件本身是嵌套 `if`，
   外层 then/else 被 captures 为独立 block，
   内层测试复用时跳转到相应目标。

`let` 和 `begin` 上下文高度对称——区别仅在于 rhs 的结果
需要绑定（`let`）还是丢弃（`begin`），以及 join label 前缀。
3×3 的交叉结构是 CPS 扁平化的必然产物。
