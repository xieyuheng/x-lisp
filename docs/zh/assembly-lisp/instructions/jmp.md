---
title: jmp
---

# 语法

```scheme
(jmp <target>)
```

# 操作数

```
<target> := (label) (reg-deref)
```

# 描述

无条件跳转

# 例子

```scheme
(jmp (label merge))
```
