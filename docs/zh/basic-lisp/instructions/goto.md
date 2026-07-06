---
title: goto
---

# 类型

```scheme
(-> void-t :label <symbol>)
```

# 描述

无条件跳转到指定 label。`goto` 是 terminator 指令，必须位于基本块末尾。

# 例子

```scheme
(goto :label merge)
```
