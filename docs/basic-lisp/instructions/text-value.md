---
title: text-value
---

# 类型

```scheme
(-> value-t :content <text>)
```

# 描述

零 input 指令。获取带 tag 的 text 值，产生 `value-t` 类型的 SSA 绑定。

与 `text` 不同，结果直接是带有 object tag + text pointer 的完整 `value-t`，可立即用于 meta-lisp 运行时字符串操作。

在加载时通过 relocation 填入带有正确 tag 位的 text 地址。

# 例子

```scheme
(= sv (text-value :content "hello"))
```
