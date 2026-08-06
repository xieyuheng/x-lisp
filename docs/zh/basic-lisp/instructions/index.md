---
title: 指令索引
---

# 指令索引

basic-lisp IR 的所有指令按功能分类。

每条指令的类型签名遵从 `(-> <input-type> ... <output-type> :<key> <attribute-kind>...)` 格式，
`<result-type>` 后的 `:<key> <attribute-kind>` 为属性声明。

- [二元运算](#二元运算)
- [比较指令](#比较指令)
- [一元运算](#一元运算)
- [字面量](#字面量)
- [常量](#常量)
- [内存操作](#内存操作)
- [控制流](#控制流)
- [函数调用](#函数调用)
- [动态值操作](#动态值操作)

## 二元运算

- [`iadd`](iadd.md) — 整数加法
- [`isub`](isub.md) — 整数减法
- [`imul`](imul.md) — 整数乘法
- [`idiv`](idiv.md) — 整数除法
- [`fadd`](fadd.md) — 浮点加法
- [`fsub`](fsub.md) — 浮点减法
- [`fmul`](fmul.md) — 浮点乘法
- [`fdiv`](fdiv.md) — 浮点除法
- [`shl`](shl.md) — 左移位
- [`shr`](shr.md) — 右移位
- [`bitand`](bitand.md) — 按位与
- [`bitor`](bitor.md) — 按位或
- [`bitxor`](bitxor.md) — 按位异或
- [`padd`](padd.md) — 指针偏移加法
- [`and`](and.md) — 逻辑与
- [`or`](or.md) — 逻辑或
- [`xor`](xor.md) — 逻辑异或

## 比较指令

- [`icmp-eq`](icmp-eq.md) — int64 相等
- [`icmp-ne`](icmp-ne.md) — int64 不等
- [`icmp-lt`](icmp-lt.md) — int64 小于
- [`icmp-le`](icmp-le.md) — int64 小于等于
- [`icmp-gt`](icmp-gt.md) — int64 大于
- [`icmp-ge`](icmp-ge.md) — int64 大于等于
- [`fcmp-eq`](fcmp-eq.md) — float64 相等
- [`fcmp-ne`](fcmp-ne.md) — float64 不等
- [`fcmp-lt`](fcmp-lt.md) — float64 小于
- [`fcmp-le`](fcmp-le.md) — float64 小于等于
- [`fcmp-gt`](fcmp-gt.md) — float64 大于
- [`fcmp-ge`](fcmp-ge.md) — float64 大于等于
- [`bool-eq`](bool-eq.md) — bool 相等
- [`bool-ne`](bool-ne.md) — bool 不等
- [`pointer-eq`](pointer-eq.md) — pointer 相等
- [`pointer-ne`](pointer-ne.md) — pointer 不等
- [`value-eq`](value-eq.md) — value 相等
- [`value-ne`](value-ne.md) — value 不等

## 一元运算

- [`not`](not.md) — 逻辑取反
- [`tag-int`](tag-int.md) — 将 int64 包装为 value
- [`tag-float`](tag-float.md) — 将 float64 包装为 value
- [`tag-bool`](tag-bool.md) — 将 bool 包装为 value
- [`to-int64`](to-int64.md) — 从 value 解构 int64
- [`to-float64`](to-float64.md) — 从 value 解构 float64
- [`to-bool`](to-bool.md) — 从 value 解构 bool
- [`copy`](copy.md) — 创建 SSA 别名

## 字面量

- [`int64`](int64.md) — int64 常量
- [`float64`](float64.md) — float64 常量
- [`bool`](bool.md) — bool 常量
- [`address`](address.md) — 符号地址

## 常量

- [`symbol`](symbol.md) — symbol 裸指针
- [`keyword`](keyword.md) — keyword 裸指针
- [`text`](text.md) — C 风格字符串指针
- [`symbol-value`](symbol-value.md) — 带 tag 的 symbol 值
- [`keyword-value`](keyword-value.md) — 带 tag 的 keyword 值
- [`text-value`](text-value.md) — 带 tag 的 text 值

## 内存操作

- [`load`](load.md) — 从指针加载值
- [`store`](store.md) — 将值写入指针
- [`size-of`](size-of.md) — 计算类型字节大小
- [`offset-of`](offset-of.md) — 计算字段偏移

## 控制流

- [`return`](return.md) — 函数返回
- [`goto`](goto.md) — 无条件跳转
- [`branch`](branch.md) — 条件分支

## 函数调用

- [`call`](call.md) — 静态调用
- [`tail-call`](tail-call.md) — 尾调用
- [`apply`](apply.md) — 动态调用
- [`tail-apply`](tail-apply.md) — 尾动态调用
- [`argument`](argument.md) — 获取函数参数

## 动态值操作

- [`use`](use.md) — 从合并点读取值
- [`provide`](provide.md) — 向合并点写入值
