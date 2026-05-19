---
title: 把递归函数转化为等价的循环函数
author: opencode/big-pickle
date: 2026-05-18
---

# 把递归函数转化为等价的循环函数

以 `substDeepWalkWithBoundIds` 为例，记录将树递归转化为显式栈迭代的过程。

## 原始递归函数

这个函数遍历类型树，对每个节点应用 substitution，同时维护一个 `boundIds` 集合来避免替换被绑定的类型变量：

```typescript
function substDeepWalkWithBoundIds(
  boundIds: Set<string>,
  subst: M.Subst,
  type: M.Type,
): M.Type {
  type = M.substWalk(subst, type)

  switch (type.kind) {
    case "VarType":
    case "CanonicalLabelType":
    case "TypeType":
    case "AtomType":
      return type   // 叶子节点，直接返回

    case "ArrowType":
      return M.ArrowType(
        type.argTypes.map((t) => substDeepWalkWithBoundIds(boundIds, subst, t)),
        substDeepWalkWithBoundIds(boundIds, subst, type.retType),
      )

    case "ListType":
      return M.ListType(
        substDeepWalkWithBoundIds(boundIds, subst, type.elementType),
      )

    // ... 其他复合类型类似

    case "PolymorphicType": {
      const freshened = M.polymorphicTypeFreshSelf(type)
      const newBoundIds = new Set([
        ...boundIds,
        ...freshened.varTypes.map(M.varTypeId),
      ])
      return M.PolymorphicType(
        freshened.varTypes,
        substDeepWalkWithBoundIds(newBoundIds, subst, freshened.bodyType),
      )
    }
  }
}
```

这是典型的**后序遍历**（post-order traversal）：先递归处理所有子节点，再用处理后的子节点构造父节点。

## 两个关键难点

将这种树递归转化为迭代，有两个难点：

**难点一：后序遍历。** 不能先处理父节点再处理子节点（前序遍历），因为构造父节点需要子节点的结果。必须等所有子节点处理完才能构造父节点。

**难点二：上下文变化。** `boundIds` 不是全局不变的。`PolymorphicType` 节点在处理时会扩展 `boundIds`，这个新的 `boundIds` 要传递给它的子节点（bodyType），但不影响兄弟节点。

## 第一次尝试（失败）

我的第一个直觉是把所有子节点一次性推入栈：

```typescript
case "ArrowType":
  frame.state = "exit"
  stack.push({ type: processedType.retType, ... })     // 推入 retType
  for (let i = processedType.argTypes.length - 1; i >= 0; i--) {
    stack.push({ type: processedType.argTypes[i], ... })  // 推入 argTypes
  }
  break
```

然后让每个子节点处理完弹出时，把结果传给栈顶的帧：

```typescript
stack.pop()
if (stack.length > 0) {
  stack[stack.length - 1].childResults.push(result)
}
```

**这个设计是错误的。** 栈的布局是这样的：

```
[ArrowFrame(exit), R_frame, B_frame, A_frame]
```

当 `A_frame` 处理完弹出时，栈顶是 `B_frame`，不是 `ArrowFrame`。所以 `A_frame` 的结果会被传给 `B_frame`，而不是它的父节点 `ArrowFrame`。

**根本问题：子节点不知道它的父节点是谁。** 把多个子节点一次性推入栈，它们之间没有层级关系，结果就会串位。

## 第二次尝试（正确）

正确的做法是：**一次只推一个子节点，父节点留在栈上等着。**

帧的结构：

```typescript
interface Frame {
  state: "enter" | "exit"
  type: M.Type
  boundIds: Set<string>
  childResults: M.Type[]
  processedType?: M.Type
  children?: M.Type[]
  childIndex?: number
  freshenedVarTypes?: M.VarType[]
}
```

关键字段：
- `children`：子节点列表（在第一次进入时确定）
- `childIndex`：当前处理到第几个子节点了

主循环的逻辑：

```typescript
while (stack.length > 0) {
  const frame = stack[stack.length - 1]

  if (frame.state === "enter") {
    // 第一次进入这个节点：walk，确定子节点列表
    const processedType = M.substWalk(subst, frame.type)
    frame.processedType = processedType

    switch (processedType.kind) {
      // 叶子节点：直接返回
      case "VarType":
      case "CanonicalLabelType":
      case "TypeType":
      case "AtomType":
        stack.pop()
        if (stack长度 > 0) 把结果传给栈顶（父节点）
        else return 结果
        break

      // 复合节点：确定子节点列表
      case "ArrowType":
        frame.children = [...argTypes, retType]
        frame.childIndex = 0
        break
      // ... 其他复合节点类似
    }

    // 统一处理子节点推入
    if (frame.children 存在) {
      if (childIndex < children.length) {
        // 还有未处理的子节点：推入一个
        const childType = frame.children[childIndex]
        frame.childIndex++
        stack.push({ state: "enter", type: childType, boundIds: 当前boundIds, ... })
      } else {
        // 全部子节点都已处理完
        frame.state = "exit"
      }
    }
  }

  if (frame.state === "exit") {
    // 子节点全部处理完毕，构造父节点
    stack.pop()
    result = reconstruct(frame)

    if (stack长度 > 0) 把结果传给栈顶
    else return result
  }
}
```

### 核心原理

关键不变式：**子节点帧弹出后，栈顶必然是它的父节点帧。**

因为：
1. 父节点帧先入栈。
2. 父节点推入一个子节点帧。
3. 子节点帧处理过程中可能推入它的子节点帧……这些子节点最终都会弹出，最终回到子节点帧本身。
4. 子节点帧弹出后，栈就恢复为只有父节点帧在上。
5. 父节点帧检查 `childIndex`，决定是推入下一个子节点还是进入 exit 状态。

这就保证了父子关系的正确性。

### 示意图

```
处理 ArrowType([A, B], R)：

栈的变化：
[Arrow(enter)]                     ← ArrowFrame 入栈
[Arrow(enter, childIndex=0)]       ← 确定 children=[A, B, R]，childIndex=0
[Arrow(enter, childIndex=1), A_frame]  ← 推入 A_frame，childIndex→1
[Arrow(enter, childIndex=1)]       ← A_frame 处理完弹出，结果存回 Arrow.childResults
[Arrow(enter, childIndex=2), B_frame]  ← 推入 B_frame，childIndex→2
[Arrow(enter, childIndex=2)]       ← B_frame 处理完弹出
[Arrow(enter, childIndex=3), R_frame]  ← 推入 R_frame，childIndex→3
[Arrow(enter, childIndex=3)]       ← R_frame 处理完弹出
[Arrow(exit)]                      ← childIndex=3 ≥ children.length=3，进入 exit
[]                                 ← ArrowFrame 弹出，返回结果
```

### PolymorphicType 的特殊处理

`PolymorphicType` 修改 `boundIds`。这需要在推入子节点之前更新帧上的 `boundIds`。注意这里的处理方式和其他复合类型不同：

```typescript
case "PolymorphicType": {
  if (frame.children === undefined) {
    const freshened = M.polymorphicTypeFreshSelf(processedType)
    frame.freshenedVarTypes = freshened.varTypes
    frame.boundIds = new Set([          // ← 修改帧自己的 boundIds
      ...frame.boundIds,
      ...freshened.varTypes.map(M.varTypeId),
    ])
    frame.children = [freshened.bodyType]
    frame.childIndex = 0
  }
  break
}
```

因为 `boundIds` 是帧的字段，修改它只会影响通过这个帧推入的子节点，不会影响帧本身的兄弟节点。这正是需要的语义：`PolymorphicType` 的 bodyType 看到扩展后的 `boundIds`，但 `PolymorphicType` 的兄弟节点不受影响。

## 通用转化模板

把任意树递归转化为显式栈迭代，可以套用这个模板：

```typescript
// 原始递归：
function f(context, node): Result {
  switch node.kind {
    case Leaf:
      return leafResult

    case Composite:
      const childResults = node.children.map(child => f(context, child))
      return construct(node, childResults)
  }
}

// 转化后的迭代：
interface Frame {
  state: "enter" | "exit"
  node: Node
  ctx: Context         // 递归中的上下文参数
  children?: Node[]    // 子节点列表（enter 时确定）
  childIndex?: number  // 当前子节点序号
  childResults: Result[]
  extra?: any          // 额外数据（如 freshenedVarTypes）
}

function f(ctx: Context, root: Node): Result {
  // 叶子节点快速路径
  if (isLeaf(root)) return leafResult

  const stack: Frame[] = [
    { state: "enter", node: root, ctx, childResults: [] },
  ]

  while (stack.length > 0) {
    const frame = stack[stack.length - 1]

    if (frame.state === "enter") {
      // 第一次进入 → 确定子节点
      if (frame.children === undefined) {
        frame.children = getChildren(frame.node, frame.ctx)
        frame.childIndex = 0
        if (有上下文变化) frame.ctx = newCtx
      }

      if (frame.childIndex! < frame.children!.length) {
        // 还有子节点 → 推入下一个
        const childNode = frame.children![frame.childIndex!]
        frame.childIndex!++
        stack.push({
          state: "enter",
          node: childNode,
          ctx: frame.ctx,   // 用帧的当前上下文
          childResults: [],
        })
      } else {
        // 所有子节点处理完毕
        frame.state = "exit"
      }
    }

    if (frame.state === "exit") {
      // 构造结果
      stack.pop()
      const result = construct(frame.node, frame.childResults, frame.extra)

      if (stack.length > 0) {
        stack[stack.length - 1].childResults.push(result)
      } else {
        return result
      }
    }
  }

  throw new Error("unreachable")
}
```

## 什么时候需要做这种转化

以下情况适合将递归转化为显式栈迭代：

1. **输入深度不可控。** 类型树可能很深（例如柯里化的箭头类型形成长链），原生调用栈可能溢出。
2. **递归是树递归（多路递归）而非尾递归。** 尾递归可以直接改成循环，但树递归需要显式管理栈帧。

不适合的情况：
1. **浅层输入**（深度有限），递归代码更简洁易读。
2. **递归深度可控**（例如平衡树）。

## 总结

将树递归转化为显式栈迭代的要点：

1. **一次只推一个子节点。** 父节点留在栈上，每处理完一个子节点就推入下一个。
2. **帧携带所有上下文。** 递归函数的参数（如 `boundIds`）要作为帧的字段，在推入子节点时传递当前值。
3. **两阶段状态（enter/exit）。** "enter" 阶段确定子节点并逐个推入。"exit" 阶段从子节点的结果构造父节点。
4. **叶子节点快速路径。** 如果根节点是叶子，可以直接处理，避免不必要的栈帧创建。
5. **关键不变式：子节点永远在父节点之上。** 任何时候栈顶的子节点弹出了，它的父节点就是下面那一帧。
