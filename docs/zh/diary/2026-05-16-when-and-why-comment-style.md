---
title: when and why comment style
author: xieyuheng
date: 2026-05-16
---

# when 和 why 注释风格

## 问题

代码中有两类注释需要区分：

- **可达性**：这条控制流路径在什么场景下会被走到？
- **设计意图**：这一行代码为什么要这么写？

## 约定

使用 `when:` 前缀标记**可达性注释**，`why:` 前缀标记**设计意图注释**：

`when:` / `why:` 前面的 `// -` 延续了项目中已有的多级注释风格。

## 代码示例

### when: infer.ts 的 inferLookup

三步逻辑分别用 `when:` 注释解释每一步在什么场景下会被走到：

```typescript
function inferLookup(
  mod: M.Mod, ctx: M.Ctx, name: string, exp: M.Exp,
): M.InferEffect {
  return (subst) => {
    // ... omitted: transparentOpaqueNames, claimedType, undefined check

    {
      // - when: inferLookup is called for B while checking A,
      //   and tryInferDefinitionBody has pre-allocated a fresh type
      //   variable for B, meaning B is in a mutual-recursive group with A.
      //   Return this fresh variable immediately to avoid infinite recursion.
      const inferredType = M.modLookupInferredType(mod, name)
      if (inferredType) return M.okInferEffect(inferredType)(subst)
    }

    // - when: B is defined later in the module, so it has no pre-allocated
    //   type variable and no inferred type yet.
    //   Check B on demand to obtain its type.
    //   This branch must come AFTER the mutual-recursion check above,
    //   otherwise checking a mutual-recursive group would loop infinitely.
    M.definitionCheck(definition)

    {
      // - when: after definitionCheck, tryInferDefinitionBody has stored
      //   B's inferred type in mod.inferredTypes. Retrieve it.
      const inferredType = M.modLookupInferredType(mod, name)
      if (inferredType) return M.okInferEffect(inferredType)(subst)
    }

    // error: checked but still no inferred type
  }
}
```

### why: definitionCheck.ts 的 tryInferDefinitionBody

两行关键代码分别用 `why:` 注释解释设计意图：

```typescript
function tryInferDefinitionBody(mod: M.Mod, name: string, exp: M.Exp): void {
  const freshVarType = M.createFreshVarType(name)
  // - why: for recursive function — put `name -> freshVarType`
  //   into ctx so that the function body can refer to itself recursively.
  const ctx = M.ctxPut(M.emptyCtx(), name, freshVarType)
  // - why: for mutual recursive function — reserve a placeholder
  //   in mod.inferredTypes for peers to find during type inference.
  //   It will be overwritten with the actual inferred type on success.
  M.modPutInferredType(mod, name, freshVarType)
  const effect = M.infer(mod, ctx, exp)
  const result = effect(M.emptySubst())
  if (result.kind === "InferError") {
    writeln(reportTypeCheckError(result.exp, result.message))
  } else {
    let inferredType = M.substDeepWalk(result.subst, result.type)
    inferredType = M.generalizeInCtx(M.emptyCtx(), inferredType)
    M.modPutInferredType(mod, name, inferredType)
  }
}
```
