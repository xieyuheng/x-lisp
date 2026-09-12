#pragma once

// 运行时输出语言——由调用的是哪个 primitive 决定
// （meta-builtin/builtin/print 与 meta-builtin/内置/打印 等，
// 见 import_builtin_en.c / import_builtin_zh.c）。
typedef enum {
  LANG_EN = 0,
  LANG_ZH = 1,
} lang_t;