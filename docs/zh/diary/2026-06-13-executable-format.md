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

首先要分 code segment 和 data segment。
假设 code segment 想要引用 data segment 的数据，
就需要在 relocation table 中记录一条：

```
<code-segment-id> <code-segment-offset> => <data-segment-id> <data-segment-offset>
```

mmap 加载之后，得到对应：

```
<code-segment-id> => <code-segment-address>
<data-segment-id> => <data-segment-address>
```

这时就可以利用 relocation table 的记录，
获得真实的地址之间的引用关系：

```
<code-segment-address> + <code-segment-offset> =>
<data-segment-address> + <data-segment-offset>
```

具体实现的时候可以更简单，
因为可以先假设所有 segment 的起始 address 都是 0，
引用另一个 segment 地址的时候，就直接引用 offset。
然后记录 relocation table 的时候，就可以不用记录 offset 了，
loader 只需要根据 segment 的真实起始地址，修正引用位置的地址。

当然，具体如何处理地址之间的引用关系，
要看汇编代码所使用的具体寻址方式。

segment 之间的相互引用都是如此处理。

除了这种 segment 地址之间 relocation table 之外，
还有 segment 到 runtime primtive c 函数的引用，
需要一种新的 relocation table 记录：

```
<segment-id> <segment-offset> => <function-name>
```

runtime 启动之后，得到地址之间的引用关系：

```
<segment-address> + <segment-offset> => <function-address>
```

c 中的 primtive function 是如此，
primtive variable 也是如此。

# segment vs section

segment 可以理解为是二进制的，
需要被 loader（最终被 mmap）解释的 statement。

如果想让两个分别编译的汇编代码，
被合并到一起执行，就需要 section 的概念。
