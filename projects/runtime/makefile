cc = gcc
ifeq ($(STATIC), true)
static_ldflags = \
	-static
endif
ifeq ($(TSAN), true)
tsan_ldflags = -fsanitize=thread
tsan_cflags= -fsanitize=thread
endif
ldflags = \
	-L/usr/local/lib \
	-lm \
	-pthread \
	$(static_ldflags) \
	$(tsan_ldflags) \
	$(LDFLAGS)
cflags = \
	-g \
	-O3 \
	-std=c23 \
	-I/usr/local/include \
	-Wall \
	-Wwrite-strings \
	-Wextra \
	-Werror \
	-Wpedantic \
	-D_POSIX_C_SOURCE=200809L \
	-D_TIME_BITS=64 \
	-D_FILE_OFFSET_BITS=64 \
	$(tsan_cflags) \
	$(CFLAGS)
src = $(shell find src -name '*.c')
headers = $(shell find src -name '*.h')
lib = $(patsubst src/%, lib/%, $(patsubst %.c, %.o, $(src)))

.PHONY: all run test clean

all: bin/bundle

run: bin/bundle
	./bin/bundle

test: bin/tester
	./bin/tester test-self

bin/tester: bin/tester.c $(lib)
	$(cc) $^ $(cflags) $(ldflags) -o $@

bin/bundle: bin/runtime.o bin/bundle.o
	$(cc) $^ $(ldflags) -o $@

bin/bundle.o: bin/bundle.c
	$(cc) -r $^ $(cflags) -o bin/bundle.o

bin/runtime.o: bin/runtime.c $(lib)
	$(cc) -r $^ $(cflags) -o bin/runtime.o

lib/%.o: src/%.c $(headers)
	mkdir -p $(dir $@); $(cc) -c $(cflags) $< -o $@

clean:
	rm -rf lib bin/*.o bin/bundle bin/tester
