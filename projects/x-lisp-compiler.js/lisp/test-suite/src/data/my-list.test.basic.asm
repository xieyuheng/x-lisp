@define-function main
body:
  global-load nil
  local-store _₁
  local-load _₁
  literal #nil
  call assert-equal
  drop
  global-load nil
  local-store _₂
  literal 3
  local-load _₂
  call li
  local-store _₃
  literal 2
  local-load _₃
  call li
  local-store _₄
  literal 1
  local-load _₄
  call li
  local-store _₅
  call make-list
  local-store tael₁
  literal #li
  local-load tael₁
  call list-push!
  drop
  literal 1
  local-load tael₁
  call list-push!
  drop
  call make-list
  local-store tael₂
  literal #li
  local-load tael₂
  call list-push!
  drop
  literal 2
  local-load tael₂
  call list-push!
  drop
  call make-list
  local-store tael₃
  literal #li
  local-load tael₃
  call list-push!
  drop
  literal 3
  local-load tael₃
  call list-push!
  drop
  literal #nil
  local-load tael₃
  call list-push!
  drop
  local-load tael₃
  local-load tael₂
  call list-push!
  drop
  local-load tael₂
  local-load tael₁
  call list-push!
  drop
  local-load _₅
  local-load tael₁
  call assert-equal
  drop
  global-load nil
  local-store _₆
  literal 1
  local-load _₆
  call li
  local-store _₇
  local-load _₇
  call li-tail
  local-store _₈
  global-load nil
  local-store _₉
  local-load _₈
  local-load _₉
  call assert-equal
  drop
  global-load nil
  local-store _₁₀
  literal 1
  local-load _₁₀
  call li
  local-store _₁₁
  local-load _₁₁
  call li-head
  local-store _₁₂
  local-load _₁₂
  literal 1
  call assert-equal
  drop
  global-load nil
  local-store _₁₃
  literal 3
  local-load _₁₃
  call li
  local-store _₁₄
  literal 2
  local-load _₁₄
  call li
  local-store _₁₅
  literal 1
  local-load _₁₅
  call li
  local-store list₁
  local-load list₁
  call li-head
  local-store _₁₆
  local-load _₁₆
  literal 1
  call assert-equal
  drop
  literal 111
  local-load list₁
  call li-put-head!
  drop
  local-load list₁
  call li-head
  local-store _₁₇
  local-load _₁₇
  literal 111
  call assert-equal
  drop
  local-load list₁
  call li-tail
  local-store _₁₈
  global-load nil
  local-store _₁₉
  literal 3
  local-load _₁₉
  call li
  local-store _₂₀
  literal 2
  local-load _₂₀
  call li
  local-store _₂₁
  local-load _₁₈
  local-load _₂₁
  call assert-equal
  drop
  global-load nil
  local-store _₂₂
  local-load _₂₂
  local-load list₁
  call li-put-tail!
  drop
  local-load list₁
  call li-tail
  local-store _₂₃
  global-load nil
  local-store _₂₄
  local-load _₂₃
  local-load _₂₄
  call assert-equal
  drop
  global-load nil
  local-store _₂₅
  literal 1
  local-load _₂₅
  call li
  local-store _₂₆
  literal 1
  ref li
  literal 1
  apply
  local-store _₂₇
  global-load nil
  local-store _₂₈
  local-load _₂₈
  local-load _₂₇
  literal 1
  apply
  local-store _₂₉
  local-load _₂₆
  local-load _₂₉
  tail-call assert-equal

