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
lib = $(patsubst %.c, %.o, $(src))

.PHONY: all run test clean

all: test

test: bin/tester
	./bin/tester test-self

bin/tester: bin/tester.c src/libhelpers.a
	$(cc) $^ $(cflags) $(ldflags) -o $@

src/libhelpers.a: $(lib)
	ar rcs $@ $^

src/%.o: src/%.c $(headers)
	mkdir -p $(dir $@); $(cc) -c $(cflags) $< -o $@

clean:
	rm -rf $(lib) src/libhelpers.a bin/tester
