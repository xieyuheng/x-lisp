cc = gcc

cflags = -std=c23
cflags += -g
cflags += -O3
cflags += -I/usr/local/include
cflags += -Wall
cflags += -Wwrite-strings
cflags += -Wextra
cflags += -Werror
cflags += -Wpedantic
cflags += -D_POSIX_C_SOURCE=200809L
cflags += -D_TIME_BITS=64
cflags += -D_FILE_OFFSET_BITS=64
cflags += $(CFLAGS)

ldflags = -L/usr/local/lib
ldflags += -lm -pthread
ldflags += $(LDFLAGS)

ifeq ($(TSAN), true)
ldflags += -fsanitize=thread
cflags += -fsanitize=thread
endif

ifeq ($(STATIC), true)
ldflags += -static
endif

targets = $(shell find src -name '*.c' -not -name '*.test.c')
objects = $(patsubst %.c, %.o, $(targets))
headers = $(shell find src -name '*.h')

.PHONY: all run test clean

all: src/index.a

src/index.a: $(objects)
	ar rcs $@ $^

src/%.o: src/%.c $(headers)
	mkdir -p $(dir $@); $(cc) -c $(cflags) $< -o $@

clean:
	rm -rf $(objects) src/index.a
