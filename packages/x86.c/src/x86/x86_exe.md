---
title: 可执行文件
---

# 可执行文件与加载器

可执行文件配合加载器（loader）使用，
加载器会调用 `mmap` 系统函数，
把可执行文件中的 x86 机器码和数据，
组装成可以调用的函数。

汇编语言的本质在于控制。
所谓控制，除了通过指令来控制 CPU 的行为之外，
还在于通过可执行文件来控制 loader 的行为。

其中最典型的对 loader 行为的控制，
就是使用 `(fixup <type> <name>)` operand
创建可执行文件中的修正条目，
来控制 loader 向 segment 中回填数据的方式。

# x86.exe

x86.exe 的组成部分：

| 部分             | 功能                                    |
|------------------|-----------------------------------------|
| header           | 记录其他部分在文件中的位置与长度        |
| code segment     | 应加载为可读可执行的代码区域            |
| data segment     | 应加载为可读可写的数据区域              |
| space segment    | 应加载为可读可写的未初始化数据区域      |
| string table     | 记录文件中出现的所有字符串（null 结尾） |
| label table      | 记录三个 segment 中 label 位置          |
| 修正表 | 控制 loader 向 segment 中回填数据的方式 |

# string table

string table 中字符串必须是唯一的，
这样就可以通过比较地址来比较字符串是否相等。

# label table

label table 由 label entry 的数组组成。
label entry 中每个 label 的 name 都是唯一的。
label entry 需要记录这个 label 存在于哪个 segment，
以及在 segment 之中的位置。
这样 loader 通过 mmap 为 segment 分配了地址之后，
就可以知道每个 label 的真实地址。

# 修正表

修正表由修正条目的数组组成。
修正条目由汇编中的修正操作数创建。

修正操作数的格式为 `(fixup <type> <name>)`：

- `<type> <name>` 代表需要被回填的数据
  - `<type>` 代表不同的回填数据方式
  - `<name>` 代表需要回填的数据名字

修正条目格式为 `[<type> <name> <segment> <offset> <addend>]`：

- `<segment> <offset> <addend>` 代表回填的位置
- 整个 tuple 建立需要被回填的数据与回填位置之间的多对一关系。
