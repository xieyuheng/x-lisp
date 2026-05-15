#pragma once

void format_span_in_context(buffer_t *buffer, struct span_t span, const char *context);
void format_message_with_source_location(buffer_t *buffer, const char *message, struct source_location_t location);
