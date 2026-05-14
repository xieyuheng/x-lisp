---
title: give up subtype
date: 2026-05-12
---

放弃 subtype。
因为 structual subtyping
需要用 hash 来实现 record type，
否则需要有复杂的优化。

而不支持 subtype 的 record type 跟接近底层的 struct。
