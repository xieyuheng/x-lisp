---
title: 通过逐步细化进行程序开发
subtitle: 学习 Niklaus Wirth 的方法
module: stepwise
---

# 问题

给定一个 8 × 8 的棋盘，放置 8 个皇后，使得任意两个皇后都不能互相攻击：

- 不能位于同一行；
- 不能位于同一列；
- 不能位于同一条主对角线；
- 不能位于同一条副对角线。

这个问题适合用试错法解决。设候选解的集合为 `A`，条件为 `p`，那么一个解就是满足 `(x in A) and p(x)` 的 `x`。

本文中的伪代码用 `skip` 标记，不参与编译；最终的 `meta-lisp` 代码会被收集、编译并测试。

# 试错与预选

最直接的程序会不断生成 `A` 中的候选解，直到找到一个满足 `p` 的解：

```meta-lisp skip
(define (trial-and-error)
  (let ((candidate (generate-next-candidate)))
    (cond
      ((no-more-candidates?) (nothing))
      ((candidate-is-solution? candidate) (just candidate))
      (else (trial-and-error)))))
```

但是 `A` 通常非常大，穷举所有候选解并逐个检查 `p` 并不现实。

一个重要的改进是把条件拆成两个条件：

```text
p = q and r
```

其中 `r` 用来快速排除明显不可能成功的候选，`q` 再检查剩余条件。令：

```text
Br = { x | (x in A) and r(x) }
```

于是只需要生成 `Br` 中的元素，而不是生成整个 `A`。对于 8 皇后问题，`r` 可以是：

- 每一列恰好有一个皇后。

而 `q` 则是：

- 每一行至多有一个皇后；
- 每一条对角线上至多有一个皇后。

这样，候选集从所有棋盘布局缩小为逐行放置的安全布局。

# 部分解与回溯

把潜在的解写成：

```text
[x1, x2, ..., xn]
```

其中 `xi` 表示第 `i` 行皇后所在的列。于是可以引入部分解：

```text
[x1]
[x1, x2]
[x1, x2, ..., xk]
```

一个关键观察是：

> 如果一个部分解已经不满足安全性条件，那么无论怎样继续扩展它，都不可能得到完整解。

因此，搜索可以在发现冲突时立即回退。回溯可以用深度优先搜索实现，而深度优先搜索可以在递归过程中自然实现，不需要额外分配内存来保存搜索状态。

一般的递归搜索骨架可以写成：

```meta-lisp skip
(define (search state)
  (if (complete? state)
    (@list state)
    (list-map-concat
      (next-states state)
      search)))
```

这里 `list-map-concat` 等价于 `concatMap`。递归树就是搜索树，而函数调用栈就是回溯栈。

# 数据结构

我们用列号列表表示部分解。列表中最新的选择放在最前面：

```text
placed = (@list column-of-last-row ... column-of-first-row)
```

例如，`(@list 3 1 0)` 表示：

- 第 0 行皇后在第 1 列；
- 第 1 行皇后在第 3 列；
- 第 2 行皇后在第 0 列。

列表长度就是已经处理的行数。搜索完成时再反转列表，使输出顺序与棋盘从上到下的行顺序一致。

这种表示让程序和数据结构的细化保持同步：递归深度对应行，候选值对应列，部分解对应已经放置的皇后。

# 安全性判断

判断一个新皇后是否安全时，需要检查它和所有已放置皇后的关系。

同一列的检查很直接。对角线检查可以用行列距离表示：两个皇后如果在同一条对角线上，它们的列距离必须等于行距离。

```meta-lisp
(claim int-distance (-> int-t int-t int-t))

(define (int-distance x y)
  (int-max (isub x y) (isub y x)))

(claim safe? (-> (list-t int-t) int-t int-t bool-t))

(define (safe? placed column distance)
  (cond
    ((list-is-empty placed) true)
    ((equal column (car placed)) false)
    ((equal distance (int-distance column (car placed))) false)
    (else (safe? (cdr placed) column (iadd distance 1)))))
```

因为 `placed` 中最新放置的皇后在最前面，所以递归时 `distance` 从 1 开始递增，恰好对应新皇后与已有皇后之间的行距离。

# 生成候选列

预选条件 `r` 在这里具体化为：在下一行中，只保留与当前部分解不冲突的列。

```meta-lisp
(claim candidate-columns (-> int-t (list-t int-t) (list-t int-t)))

(define (candidate-columns n placed)
  (list-filter
    (list-range n)
    (lambda (column) (safe? placed column 1))))
```

`list-range` 生成 `0` 到 `n - 1` 的列号，`list-filter` 只保留安全的选择。这正是 Wirth 所说的预选策略。

# 递归搜索

现在把部分解、预选和递归组合起来：

- 如果已经处理完所有行，就得到一个完整解；
- 否则，枚举所有安全候选列，并对每个候选列递归处理下一行；
- 用 `list-map-concat` 把所有分支得到的解连接成一个列表。

```meta-lisp
(claim search-queens
  (-> int-t int-t (list-t int-t) (list-t (list-t int-t))))

(define (search-queens n row placed)
  (if (equal row n)
    (@list (list-copy-reverse placed))
    (list-map-concat
      (candidate-columns n placed)
      (lambda (column)
        (search-queens n (iadd row 1) (cons column placed))))))

(claim queens (-> int-t (list-t (list-t int-t))))

(define (queens n)
  (search-queens n 0 (@list)))
```

`queens` 返回所有解，而不仅仅是第一个解。它对应 Wirth 文章后半部分讨论的广义 8 皇后问题。

# 打印棋盘

为了观察结果，还需要把列号列表渲染成棋盘。

```meta-lisp
(claim solution-row-text (-> int-t int-t text-t))

(define (solution-row-text n column)
  (text-join
    (list-map
      (list-range n)
      (lambda (index) (if (equal index column) "Q" ".")))
    " "))

(claim solution-to-text (-> int-t (list-t int-t) text-t))

(define (solution-to-text n solution)
  (text-join
    (list-map solution (lambda (column) (solution-row-text n column)))
    "\n"))
```

每一行用 `Q` 表示皇后，用 `.` 表示空格。行与行之间用换行符连接。

# 验证

下面的测试检查小规模问题的解的数量，并验证 4 皇后问题的第一个解的棋盘文本。最后打印 8 皇后问题的第一个解。

```meta-lisp
(define-test queens-test
  (assert-equal 1 (list-length (queens 1)))
  (assert-equal 0 (list-length (queens 2)))
  (assert-equal 2 (list-length (queens 4)))
  (assert-equal 92 (list-length (queens 8)))
  (assert-equal
    ". Q . .\n. . . Q\nQ . . .\n. . Q ."
    (solution-to-text 4 (list-head (queens 4))))
  (println (solution-to-text 8 (list-head (queens 8)))))
```

8 皇后问题一共有 92 个解。第一个解的棋盘输出为：

```text
Q . . . . . . .
. . . . Q . . .
. . . . . . . Q
. . . . . Q . .
. . Q . . . . .
. . . . . . Q .
. Q . . . . . .
. . . Q . . . .
```

# 结论

这个例子展示了逐步细化的几个要点：

1. 程序构造是一系列细化步骤。每一步把一个任务分解成若干子任务，同时细化子任务之间传递的数据结构。
2. 预选条件把庞大的候选集缩小为容易生成、容易检查的安全候选集。
3. 部分解配合递归，可以自然地表达深度优先搜索和回溯，不需要显式的可变搜索状态。
4. 程序与数据结构需要并行细化。选择「最新选择在前的列号列表」之后，安全性判断、候选生成和最终输出都变得直接。
5. 伪代码可以先用问题域中自然的表示，再逐步变成可执行的 `meta-lisp` 代码。

与 Wirth 的原始程序相比，这里的最终实现不使用可变的 `board`、`pointer` 和显式的 `repeat` / `regress`。回溯由递归调用栈完成，搜索树由 `list-map-concat` 展开。这正是 meta-lisp 风格的递归算法。
