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

| 上下文         | 语义                                  |
|----------------|---------------------------------------|
| `let` 上下文   | rhs 的结果要绑定给 `x`，然后执行 cont |
| `begin` 上下文 | head 的结果要丢弃，然后执行 cont      |
| `if` 上下文    | cond 的结果决定走 `then` 还是 `else`  |

每种上下文都必须处理 rhs/head/cond 中可能出现的三种形式，
产生 3 × 3 = 9 种变换情况。

# 九种变换

## let

### rhs 是 let — 上浮内层绑定

```scheme
(let ((x (let ((y 1)) (+ y 2))))
  (+ x 3))

;; =>

(let ((y 1))
  (let ((x (+ y 2)))
    (+ x 3)))
```

### rhs 是 begin — 副作用提前

```scheme
(let ((x (begin (f a) 42)))
  (+ x 3))

;; =>

(begin (f a)
  (let ((x 42))
    (+ x 3)))
```

### rhs 是 if — 需要 join 节点

`let` 的结果来自 `if` 的两条分支，需要 join block 收敛控制流。

```scheme
(let ((x (if p (f a) (f b))))
  (+ x 3))

;; =>

(if p
  (let ((x (f a)))
    (goto let-body))
  (let ((x (f b)))
    (goto let-body)))

let-body:
  (+ x 3)
```

## begin 上下文 × 3

### head 是 let

```scheme
(begin
  (let ((y 1)) (+ y 2))
  (+ z 3))

;; =>

(let ((y 1))
  (begin (+ y 2)
    (+ z 3)))
```

### head 是 begin

```scheme
(begin
  (begin (f a) (g b))
  (+ z 3))

;; =>

(begin (f a)
  (begin (g b)
    (+ z 3)))
```

### head 是 if — 需要 join 节点

```scheme
(begin
  (if p (f a) (g b))
  (+ z 3))

;; =>

(if p
  (begin
    (f a)
    (goto begin-body))
  (begin
    (g b)
    (goto begin-body)))

begin-body:
  (+ z 3)
```

## if 上下文 × 3

### condition 是 let

```scheme
(if (let ((x 1)) (> x 0))
  (f 1)
  (f -1))

;; =>

(let ((x 1))
  (if (> x 0)
    (f 1)
    (f -1)))
```

### condition 是 begin

```scheme
(if (begin (f a) p)
  (g 1)
  (g -1))

;; =>

(begin (f a)
  (if p
    (g 1)
    (g -1)))
```

### condition 是 if — 嵌套短路，需要 label

这是最复杂的变换。外层 `if` 的 then/else 被 captures 为两个
独立 block，内层测试 b 和 c 时分别跳转到对应 block。

```scheme
(if (if a b c)
  (f 1)
  (f -1))

;; =>

(if a
  (goto then.0)
  (goto else.0))

then.0:
  (if b
    (goto then.1)
    (goto else.1))

else.0:
  (if c
    (goto then.1)
    (goto else.1))

then.1:
  (f 1)

else.1:
  (f -1)
```

# 总结

九个 case 共享相同的底层机制：

1. **上浮**：将嵌套结构的子表达式提取到外层，
   使当前位置只留下原子操作。这些情况不需要创建新 block。

2. **分裂**：`if` 位于绑定或副作用位置时，
   需要创建 join block 用 `goto` 连接控制流。
   case 9 是最复杂的情况——条件本身是嵌套 `if`，
   外层 then/else 被 captures 为独立 block，
   内层测试复用时跳转到相应目标。

3×3 的交叉结构是 CPS 扁平化的必然产物。

# 附：FloatPass 不可分离的反例

想把 6 个"上浮"情况提取为独立 pass，但分裂 case 阻止了这种分离。

## 分裂 case 依赖上浮 case

考虑 `let-rhs is if` 分裂 case：

```scheme
(let ((x (if p
           (let ((y 1)) y)     ;; ← 分支是 Let1Term
           (let ((z 2)) z))))
  (+ x 1))
```

分裂展开后需要递归处理每个分支：

```scheme
;; 展开 then 分支
(let ((x (let ((y 1)) y)))
  (goto join))

;; 再用上浮 case 展开
(let ((y 1))
  (let ((x y))
    (goto join)))
```

`(let ((y 1)) y)` 在 `if` 分支内部，不在 rhs/head/condition 位置。
FloatPass 不能提前消除——提到外面会破坏作用域（`y` 只在 then 分支有效）。

同理，`begin-head is if` 依赖 `explicateInBegin1` 中的上浮：

```scheme
(begin
  (if p
    (let ((y 1)) (f y))     ;; ← 分支以 Let1Term 开头
    (let ((z 2)) (g z)))
  (+ z 3))
```

`if-condition is if` 依赖 `explicateInIf` 中的上浮：

```scheme
(if (if a
      (let ((x 1)) (> x 0))   ;; ← 子条件以 Let1Term 开头
      (let ((x 2)) (> x 1)))
  (f 1)
  (f -1))
```

## 结论

三个分裂 case 全部递归调用上下文函数处理分支/子条件。
分支/子条件可以任意嵌套控制流，始终需要上浮 case 来即时展开。
因此 ExplicateControlPass 必须保持全部 9 个 case，不可简化。

FloatPass 只是**在 Term IR 层面重复同样的上浮变换**作为前置规范化步骤，
并不能让 ExplicateControlPass 减少任何一个 case。
