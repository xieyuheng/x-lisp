---
title: executable format
author: xieyuheng
date:  2026-06-13
---

# flat machine code

汇编代码可以被编译到位置无关的 machine code，
称作 flat machine code。
所谓 flat 就在于不用任何可执行文件格式。

汇编代码中有函数的代码和数据，
其中函数之间引用可以用相对位置来编码，
函数到数据的引用也可以用相对位置来编码。

可以用 mmap 系统调用，
把代码加载到可执行的内存，
然后把内存当作函数指针来调用。

问题在于操作系统利用 CPU 所提供的机制，
强制要求可执行内存是不可写的。
因此 flat machine code 中的数据都是只读的，
如果写了，就会 sagement fault。

只有将代码和数据分别用两个 mmap 来加载，
才能正确地给两段内存设置不同的权限。

因此需要可执行文件格式。

# executable format

假设我要为我们的编译器设计可执行文件格式，
并且以 mmap 为基础，为我们的格式设计 loader。

首先要分 code section 和 data section。
假设 code section 想要引用 data section 的数据，
就需要在 relocation table 中记录一条：

```
<code-section-id> <code-section-offset> => <data-section-id> <data-section-offset>
```

mmap 加载之后，得到对应：

```
<code-section-id> => <code-section-address>
<data-section-id> => <data-section-address>
```

这时就可以利用 relocation table 的记录，
获得真实的地址之间的引用关系：

```
<code-section-address> + <code-section-offset> =>
<data-section-address> + <data-section-offset>
```

当然，具体如何处理地址之间的引用关系，
要看汇编代码所使用的具体寻址方式。

section 之间的相互引用都是如此处理。

除了这种 section 地址之间 relocation table 之外，
还有 section 到 runtime primtive c 函数的引用，
需要一种新的 relocation table 记录：

```
<section-id> <section-offset> => <function-name>
```

runtime 启动之后，得到地址之间的引用关系：

```
<section-address> + <section-offset> => <function-address>
```

c 中的 primtive function 是如此，
primtive variable 也是如此。
