---
title: string
---

# 类型

```scheme
(-> pointer-t :content <string>)
```

# 描述

零 operand 指令。获取 C 风格字符串的指针地址，产生 `pointer-t` 类型的 SSA 绑定。

`:content` 接受字符串值。在加载时通过 relocation 填入 string table 中对应字符串的地址。

# 例子

```scheme
(= str-addr (string :content "hello"))
```
