---
title: side-effect break consistency
date: 2026-03-23
---

https://chat.deepseek.com/a/chat/s/a2c866d5-cefb-437e-ac42-116d10d6daa5

# subtype + side-effect

首先，带有 subtype 和副作用的语言，
类型系统不具有一致性：

我们定义一个可变引用类型 `Ref[T]`，并允许子类型：
如果 `Cat <: Animal`，那么 `Ref[Cat] <: Ref[Animal]`（即协变）。

```scala
// 创建一个 Ref[Cat]，其中存着一只猫：
catRef: Ref[Cat] = new Ref(Cat())
// 通过子类型关系，将 catRef 赋值给一个 Ref[Animal] 类型的变量：
animalRef: Ref[Animal] = catRef   // 允许，因为 Ref[Cat] <: Ref[Animal]
// 通过 animalRef 存入一只狗（Dog 是 Animal 的子类型，因此允许写入）：
animalRef.set(Dog())   // 合法，因为 animalRef 的类型允许存入任何 Animal
// 从原始的 catRef 中取出值：
c: Cat = catRef.get()  // 本应得到 Cat，实际得到了 Dog，类型错误
```

# parametric polymorphism + side-effect

即使没有子类型，
仅凭参数多态（parametric polymorphism）与副作用（如可变引用）的结合，
也可能导致类型系统失去一致性。
关键在于：如果允许可变引用拥有完全多态的类型，
就可以通过不同的实例化来混淆类型。

在 Standard ML 或 OCaml 中，如果不加限制，下面的代码会破坏类型安全：

```sml
val r : 'a option ref = ref NONE (* 假设可以这样写 *)
val r1 : string option ref = r
val r2 : int option ref = r
val () = r1 := SOME "hello"
val v : int = valOf (!r2)  (* 运行时拿到的是字符串！ *)
```

参数多态的本意是“同一个表达式在不同类型下可以安全使用”，
但可变引用破坏了这种安全性。

# 结论

因此对于这个问题，我只能说谨慎使用副作用。
为这个问题而设计复杂的类型系统是得不偿失的。
