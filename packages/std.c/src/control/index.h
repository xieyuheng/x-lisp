#pragma once

#include <stddef.h>

#ifndef unreachable
#if defined(_MSC_VER)
#define unreachable() __assume(0)
#else
#define unreachable() __builtin_unreachable()
#endif
#endif
