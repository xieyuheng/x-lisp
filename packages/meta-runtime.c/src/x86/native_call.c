#include "index.h"

value_t native_call_native_fn(void *entry, uint8_t argc, value_t *args) {
  uint64_t result;
  uint64_t arg_count = (uint64_t) argc;
  uint64_t entry_addr = (uint64_t) entry;
  uint64_t args_ptr = (uint64_t) args;

  __asm__ volatile (
    "pushq %%rbx\n\t"
    "pushq %%r12\n\t"
    "movq %[entry_addr], %%r12\n\t"
    "movq %[arg_count], %%rbx\n\t"
    "movq %[args_ptr], %%rcx\n\t"
    "movq %%rbx, %%r9\n\t"
    "decq %%r9\n\t"
    "js 2f\n\t"
    "1:\n\t"
    "pushq (%%rcx, %%r9, 8)\n\t"
    "decq %%r9\n\t"
    "jns 1b\n\t"
    "2:\n\t"
    "callq *%%r12\n\t"
    "leaq (%%rsp, %%rbx, 8), %%rsp\n\t"
    "popq %%r12\n\t"
    "popq %%rbx\n\t"
    : "=a" (result)
    : [entry_addr] "D" (entry_addr),
      [arg_count] "S" (arg_count),
      [args_ptr] "d" (args_ptr)
    : "rcx", "r9", "memory"
  );

  return (value_t) result;
}
