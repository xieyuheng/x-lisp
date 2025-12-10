# sexp.c

[sexp.c] port sexp.js

- support comment this time
- with router like api

# cicada-forth

x-forth with chinese syntax keywords

```ruby
函数 平方（数）
  数 数 相乘
结束

函数 阶乘（数）
  数 为零？ 则
    一
  否则
    数 减一 阶乘 数 相乘
  然后
结束
```
