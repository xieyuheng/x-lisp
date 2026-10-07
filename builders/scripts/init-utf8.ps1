try {
  $utf8 = New-Object System.Text.UTF8Encoding($false)
  [Console]::InputEncoding = $utf8
  [Console]::OutputEncoding = $utf8
  $OutputEncoding = $utf8
} catch {
  # Non-interactive hosts may not expose a console handle.
}
