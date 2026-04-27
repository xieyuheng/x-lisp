#pragma once

void format_span_report(buffer_t *buffer, struct span_t span, const char *context);
void format_source_location_report(buffer_t *buffer, const char *pathname, struct span_t span, const char message);
