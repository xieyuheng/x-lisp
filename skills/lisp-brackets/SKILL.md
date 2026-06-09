---
name: lisp-brackets
description: 生成 Meta-lisp 代码时保证括号正确匹配的技术 + 验证脚本
---

# Lisp 括号匹配 Skill

## 生成前检查

写出每个表达式之前，脑中确认它的括号结构属于哪种模板：
- `define` → `(define (<name> <parameter> ...) <body>)`，函数名和参数在同一个 `()` 内
- `let` / `let*` → 双括号绑定 `((name <exp>) ...)`，绑定列表外层有 `()`
- `match` → 每个子句 `(<pattern> <body>)`，pattern 自身带括号
- `cond` → 每个分支 `(<question> <answer>)`，question 自身带括号；`else` 无括号
- `begin` / `lambda` → 单层括号包裹 body
- `define-enum` → 字段列表无外层括号，每个构造器自带 `()`

写完后运行验证：
```bash
python3 .agents/skills/lisp-brackets/check-brackets.py <file.meta>
```

## 模板速查

### define（函数）
```lisp
(define (<name> <parameter> ...)
  <body>)
;; 两个开括号：define + (name parameters)
```

### let / let*
```lisp
(let ((<name> <exp>) ...)
  <body>)
;; 两个开括号：let + binding-list
```

### if
```lisp
(if <condition> <consequent> <alternative>)
;; 条件、真分支、假分支各一个表达式
```

### cond
```lisp
(cond
  (<question> <answer>)
  ...)
;; 每个分支是一个表达式对，没有额外双括号
;; else 是特殊 keyword，不需要包装
```

### match
```lisp
(match <target>
  (<pattern> <body>)
  ...)
;; 每个子句两个表达式：pattern（自带括号）+ body
```

### begin
```lisp
(begin
  <exp> ...)
;; begin 本身不引入额外括号层级
```

### lambda
```lisp
(lambda (<parameter> ...)
  <body>)
;; 两个开括号：lambda + (parameters)
```

### claim（类型声明）
```lisp
(claim <name> <type>)
;; 类型为 (-> A B) 时有两层括号
```

### define-enum
```lisp
(define-enum (<type-name> <type-parameter> ...)
  (<constructor-name> (<field-name> <type>) ...)
  ...)
;; 字段列表没有外层括号
```

## 错误修复

**优先级策略**：Lisp 代码在表达式块末尾常有大量连续闭括号（如 `)))))`），
括号不匹配（偏移1）的最常见原因就是末尾这些连续闭括号多一个或少一个。
收到括号错误时，**首先定位到错误所在表达式块的末尾**，数清楚末尾闭括号
与块首开括号是否数量对应，再按以下方式修复：

- **EXTRA )**: 删除末尾多余的 `)`
- **UNMATCHED OPEN**: 在末尾补上一个 `)`

## 检查清单

1. `check-brackets.py` 通过
2. `let`/`let*` 绑定列表是 `((... ...))` 双括号
3. `match` 子句是 `((pattern) body)`
4. `cond` 的 `else` 没有多余括号
5. 文件末尾没有残留未关闭的表达式
