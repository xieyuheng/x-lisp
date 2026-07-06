---
title: keyword-value
---

# 类型

```scheme
(-> value-t :content <symbol>)
```

# 描述

零 operand 指令。获取带 tag 的 keyword 值，产生 `value-t` 类型的 SSA 绑定。

与 `keyword` 不同，结果直接是带有 object tag + keyword pointer 的完整 `value-t`，可立即用于 meta-lisp 运行时操作。

在加载时通过 relocation 填入带有正确 tag 位的 keyword 地址。

# 例子

```scheme
(= k (keyword-value :content bar))
```
