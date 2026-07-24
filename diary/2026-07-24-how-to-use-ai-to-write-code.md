---
title: how to use ai to write code?
author: xieyuheng
date: 2026-07-24
---

# 经历

（1）在尝试用 AI 实现 select-instruction-pass 的过程中，
发现 apply 和 tail-apply 是难点。

发现如果在编译时用 eta-expansion 来实现 auto currying，
就可以简化 apply 和 tail-apply。

但是 AI 很难得出这种结论。

（2）但是这需要我们修改 lift-lambda-pass 为 lambda-conversion-pass。
因为 lift-lambda-pass 本身就依赖了 runtime 的 auto currying。

尝试用 AI 增加一个 curry-pass。
但是卡在了计算 apply 的 target 的 arity 上面，
因为类型检查之后 term 是不带类型的。

但是 AI 会尝实现 curry-pass 的部分目标，让测试通过。

停下来讨论保存类型检查过程中所推断出来的类型的方案。
发现需要能够找到所有的 sub-term 对应的类型。
考虑过把类型检查器的构架完全改成 propagator model，
但是最终还是决定使用简单的 elaboration 技巧。

（3）如果 check-pass 带有 elaboration，
那么 check-pass 本身就可以顺便实现 curry-pass 了。

甚至不用区分 term 和 core，
elaboration 可以是从 term 到 term。

如果现在区分 core，就是为未来的更复杂的 elaboration 做准备。
尽管如此，core 也不需要带 type。
因为带 type 反而会影响后续的 limit-arity-pass。

# 问题

AI 在 coding 的时候会尝试实现给定的需求，
而很少会停下来审查需求本身。

这不是本质的问题，随着 AI 能力的提升，
以及 harness 技巧的完善，
这个问题可以得到改善。

停下里审视需求的过程，
类似于解决几何问题时做辅助线，
也类似于解决抽象代数问题时设计所使用的范畴。

AI 不光能帮助我们实现给定的已经正确的需求，
AI 也可以停下来帮助我们讨论需求的正确性。

问题 A：停下来重新审视需求，要求人们理解问题本身，
而人们目前使用 AI 的方式，经常是为了避免理解问题本身。

问题 B：在人类尝试写程序取解决某个问题的时候，
人对问题的理解可能是不完整的，或者错误的，
写程序的过程中，随着细节的展开，而逐渐完善人对问题的理解。
人们使用代码所表达的，是被固定下来的对问题的理解。
这个理解几乎总是不充分的。

# 结论

人类在使用 AI 写程序的过程中，
还是不可避免地要描述明确的需求，
然后让 AI 去实现这个需求。

但是此时有两种可能：

- 人对问题的理解是充分的，需求是正确的。
- 人对问题的理解是不充分的，需求是错误的。

问题在于，人通常不知道自己对问题的理解是不充分的，
如果知道，那么人们显然会首先完善自己的理解，
然后把新的理解用代码表达出来。

因此，对于第二种情况。
人通常只有在发现 AI 写代码的过程中遇到阻碍，
才能发现自己对问题的理解是不充分的。

结论很简单，
就是在用 AI 写程序的过程中，
要意识到，自己对问题的理解可能是不充分的，
自己所描述的需求可能是错误的。
