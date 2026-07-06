---
title: keyword
---

# 类型

```scheme
(-> pointer-t :content <symbol>)
```

# 描述

零 operand 指令。获取 keyword 的裸指针地址，产生 `pointer-t` 类型的 SSA 绑定。

在加载时通过 relocation 填入 symbol table 中对应 keyword 的地址。

# 例子

```scheme
(= k-addr (keyword :content bar))
```
