// - prims that may allocate gc-heap objects (chinese namespace).
// - short names, matched against the last segment of a qualified prim name.
// - audited against [xrt.c] builtin implementations (2026-09).

export const allocatingPrimitivesZh: Set<string> = new Set([
  // value
  "呈现",

  // file
  "打开输入文件",
  "打开输出文件",
  "文件读",

  // symbol
  "符号转文本",

  // text
  "文本截取",
  "文本追加",
  "文本拼接",
  "文本字符",
  "文本行",
  "文本分割",
  "文本连接",
  "文本替换",
  "文本转大写",
  "文本转小写",
  "文本修剪左端",
  "文本修剪右端",
  "文本修剪首端",
  "文本修剪尾端",
  "文本修剪",

  // list
  "添",

  // array
  "作数组",
  "数组复制",
  "数组转列表",
  "列表转数组",

  // pair
  "作序对",

  // hash
  "作散列",
  "散列复制",
  "散列复制存",
  "散列键",
  "散列值",
  "散列条目",

  // set
  "作集合",
  "集合复制",
  "集合复制添加",
  "集合复制删除",
  "集合并",
  "集合交",
  "集合差",
  "集合转列表",

  // sexp
  "解析符号算式",
  "呈现为符号算式",
  "呈现定位消息",

  // json
  "解析结森",
  "呈现结森",

  // path
  "路径文件名",
  "路径目录名",
  "路径扩展名",
  "路径主干",
  "路径连接",
  "路径规范化",
  "路径相对",
  "路径相对于当前目录",
  "路径解析",
  "路径读",
  "路径列表",
  "路径递归列表",

  // process
  "当前目录",
  "当前命令行",
  "当前完整命令行",

  // type (constructing functions)
  "列表型",
  "数组型",
  "集合型",
  "散列型",
  "序对型",
])
