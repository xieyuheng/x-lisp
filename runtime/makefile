cc = cc
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
	-std=c2x \
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

all: begin

run: begin
	./begin

test: tester
	./tester test-self

tester: tester.c $(lib)
	$(cc) $^ $(ldflags) -o $@

begin: runtime.o begin.o
	$(cc) $^ $(ldflags) -o $@

begin.o: begin.c
	$(cc) -r $^ $(ldflags) -o begin.o

runtime.o: runtime.c $(lib)
	$(cc) -r $^ $(ldflags) -o runtime.o

lib/%.o: src/%.c $(headers)
	mkdir -p $(dir $@); $(cc) -c $(cflags) $< -o $@

clean:
	rm -rf lib *.o begin tester
