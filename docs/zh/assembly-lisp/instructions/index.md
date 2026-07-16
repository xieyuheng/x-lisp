---
title: 指令索引
---

# 指令索引

assembly-lisp 的所有指令按功能分类。

- [数据移动](#数据移动)
- [算术与逻辑](#算术与逻辑)
- [栈操作](#栈操作)
- [控制流](#控制流)
- [地址计算](#地址计算)
- [杂项](#杂项)

## 数据移动

- [`mov`](mov.md) — 数据传送

## 算术与逻辑

- [`add`](add.md) — 加法
- [`sub`](sub.md) — 减法
- [`imul`](imul.md) — 有符号乘法
- [`cmp`](cmp.md) — 比较（设置标志位）
- [`test`](test.md) — 按位测试
- [`and`](and.md) — 按位与
- [`or`](or.md) — 按位或
- [`xor`](xor.md) — 按位异或
- [`shl`](shl.md) — 左移
- [`shr`](shr.md) — 右移

## 栈操作

- [`push`](push.md) — 压栈
- [`pop`](pop.md) — 弹栈

## 控制流

- [`call`](call.md) — 函数调用
- [`ret`](ret.md) — 函数返回
- [`jmp`](jmp.md) — 无条件跳转
- [`j`](j.md) — 条件跳转

## 地址计算

- [`lea`](lea.md) — Load Effective Address

## 系统调用

- [`syscall`](syscall.md) — 系统调用指令

## 杂项

- [`nop`](nop.md) — 空操作
