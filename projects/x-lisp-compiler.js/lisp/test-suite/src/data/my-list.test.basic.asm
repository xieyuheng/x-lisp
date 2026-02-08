define-function main
body:
  call nil
  local-store _₁
  local-load _₁
  literal #nil
  call assert-equal
  drop
  call nil
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
  call nil
  local-store _₆
  local-load _₆
  call nil?
  local-store _₇
  local-load _₇
  call assert
  drop
  call nil
  local-store _₈
  literal 3
  local-load _₈
  call li
  local-store _₉
  literal 2
  local-load _₉
  call li
  local-store _₁₀
  literal 1
  local-load _₁₀
  call li
  local-store _₁₁
  local-load _₁₁
  call li?
  local-store _₁₂
  local-load _₁₂
  call assert
  drop
  call nil
  local-store _₁₃
  local-load _₁₃
  call li?
  local-store _₁₄
  local-load _₁₄
  call assert-not
  drop
  call nil
  local-store _₁₅
  literal 3
  local-load _₁₅
  call li
  local-store _₁₆
  literal 2
  local-load _₁₆
  call li
  local-store _₁₇
  literal 1
  local-load _₁₇
  call li
  local-store _₁₈
  local-load _₁₈
  call nil?
  local-store _₁₉
  local-load _₁₉
  call assert-not
  drop
  call nil
  local-store _₂₀
  literal 1
  local-load _₂₀
  call li
  local-store _₂₁
  local-load _₂₁
  call li-tail
  local-store _₂₂
  call nil
  local-store _₂₃
  local-load _₂₂
  local-load _₂₃
  call assert-equal
  drop
  call nil
  local-store _₂₄
  literal 1
  local-load _₂₄
  call li
  local-store _₂₅
  local-load _₂₅
  call li-head
  local-store _₂₆
  local-load _₂₆
  literal 1
  call assert-equal
  drop
  call nil
  local-store _₂₇
  literal 3
  local-load _₂₇
  call li
  local-store _₂₈
  literal 2
  local-load _₂₈
  call li
  local-store _₂₉
  literal 1
  local-load _₂₉
  call li
  local-store list₁
  local-load list₁
  call li-head
  local-store _₃₀
  local-load _₃₀
  literal 1
  call assert-equal
  drop
  literal 111
  local-load list₁
  call li-put-head!
  drop
  local-load list₁
  call li-head
  local-store _₃₁
  local-load _₃₁
  literal 111
  call assert-equal
  drop
  local-load list₁
  call li-tail
  local-store _₃₂
  call nil
  local-store _₃₃
  literal 3
  local-load _₃₃
  call li
  local-store _₃₄
  literal 2
  local-load _₃₄
  call li
  local-store _₃₅
  local-load _₃₂
  local-load _₃₅
  call assert-equal
  drop
  call nil
  local-store _₃₆
  local-load _₃₆
  local-load list₁
  call li-put-tail!
  drop
  local-load list₁
  call li-tail
  local-store _₃₇
  call nil
  local-store _₃₈
  local-load _₃₇
  local-load _₃₈
  call assert-equal
  drop
  call nil
  local-store _₃₉
  ref int?
  local-load _₃₉
  call my-list?
  local-store _₄₀
  local-load _₄₀
  call assert
  drop
  call nil
  local-store _₄₁
  literal 3
  local-load _₄₁
  call li
  local-store _₄₂
  literal 2
  local-load _₄₂
  call li
  local-store _₄₃
  literal 1
  local-load _₄₃
  call li
  local-store _₄₄
  ref int?
  local-load _₄₄
  call my-list?
  local-store _₄₅
  local-load _₄₅
  call assert
  drop
  call nil
  local-store _₄₆
  ref symbol?
  local-load _₄₆
  call my-list?
  local-store _₄₇
  local-load _₄₇
  call assert
  drop
  call nil
  local-store _₄₈
  literal 3
  local-load _₄₈
  call li
  local-store _₄₉
  literal 2
  local-load _₄₉
  call li
  local-store _₅₀
  literal 1
  local-load _₅₀
  call li
  local-store _₅₁
  ref symbol?
  local-load _₅₁
  call my-list?
  local-store _₅₂
  local-load _₅₂
  call assert-not
  drop
  ref int?
  literal 1
  call my-list?
  local-store _₅₃
  local-load _₅₃
  call assert-not
  drop
  ref int?
  literal 'a
  call my-list?
  local-store _₅₄
  local-load _₅₄
  call assert-not
  drop
  call nil
  local-store _₅₅
  literal 1
  local-load _₅₅
  call li
  local-store _₅₆
  literal 1
  ref li
  literal 1
  apply
  local-store _₅₇
  call nil
  local-store _₅₈
  local-load _₅₈
  local-load _₅₇
  literal 1
  apply
  local-store _₅₉
  local-load _₅₆
  local-load _₅₉
  tail-call assert-equal

