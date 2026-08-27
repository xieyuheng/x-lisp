---
title: call
---

# 语法

```scheme
(call <target>)
```

# 操作数

```
<target> := (label) (mem)
```

# 描述

函数调用。<target> 为 `(label)` 时静态调用，为 `(mem)` 时间接调用

# 例子

```scheme
(call (label my-func))
(call (mem (reg rax)))
```
