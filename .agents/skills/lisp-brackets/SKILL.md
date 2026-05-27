---
name: lisp-brackets
description: 生成 Meta-lisp 代码时保证括号正确匹配的技术 + 验证脚本
---

# Lisp Parentheses — AI 代码生成中的括号匹配

## 问题

人类写 Lisp 时依赖**视觉反馈**（编辑器高亮、彩虹括号、括号闪烁）来保证括号匹配。AI 生成代码时没有这个视觉反馈，因此括号不匹配是最常见的错误。

解决办法：把括号匹配从**视觉活动**转化为**算法活动**——用可机械执行的步骤替代眼睛的判断。

## 四步法

生成任何 Lisp 代码时，一律走完这四步才提交结果：

| 步骤 | 名称 | 做什么 |
|------|------|--------|
| 1 | **Tree-First** | 在脑中先画 AST 树结构，再往下翻译 |
| 2 | **Pair-First** | 写 `()` 然后填入内容，而不是先写 `(` 再补 `)` |
| 3 | **Depth Count** | 写完立即数括号深度，检查是否归零 |
| 4 | **Verify** | 运行 `check-brackets.py` 验证 |

### 步骤 1：Tree-First

不要直接写 S-expression 文本。先在脑中把表达式画成一棵树，然后逐层翻译。

```
想写的语义：定义一个函数 fib，n < 2 时返回 n，否则递归相加

画树：
  define
  ├── name: fib
  ├── params: (n)
  └── body: if
            ├── cond: int-less? n 2
            ├── cons: n
            └── alt: iadd (fib (isub n 1)) (fib (isub n 2))

再翻译：
  (define (fib n)          → define + name/params，depth=2
    (if (int-less? n 2)    → if + cond，depth=4
        n                   → cons，depth=3（if的)还没写）
        (iadd (fib (isub n 1))   → alt前半，depth=6
              (fib (isub n 2)))))  → alt后半 + 所有尾括号，depth=0
```

**树画圆了，括号就不会错。**

### 步骤 2：Pair-First

每写一个表达式，顺序永远是：
1. 先写空括号 `()`
2. 把光标移到两个括号之间
3. 填入函数名和参数
4. 对子表达式递归

```
错误方式（AI 常见）：
  (define fib n         ← 先写了开头，在想后面内容
    (if (int-less? n 2  ← 又嵌套
        n
        (iadd ...       ← 结尾的 ) 完全靠"记得"

正确方式：
  ()                                                    → 先写空括号
  (define () ())                                        → define 模板
  (define (fib n) ())                                   → 填入 name/params
  (define (fib n) (if () n ()))                         → if 模板
  (define (fib n) (if (int-less? n 2) n ()))            → 填入 cond
  (define (fib n) (if (int-less? n 2) n (iadd () ())))  → iadd 模板
  (define (fib n) (if (int-less? n 2) n (iadd (fib (isub n 1)) (fib (isub n 2)))))
```

每一步括号都是配对的。Pair-First 的代价是"看起来啰嗦"，但对 AI 而言这是安全的。

### 步骤 3：Depth Count

写完代码后，用肉眼（或用脚本）数括号深度。方法：

- 从头扫描，`(` = +1，`)` = -1
- 如果某处深度变为负值：**多了 `)`**
- 如果结束时深度 > 0：**少了 `)`**

简单的自检（不需要工具）：
```
(define (fib n)          | depth: 2   (两个开，零个闭)
  (if (int-less? n 2)    | depth: 4
      n                   | depth: 3   (一个闭)
      (iadd (fib (isub n 1))   | depth: 6
            (fib (isub n 2)))))  | depth: 0 ✓
```

### 步骤 4：Verify

```bash
python3 .agents/skills/lisp-brackets/check-brackets.py <file.meta>
```

输出格式：
- OK 时：显示括号统计，无需操作
- EXTRA ) 时：精确到行列，显示多余括号的位置
- UNMATCHED OPEN 时：显示缺失的数量和最后的开括号位置

## 高频出错模式

以下模式在 AI 生成时括号出错率最高。**每个模式都有精确的括号模板，直接套用。**

### let / let*（绑定双括号）

```lisp
;; 模板：外层 (...)，内层每个绑定是 (...)
(let ((<name1> <exp1>)     ;; ← 注意：两个开括号
      (<name2> <exp2>))    ;; ← 一个闭括号结束绑定，一个开括号开始新绑定
  <body>)                  ;; ← 一个闭括号结束 binding-list，一个闭括号结束 let

;; 正确示例
(let ((x 1)
      (y 2))
  (iadd x y))
;; depth: 2 → 2 → 1 → 1 → 1 → 2 → 0 ✓
```

**常见错误：**
```lisp
(let (x 1)      ;; ✗ 缺少一个 ( 包裹绑定列表
     (y 2)
  (iadd x y))

(let ((x 1      ;; ✗ 少写一个 ) — x 的绑定没关闭
      (y 2))
  (iadd x y))
```

### match（子句双括号）

```lisp
;; 模板：每个子句是 ((<pattern>) <body>)
(match <target>
  ((<ctor1> <field1> ...) <body1>)   ;; 三个开括号：match + clause + pattern
  ((<ctor2> <field1> ...)            ;; 两个开括号（如果 body 跨行或是一个表达式）
   <body2>))

;; 正确示例
(match result
  ((ok value) value)
  ((err msg) (begin
               (format "Error: {}" msg)
               void)))
;; depth: 1 → 2 → 1 → 2 → 1 → 0 ✓
```

**常见错误：**
```lisp
(match result
  (ok value) value)       ;; ✗ 每个子句缺少外括号
```

### cond（条件双括号）

```lisp
;; 模板：每个分支是 ((<question>) <answer>)
(cond
  ((<question1>) <answer1>)
  ((<question2>) <answer2>)
  (else <answer3>))       ;; else 不需要双括号！
```

**常见陷阱：**
```lisp
(cond
  ((else) value))   ;; ✗ else 不应该有括号包裹
;; 正确：
(cond
  (else value))
```

### define-struct / define-enum（无外括号的字段列表）

```lisp
;; 字段列表没有外层括号包裹——每个字段自身是括号
(define-struct point-t
  (x float-t) (y float-t))  ;; 不是 ((x float-t) (y float-t))

(define-enum (option-t E)
  (none)
  (some (value E)))
```

### 深层嵌套调用（尾括号堆积）

```lisp
;; 错误极易出在结尾的 ) 数量

;; 树形理解：
process
├── validate
│   └── parse
│       └── input
;; ───────────────── 翻译时要写 4 个 )

;; Pair-First 写法：
()                                              → 空括号
(process ())                                    → 填充函数名
(process (validate ()))                         → 嵌套一层
(process (validate (parse ())))                 → 再嵌套一层
(process (validate (parse input)))              → 填入最内层参数
;; 此时所有括号自动匹配

;; 写成一行：
(process (validate (parse input)))
;; 注意：末尾 4 个 )
```

### begin（无额外括号包裹 body）

```lisp
;; begin 本身不引入额外括号层级
(begin
  (step1)
  (step2)
  <final-exp>)     ;; 只关闭 begin 自身的括号

;; 常见错误：把 body 当成 let 的 body 那样多写括号
(begin
  ((step1)     ;; ✗ step1 不应该有双括号
   (step2)))
```

### lambda

```lisp
(lambda (<param> ...) <body>)
;; 参数量正确，body 根据复杂度决定是否换行
```

## 错误修复流程

当 `check-brackets.py` 报错时：

### EXTRA ) 错误

```
src/foo.meta:5:12  EXTRA ) — depth went negative (-1)
  L5:     (iadd 1 x)))
                    ^
```

修复方法：定位到指定行，该列上有一个不应该存在的 `)`。直接删除即可。

### UNMATCHED OPEN 错误

```
src/foo.meta:15  UNMATCHED OPEN — 3 open paren(s) never closed
  Last opened: L12:5
  L12:   (define (fib n)
```

修复方法：
1. 跳到 "Last opened" 指向的行
2. 该行的一个 `(` 从未被关闭——找出是哪个表达式没有收尾
3. 在该表达式的末尾（通常是文件末尾或下一个顶层表达式之前）补上相应数量的 `)`

如果文件只有 15 行，需要 3 个 `)`，通常是这样写：
```lisp
  L15: )))
```

## 检查清单（每次生成后逐条确认）

1. `(` 和 `)` 总数一致（`check-brackets.py` 通过）
2. 每个 `let` / `let*` 的绑定列表有正确的双括号 `((... ...))`
3. 每个 `match` 子句是 `((pattern) body)` 双括号结构
4. `cond` 的 `else` 子句没有多余括号
5. `define-struct` / `define-enum` 的字段列表没有外层括号
6. 文件末尾没有残留未关闭的表达式
