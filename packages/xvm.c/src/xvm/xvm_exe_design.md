# .xvm.exe 可执行文件格式

`.xvm.exe` 是 meta-runtime xvm 后端的预编译可执行文件格式。
将 `.xvm.asm` 源码的解析和汇编结果序列化为二进制，
加载时无需重新解析 sexp 和汇编，只需反序列化 + 重定位即可执行。

所有整数均为小端（little-endian）。

## File Header (28 bytes)

| offset | size | field                       | description           |
|--------|------|-----------------------------|-----------------------|
| 0      | 4    | magic                       | `0x58455845` ("XEXE", for xvm exe) |
| 4      | 4    | version                     | `1`                   |
| 8      | 4    | definition_count            |                       |
| 12     | 4    | string_table_size           |                       |
| 16     | 4    | value_count                 |                       |
| 20     | 4    | definition_relocation_count |                       |
| 24     | 4    | value_relocation_count      |                       |

## Definition Table (definition_count 条)

每条连续存储：

| size        | field       | description               |
|-------------|-------------|---------------------------|
| 1           | kind        | 0=function, 1=variable    |
| 4           | name_offset | 指向 string table         |
| 2           | arity       | 参数数量（variable 为 0） |
| 1           | flags       | bit0: is_test             |
| 2           | local_count | 局部变量数                |
| 4           | code_length | 字节码长度                |
| code_length | code        | 原始字节码                |

## Value Table (value_count 条)

| size | field       | description                   |
|------|-------------|-------------------------------|
| 1    | kind        | 2=string, 3=symbol   |
| 4    | data_offset | 指向 string table             |

## Definition Relocation Table (definition_relocation_count 条)

| size | field               | description          |
|------|---------------------|----------------------|
| 4    | definition_index    | 所属 definition 索引 |
| 4    | code_offset         | code 内字节偏移      |
| 4    | string_table_offset | 指向 string table    |

## Value Relocation Table (value_relocation_count 条)

| size | field            | description          |
|------|------------------|----------------------|
| 4    | definition_index | 所属 definition 索引 |
| 4    | code_offset      | code 内字节偏移      |
| 4    | value_index      | value table 中的索引 |

## String Table

```
string_table: char[string_table_size]
```

NUL 字符分隔的文本池，各条目通过 offset 引用。

## 设计约束

- OP_LOAD 的值仅支持 immediate（int/float/bool/void）和 string/symbol 对象。
  不支持 list/hash/set 等复合对象。
- Variable definition 的 value 不序列化，通过 setup 阶段执行 body 来初始化。
- Primitive definition 不序列化（C 函数指针不可移植），加载时通过 `import_builtin` 注册后按名字查找。
