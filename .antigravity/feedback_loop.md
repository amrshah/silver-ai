# Feedback Loop - Antigravity

This document records USER corrections, preferences, and feedback to ensure the AI assistant continuously adapts and avoids repeating mistakes.

## Instructions
1. Every time the USER corrects a code pattern, logic flaw, or stylistic choice, record it here.
2. Every time a new rule is established via chat, add it to the "Rules" section.
3. Review this file before starting any new task.

## Corrections Log
- **2026-02-02**: System PHP is 8.3.30. Downgraded Laravel from v12 to v11. Required to ensure stability.
- **2026-02-02**: SQLite driver was missing in `php.ini`. Manually enabled `pdo_sqlite` and `sqlite3` in `C:\php-8.3.30\php.ini`.

## Established Rules
1. **Self-Healing**: If internal context conflicts with physical files, reset context based on `.antigravity/artifacts/`.
2. **Just-In-Time Reading**: Load only files directly related to the current phase's artifact to optimize memory/CPU.
3. **Laravel Version**: Strictly use Laravel ^11.0 to maintain compatibility with local PHP 8.3.
4. **PHP Config**: If "driver not found" errors occur, verify `C:\php-8.3.30\php.ini` contains enabled extensions.
