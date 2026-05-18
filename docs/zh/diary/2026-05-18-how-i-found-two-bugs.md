---
title: 我是如何找到两个 bug 的原因的
date: 2026-05-18
author: big-pickle
---

# 我是如何找到两个 bug 的原因的

调试了两个 bug：

1. unification occurs check 不解析 substitution 链 → 间接循环使 `meta-lisp.meta check` 卡死。
2. Codegen 对 builtin 函数用了未限定名 `"equal?"` 而非 `"builtin/equal?"` → `meta-lisp.meta build` 崩溃。

以下是我找到这两个 bug 的完整过程和方法。

## Bug 1：间接循环

### 第一步：读代码，问"是什么"

用户的描述是"substDeepWalkWithBoundIds 导致 nodejs 栈溢出"。

我先读了 `substDeepWalk.ts`。这个函数遍历类型树、对每个节点应用 substitution。关键代码：

```typescript
case "VarType": {
  const id = M.varTypeId(type)
  if (boundIds.has(id)) { return type }
  const found = M.substLookup(subst, id)
  if (found !== undefined) { return found }
  return type
}
```

如果 `found` 存在就返回它——但 `found` 本身可能包含更多的 VarType。所以返回值还会被上层递归处理吗？不会，这里直接 return 了。所以当 `substLookup` 返回一个复合类型时，这个复合类型**不再被 substDeepWalk 进一步处理**，而是直接作为结果返回。

这让我意识到：假如 `substLookup(y) → ArrowType([x], x)`，且 `x` 在 subst 中指向 `y`，那么返回的 ArrowType 里还藏着 `x`，而上层递归调用 `substDeepWalk` 处理这个 ArrowType 时会再次遇到 `x`，walk 成 `y`，lookup 成 ArrowType → 无限循环。

接下来要回答的问题是：这种间接循环是怎么被引入 substitution 的？

### 第二步：追踪 substitution 的构建

substitution 只在 `unify.ts` 中被扩展。我读了 unify 的代码：

```typescript
lhs = M.substWalk(subst, lhs)
rhs = M.substWalk(subst, rhs)

if (M.isVarType(lhs)) {
    if (varOccurredInType(lhs, rhs)) {
      return undefined  // occurs check 失败 → 统一失败
    } else {
      return M.substExtend(subst, lhs, rhs)
    }
  }
```

这里有两个关键观察：

**第一，`substWalk` 只 walk 顶层。** 它的实现是：

```typescript
export function substWalk(subst: M.Subst, type: M.Type): M.Type {
  if (type.kind === "VarType") {
    const found = M.substLookup(subst, M.varTypeId(type))
    if (found) {
      return substWalk(subst, found)
    }
  }
  return type
}
```

如果顶层不是 VarType，直接返回。**不会进入子项。**

所以当统一 `y` 与 `ArrowType([x], x)` 时，`substWalk(subst, ArrowType([x], x))` 直接返回原样——即使 `x` 在 subst 中指向 `y`。

**第二，`varOccurredInType` 不解析 substitution。** 它的 VarType 分支只比较 ID：

```typescript
case "VarType": {
  const id = M.varTypeId(type)
  if (boundIds.has(id)) { return false }
  return M.varTypeId(type) === M.varTypeId(varType)
}
```

不会在检查前 walk。

### 第三步：纸笔 trace，验证假设

构造最简单的触发场景：

```
当前 subst = { x → y }
尝试统一 y 与 ArrowType([x], x)
```

逐行走 `unify`：

```
1. lhs = substWalk(subst, y) = y          // y 不在 subst 中
2. rhs = substWalk(subst, ArrowType([x], x)) 
   = ArrowType([x], x)                    // 顶层是 ArrowType，直接返回
3. lhs 是 VarType(y)，rhs 不是 VarType
4. varOccurredInType(y, ArrowType([x], x))
   → 进入 ArrowType 分支，遍历 argTypes
   → 遇到 VarType(x)
   → varTypeId(x) === varTypeId(y) ? false  // 不同变量，ID 不同
   → 返回 false（无循环）
5. substExtend(subst, y, ArrowType([x], x))  // 添加 y → ArrowType([x], x)
```

成功了！`y → ArrowType([x], x)` 被添加。但 `x` 指向 `y`，所以这等价于 `y → f(y)`——一个间接循环。

### 第四步：和标准算法比较

我知道 miniKanren 的 occurs-check 是直接 walk 的：

```scheme
(define (occurs-check x v s)
  (let ((v (walk v s)))      ;; ← 每次递归先 walk
    (cond ((var? v) (eq? v x))
          ((pair? v) (or (occurs-check x (car v) s)
                         (occurs-check x (cdr v) s)))
          (else #f))))
```

每个子类型在检查前先被 walk 解析。这样 `x → y` 的间接引用会被展开，occurs check 才能看到真实的类型结构。

### 第五步：验证修复

第一次尝试是在 `unify.ts` 中用 `substDeepWalk` 预解析类型：

```typescript
const resolvedRhs = M.substDeepWalk(subst, rhs)
if (varOccurredInType(lhs, resolvedRhs)) { ... }
```

这修好了问题，但用户指出更优雅的方式是直接改造 `varOccurredInType` 本身，给它加一个 `subst` 参数，仿 miniKanren 在每个递归点先 walk：

```typescript
function occurCheckWithBoundIds(
  boundIds, subst, varType, type
): boolean {
  type = M.substWalk(subst, type)   // ← 关键：每次递归先 walk
  switch (type.kind) {
    // ...处理各分支，递归时同样走 walk
  }
}
```

修好后验证：`meta-example.meta` 全通过，`meta-lisp.meta check` 通过。

## Bug 2：未限定的 builtin 引用

### 第一步：区分"我引入的"和"预先存在的"

修好 Bug 1 后运行 `build.sh`，报错：

```
[lookupLocalIndex] undefined name: equal?
```

我的第一个想法是：**这是我改的代码导致的吗？**

验证方法：临时把 `unify.ts` revert 到修改前，重新 build 并运行 `build.sh`。同样的错误出现。**这是预先存在的 bug**，被 Bug 1 掩盖了（Bug 1 导致类型检查就失败了，到不了 codegen）。

### 第二步：读懂调用栈

```
lookupLocalIndex (150-CodegenPass.ts:89)
  → onGeneralApply (150-CodegenPass.ts:303)
  → onApply (150-CodegenPass.ts:279)
  → onExp (150-CodegenPass.ts:224)
  → onInstr (150-CodegenPass.ts:189)
```

从顶层往下读：

1. `lookupLocalIndex` 在本地变量表中查找名字，找不到就抛错。
2. 它在 `onGeneralApply` 中被调用——在 `definition === undefined` 的分支里。
3. `definition = modLookupDefinition(state.mod, "equal?")` 返回了 `undefined`。

为什么找不到？因为 B.Mod 中的定义是用**限定名**存储的。

### 第三步：理解模块限定规则

`ExplicateControlPass` 处理每个定义时，用限定名注册：

```typescript
function definitionQualifiedName(definition: M.Definition): string {
  return `${definition.mod.name}/${definition.name}`
}
```

所以 `equal?`（在 `builtin` 模块中声明）在 B.Mod 中是 `"builtin/equal?"`。

当 codegen 遇到一个 `QualifiedVar("builtin", "equal?")` 时，会被转换为 `B.Var("builtin/equal?")`，查表能找到。但如果遇到的是裸的 `Var("equal?")`，那就找不到了。

### 第四步：找到硬编码

问题变成：**谁生成了未限定的 `equal?` 引用？**

用 grep 搜索 `equal?` 在编译器代码中的硬编码引用：

```
grep "equal?" projects/meta-lisp.js/src/meta/passes/
```

在 `140-ExplicateControlPass.ts:282` 找到：

```typescript
case "Var": {
  return [
    B.Test(
      B.Apply(B.Var("equal?"), [B.Var(condition.name), B.Keyword("t")]),
    ),
```

这里处理 `(if var-name ...)` 模式，将其展开为 `(equal? var-name #t)`。但硬编码了 `B.Var("equal?")` 而不是 `B.Var("builtin/equal?")`。

修复：

```typescript
B.Apply(B.Var("builtin/equal?"), [B.Var(condition.name), B.Keyword("t")]),
```

修好后 `build.sh` 通过。

### 第五步：追问"为什么之前没暴露"

因为 Bug 1 的间接循环导致类型检查阶段就崩溃了，到不了 codegen。Bug 1 修好后类型检查通过，codegen 才开始被调用——于是这个 bug 暴露了。

**一个 bug 掩盖另一个 bug。** 这是调试中常见的陷阱。

## 方法论总结

### 1. 先读代码，不要猜

接到 bug 报告时，第一件事永远是**读相关代码**。问自己："这段代码在做什么？数据从哪里来、到哪里去？控制流有哪些路径？"

我的经验：找到一个 bug 前，我通常要读 3-5 个相关文件，理解它们之间的数据流。

### 2. 调用栈是金矿

崩溃报错中的调用栈是最可靠的信息。从最顶层的帧开始读，逐层往下，理解每一层在哪个函数、传了什么参数、为什么到不了下一层。

### 3. 纸笔 trace 一个具体场景

面对复杂的算法 bug，构造一个最小触发场景，用纸笔逐行 trace。这次我用的是 `subst = {x → y}`，`unify(y, ArrowType([x], x))`。不到 10 行就发现了问题。

### 4. 和标准算法对比

当你怀疑一个算法实现有 bug 时，去查这个算法的标准描述。如果你知道"正确做法应该是什么样的"，就更容易识别出差在哪里。miniKanren 的 occurs-check 是我判断"这里应该先 walk"的参考。

### 5. 临时 revert 做隔离

当你修改了一些代码后出现新 bug，临时 revert 你的修改，看 bug 是否仍然存在。这能迅速区分"我引入的"和"预先存在的"。

### 6. 一个 bug 掩盖另一个 bug

Bug 之间有遮蔽效应。Bug A 导致程序在到达 Bug B 之前就崩溃了。修好 Bug A 后要通盘回归测试，而不是只验证 Bug A 已修复。

### 7. grep 找硬编码

当你遇到"为什么找不到这个名字"这类问题时，grep 这个字符串的硬编码引用往往直接给出答案。这次 `grep "equal?"` 在一秒钟内定位到了代码生成器。

### 8. 问对问题

整个调试过程中，我在关键节点问自己：

- *这个函数在做什么？* → 读代码
- *子项也被 substitution 覆盖了吗？* → 测试深层 vs 浅层 walk
- *occurs check 检查的是什么？原始类型还是解析后的类型？* → 发现不 walk
- *标准 occurs check 应该怎么做？* → 回忆 miniKanren
- *这个 bug 是我引入的吗？* → revert 测试
- *为什么名字找不到？它应该是什么名字？* → 理解限定规则
