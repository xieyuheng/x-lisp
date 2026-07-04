---
title: call
---

# 语法

```scheme
(call <target>)
```

# 操作数

```
<target> := (label) (reg-deref)
```

# 描述

函数调用。<target> 为 `(label)` 时静态调用，为 `(reg-deref)` 时间接调用

# 例子

```scheme
(call (label my-func))
(call (reg-deref (reg rax)))
```
