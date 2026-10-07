#pragma once

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

#if defined(_WIN32)
#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif
#ifndef NOMINMAX
#define NOMINMAX
#endif
#include <windows.h>

typedef HANDLE os_thread_handle_t;
typedef CRITICAL_SECTION os_mutex_t;
typedef SRWLOCK os_spinlock_t;
#else
#include <pthread.h>

typedef pthread_t os_thread_handle_t;
typedef pthread_mutex_t os_mutex_t;
typedef pthread_spinlock_t os_spinlock_t;
#endif

typedef struct os_dir_t os_dir_t;
