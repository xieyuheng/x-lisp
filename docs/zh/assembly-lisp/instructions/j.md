---
title: j
---

# 语法

```scheme
(j (cc <code>) (label <name>))
```

# 操作数

```
<code> := e ne l le g ge b be a ae
<name> := 基本块标号
```

# 描述

条件跳转。条件成立跳到 `(label <name>)`，不成立则 fall-through 到下一指令。

`<code>` 为条件码，含义参见[(cc)](../syntax.md#cc)

# 例子

```scheme
(j (cc g) (label is-greater))
(j (cc ne) (label loop))
```
