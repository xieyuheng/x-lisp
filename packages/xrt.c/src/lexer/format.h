#pragma once

void write_span_in_context(buffer_t *buffer, struct span_t span, const char *context);
void write_message_with_location(buffer_t *buffer, const char *message, struct source_location_t location);
