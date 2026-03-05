@define-function main
body:
  global-load nil
  literal #nil
  call assert-equal
  drop
  literal 3
  global-load nil
  call li
  local-store _₁
  literal 2
  local-load _₁
  call li
  local-store _₂
  literal 1
  local-load _₂
  call li
  local-store _₃
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
  local-load _₃
  local-load tael₁
  call assert-equal
  drop
  literal 1
  global-load nil
  call li
  local-store _₄
  local-load _₄
  call li-tail
  local-store _₅
  local-load _₅
  global-load nil
  call assert-equal
  drop
  literal 1
  global-load nil
  call li
  local-store _₆
  local-load _₆
  call li-head
  local-store _₇
  local-load _₇
  literal 1
  call assert-equal
  drop
  literal 3
  global-load nil
  call li
  local-store _₈
  literal 2
  local-load _₈
  call li
  local-store _₉
  literal 1
  local-load _₉
  call li
  local-store list₁
  local-load list₁
  call li-head
  local-store _₁₀
  local-load _₁₀
  literal 1
  call assert-equal
  drop
  literal 111
  local-load list₁
  call li-put-head!
  drop
  local-load list₁
  call li-head
  local-store _₁₁
  local-load _₁₁
  literal 111
  call assert-equal
  drop
  local-load list₁
  call li-tail
  local-store _₁₂
  literal 3
  global-load nil
  call li
  local-store _₁₃
  literal 2
  local-load _₁₃
  call li
  local-store _₁₄
  local-load _₁₂
  local-load _₁₄
  call assert-equal
  drop
  global-load nil
  local-load list₁
  call li-put-tail!
  drop
  local-load list₁
  call li-tail
  local-store _₁₅
  local-load _₁₅
  global-load nil
  call assert-equal
  drop
  literal 1
  global-load nil
  call li
  local-store _₁₆
  literal 1
  ref li
  literal 1
  apply
  local-store _₁₇
  global-load nil
  local-load _₁₇
  literal 1
  apply
  local-store _₁₈
  local-load _₁₆
  local-load _₁₈
  tail-call assert-equal

