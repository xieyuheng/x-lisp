---
title: address
---

# 类型

```scheme
(-> pointer-t :name <symbol>)
```

# 描述

零 input 指令。通过 `:name` 属性获取顶层符号的地址，产生 `pointer-t` 类型的 SSA 绑定。

在链接时解析符号表确定最终地址。

# 例子

```scheme
(= add-addr (address :name add))
(= origin-addr (address :name origin))
```
