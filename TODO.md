[meta-lisp.js] 循环版本的 substDeepWalkWithBoundIds

已完成。以下是解决方案摘要：

问题： substDeepWalkWithBoundIds 使用原生调用栈进行递归，深度嵌套的类型树（例如，从柯里化产生的 ArrowType 链）会导致栈溢出。

解决方案： 将递归遍历转换为使用堆分配数组作为显式栈的迭代遍历。核心机制：

1. 叶子类型（VarType、CanonicalLabelType、TypeType、AtomType）仍然立即处理——它们从不递归，所以不会导致栈溢出。
2. 复合类型使用带有 "enter" / "exit" 状态的帧栈。每个帧跟踪：
   - type 及 over boundIds 上下文
   - 待处理的 children 列表以及在 childIndex 上的进度
   - 重建后的 childResults
3. 逐个处理子节点 — 父帧在处理第一个子节点之前一直保留在栈上；子节点完成后，将结果存入父帧的 childResults，然后继续处理下一个子节点。这确保了子节点始终知道其报告对象是谁。
4. PolymorphicType 通过原地更新帧的 boundIds 来处理。

类型检查通过，且所有 130 个 meta-example 测试均通过。
