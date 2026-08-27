---
title: 指令参考
---

> 通用语法见 [syntax.md](syntax.md)。

# 属性值类型

| 记号 | 含义 |
|------|------|
| `<symbol>` | 符号名，如 `foo` |
| `<int>` | 整数值，如 `42` |
| `<float>` | 浮点值，如 `3.14` |
| `<string>` | 字符串值，如 `"hello"` |
| `<bool>` | 布尔值，如 `(true)` 或 `(false)` |
| `<type>` | 类型引用，如 `int64-t`、`pointer-t` |
| `(<symbol> ...)` | 符号列表，如 `(x y)` |

# 目录

- [二元运算](#二元运算)
- [比较指令](#比较指令)
- [一元运算](#一元运算)
- [字面量](#字面量)
- [常量](#常量)
- [内存操作](#内存操作)
- [控制流](#控制流)
- [函数调用](#函数调用)
- [动态值操作](#动态值操作)

# 二元运算

| 指令 | 输出 | 输入 | 属性 | 描述 |
|------|------|------|------|------|
| `iadd` | `int64-t` | `int64-t` `int64-t` | - | 整数加法 |
| `isub` | `int64-t` | `int64-t` `int64-t` | - | 整数减法 |
| `imul` | `int64-t` | `int64-t` `int64-t` | - | 整数乘法 |
| `idiv` | `int64-t` | `int64-t` `int64-t` | - | 整数除法 |
| `fadd` | `float64-t` | `float64-t` `float64-t` | - | 浮点加法 |
| `fsub` | `float64-t` | `float64-t` `float64-t` | - | 浮点减法 |
| `fmul` | `float64-t` | `float64-t` `float64-t` | - | 浮点乘法 |
| `fdiv` | `float64-t` | `float64-t` `float64-t` | - | 浮点除法 |
| `shl` | `int64-t` | `int64-t` `int64-t` | - | 左移位 |
| `shr` | `int64-t` | `int64-t` `int64-t` | - | 右移位 |
| `bitand` | `int64-t` | `int64-t` `int64-t` | - | 按位与 |
| `bitor` | `int64-t` | `int64-t` `int64-t` | - | 按位或 |
| `bitxor` | `int64-t` | `int64-t` `int64-t` | - | 按位异或 |
| `padd` | `pointer-t` | `pointer-t` `int64-t` | - | 指针字节偏移加法，结果为 `base + offset` |
| `and` | `bool-t` | `bool-t` `bool-t` | - | 逻辑与 |
| `or` | `bool-t` | `bool-t` `bool-t` | - | 逻辑或 |
| `xor` | `bool-t` | `bool-t` `bool-t` | - | 逻辑异或 |

# 比较指令

| 指令 | 输出 | 输入 | 属性 | 描述 |
|------|------|------|------|------|
| `icmp-eq` | `bool-t` | `int64-t` `int64-t` | - | int64 相等 |
| `icmp-ne` | `bool-t` | `int64-t` `int64-t` | - | int64 不等 |
| `icmp-lt` | `bool-t` | `int64-t` `int64-t` | - | int64 小于 |
| `icmp-le` | `bool-t` | `int64-t` `int64-t` | - | int64 小于等于 |
| `icmp-gt` | `bool-t` | `int64-t` `int64-t` | - | int64 大于 |
| `icmp-ge` | `bool-t` | `int64-t` `int64-t` | - | int64 大于等于 |
| `fcmp-eq` | `bool-t` | `float64-t` `float64-t` | - | float64 相等 |
| `fcmp-ne` | `bool-t` | `float64-t` `float64-t` | - | float64 不等 |
| `fcmp-lt` | `bool-t` | `float64-t` `float64-t` | - | float64 小于 |
| `fcmp-le` | `bool-t` | `float64-t` `float64-t` | - | float64 小于等于 |
| `fcmp-gt` | `bool-t` | `float64-t` `float64-t` | - | float64 大于 |
| `fcmp-ge` | `bool-t` | `float64-t` `float64-t` | - | float64 大于等于 |
| `bool-eq` | `bool-t` | `bool-t` `bool-t` | - | bool 相等 |
| `bool-ne` | `bool-t` | `bool-t` `bool-t` | - | bool 不等 |
| `pointer-eq` | `bool-t` | `pointer-t` `pointer-t` | - | pointer 相等 |
| `pointer-ne` | `bool-t` | `pointer-t` `pointer-t` | - | pointer 不等 |
| `value-eq` | `bool-t` | `value-t` `value-t` | - | value identity 相等，对应 `eq?` |
| `value-ne` | `bool-t` | `value-t` `value-t` | - | value identity 不等 |

# 一元运算

| 指令 | 输出 | 输入 | 属性 | 描述 |
|------|------|------|------|------|
| `not` | `bool-t` | `bool-t` | - | 逻辑取反 |
| `tag-int` | `value-t` | `int64-t` | - | 将 int64 包装为 value |
| `tag-float` | `value-t` | `float64-t` | - | 将 float64 包装为 value |
| `tag-bool` | `value-t` | `bool-t` | - | 将 bool 包装为 value |
| `to-int64` | `int64-t` | `value-t` | - | 从 value 解构 int64，运行时类型检查 |
| `to-float64` | `float64-t` | `value-t` | - | 从 value 解构 float64，运行时类型检查 |
| `to-bool` | `bool-t` | `value-t` | - | 从 value 解构 bool，运行时类型检查 |
| `copy` | `T` | `T` | - | 创建 SSA 别名，输入与输出是同一个值 |

# 字面量

| 指令 | 输出 | 输入 | 属性 | 描述 |
|------|------|------|------|------|
| `int64` | `int64-t` | - | `:content <int>` | 创建 `int64-t` 常量 |
| `float64` | `float64-t` | - | `:content <float>` | 创建 `float64-t` 常量 |
| `bool` | `bool-t` | - | `:content <bool>` | 创建 `bool-t` 常量，值为 `(true)` 或 `(false)` |
| `address` | `pointer-t` | - | `:name <symbol>` | 获取顶层符号地址，链接时解析 |

# 常量

| 指令 | 输出 | 输入 | 属性 | 描述 |
|------|------|------|------|------|
| `symbol` | `pointer-t` | - | `:content <symbol>` | 获取 symbol 的裸指针地址 |
| `string` | `pointer-t` | - | `:content <string>` | 获取 C 风格字符串指针地址 |
| `symbol-value` | `value-t` | - | `:content <symbol>` | 获取带 tag 的 symbol 值 |
| `text-value` | `value-t` | - | `:content <text>` | 获取带 tag 的 text 值 |

# 内存操作

| 指令 | 输出 | 输入 | 属性 | 描述 |
|------|------|------|------|------|
| `load` | `T` | `pointer-t` | `:type <type>` | 从 opaque 指针加载值 |
| `store` | - | `pointer-t` `T` | - | 将值写入指针 |
| `size-of` | `int64-t` | - | `:target-type <type>` | 计算目标类型字节大小，编译时常量 |
| `offset-of` | `int64-t` | - | `:struct-type <type>` `:path (<symbol> ...)` | 沿 struct 字段路径计算累积字节偏移，编译时常量 |

# 控制流

| 指令 | 输出 | 输入 | 属性 | 描述 |
|------|------|------|------|------|
| `return` | - | 任意类型 | - | 函数返回，terminator |
| `goto` | - | - | `:label <symbol>` | 无条件跳转，terminator |
| `branch` | - | `bool-t` | `:then-label <symbol>` `:else-label <symbol>` | 条件分支，terminator |

## branch

`branch` 的条件为 `bool-t`，为真时跳转到 `:then-label`，否则跳转到 `:else-label`。

```scheme
(branch cond :then-label positive :else-label non-positive)
```

# 函数调用

| 指令 | 输出 | 输入 | 属性 | 描述 |
|------|------|------|------|------|
| `call` | `R` | `pointer-t` `T ...` | - | 静态函数调用 |
| `tail-call` | - | `pointer-t` `T ...` | - | 尾调用，terminator |
| `apply` | `R` | `value-t` `T ...` | - | 动态函数调用 |
| `tail-apply` | - | `value-t` `T ...` | - | 尾动态调用，terminator |
| `argument` | `T` | - | `:index <int>` | 获取函数参数，从 0 开始，只能在 entry block 使用 |

## call / apply

`call` 的第一个输入是目标函数地址，`apply` 的第一个输入是动态函数值，其余输入都是参数列表。

```scheme
(= result (call add-addr a b))
(= result (apply fn arg1 arg2))
```

## tail-call / tail-apply

语义分别与 `call` / `apply` 相同，但当前栈帧会被回收，且是 terminator 指令。

```scheme
(tail-call address x y)
(tail-apply fn arg1 arg2)
```

# 动态值操作

| 指令 | 输出 | 输入 | 属性 | 描述 |
|------|------|------|------|------|
| `use` | `T` | - | `:type <type>` | 从合并点读取值 |
| `provide` | - | `T` | `:use-site <symbol>` | 向合并点写入值 |

## use / provide

`use` 从合并点读取值，`:type` 声明结果类型；`provide` 向对应 `:use-site` 写入值。多个 `provide` 可对应同一个 `use`。

```scheme
(block then
  (= tagged-sum (tag-int sum))
  (provide tagged-sum :use-site result)
  (goto :label merge))

(block else
  (= tagged-diff (tag-int diff))
  (provide tagged-diff :use-site result)
  (goto :label merge))

(block merge
  (= result (use :type value-t))
  (return result))
```
