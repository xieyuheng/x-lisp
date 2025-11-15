# x-lisp / runtime

## development

```shell
make -j
make run
make test
make clean
```

Using [tsan (ThreadSanitizer)](https://github.com/google/sanitizers/wiki/threadsanitizercppmanual)
to test data race in parallel program:

```shell
make clean && TSAN=true make -j
```
