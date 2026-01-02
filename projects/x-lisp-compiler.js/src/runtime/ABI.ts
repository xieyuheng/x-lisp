export type ABI = {
  "argument-reg-names": Array<string>
  "caller-saved-reg-names": Array<string>
  "callee-saved-reg-names": Array<string>
}

export const ABIs = {
  "x86-64-sysv": {
    "argument-reg-names": ["rdi", "rsi", "rdx", "rcx", "r8", "r9"],
    "caller-saved-reg-names": [
      "rax",
      "rcx",
      "rdx",
      "rsi",
      "rdi",
      "r8",
      "r9",
      "r10",
      "r11",
    ],
    "callee-saved-reg-names": ["rsp", "rbp", "rbx", "r12", "r13", "r14", "r15"],
  },
}
