---
title: return
---

# 类型

```scheme
(-> T void-t)
```

# 描述

函数返回。`return` 是 terminator 指令，必须位于基本块末尾。

# 例子

```scheme
(= ∅.1 (return result))
(= ∅.2 (return (void)))
```
