# Пример workflow: Обработка документов из папки

Бизнес-процесс: каждое утро в папку `C:\inbox` падают счета и договоры. Нужно открыть каждый файл, определить тип документа, извлечь данные, сохранить в базу и переместить в архив.

```rust
use smith_workflow::prelude::*;
use smith_rpa::windows;
use serde_json::json;

// ───────────────────────────────────────────────
// Workflow: "Обработка входящих документов"
// ───────────────────────────────────────────────
let workflow = Workflow::new("process_inbox")
    // ═══════════════════════════════════════════
    // Шаг 1: Детерминированно — открыть папку
    // ═══════════════════════════════════════════
    .step(windows::process_start(r#"C:\Windows\explorer.exe"#, "C:\\inbox"))

    // ═══════════════════════════════════════════
    // Шаг 2: Детерминированно — получить список файлов
    // ═══════════════════════════════════════════
    .step(Step::rpa("fs.list_files").args(json!({
        "path": "C:\\inbox",
        "pattern": "*.pdf;*.xlsx"
    })))

    // ═══════════════════════════════════════════
    // Шаг 3: LLM решает — какие файлы обрабатывать
    // ═══════════════════════════════════════════
    // Файлы могут быть: счёт, договор, служебная записка, спам
    // LLM смотрит на имена и сортирует
    .step(Step::agent_think("Отсортируй файлы по типу: счёт, договор, прочее")
        .schema(json!({
            "type": "object",
            "properties": {
                "invoices": { "type": "array", "items": { "type": "string" } },
                "contracts": { "type": "array", "items": { "type": "string" } },
                "skipped": { "type": "array", "items": { "type": "string" } }
            }
        })))

    // ═══════════════════════════════════════════
    // Шаг 4: LLM решает — с чего начать
    // ═══════════════════════════════════════════
    .step(Step::agent_decide("С чего начать обработку?")
        .options(&["process_invoices_first", "process_contracts_first"]))

    // ── Далее — обработка каждого счёта ──
    // (в реальности тут был бы for_each, но для примера — один счёт)

    // ═══════════════════════════════════════════
    // Шаг 5: Детерминированно — открыть файл
    // ═══════════════════════════════════════════
    .step(windows::process_start("EXCEL.EXE", "C:\\inbox\\счёт_123.xlsx"))

    // ═══════════════════════════════════════════
    // Шаг 6: Детерминированно — выделить и скопировать данные
    // ═══════════════════════════════════════════
    .step(Step::rpa("windows.find").args(json!({"name": "Сумма"})))
    .step(windows::click())
    .step(Step::rpa("windows.copy").args(json!({})))
    .step(Step::rpa("clipboard.read").args(json!({})))

    // ═══════════════════════════════════════════
    // Шаг 7: LLM проверяет — корректная сумма?
    // ═══════════════════════════════════════════
    .step(Step::agent_think("Проверь, что сумма в документе — валидное число и > 0"))

    // ═══════════════════════════════════════════
    // Шаг 8: LLM решает — дальше
    // ═══════════════════════════════════════════
    .step(Step::agent_decide("Счёт корректен?")
        .options(&["save_to_db", "mark_for_review", "skip"]))

    // ── Conditional routing ──
    .on_choice("save_to_db", Workflow::new("save_invoice")
        // Детерминированно: заполнить форму в 1С
        .step(windows::process_start("1CV8.exe", ""))
        .step(windows::find("name=Счёт на оплату"))
        .step(windows::set_text("Сумма"))
        .step(windows::find("name=Сохранить"))
        .step(windows::click())
        // LLM: проверить, что сохранилось
        .step(Step::agent_think("Проверь, что документ сохранился"))
    )
    .on_choice("mark_for_review", Workflow::new("mark_for_review")
        // Детерминированно: переместить в папку review
        .step(Step::rpa("fs.move_file").args(json!({
            "from": "{{file_path}}",
            "to": "C:\\inbox\\review\\"
        })))
        // LLM: написать причину
        .step(Step::agent_think("Опиши, почему счёт требует проверки"))
    )
    .on_choice("skip", Workflow::new("skip")
        .step(Step::rpa("fs.move_file").args(json!({
            "from": "{{file_path}}",
            "to": "C:\\inbox\\skipped\\"
        })))
    )

    // ═══════════════════════════════════════════
    // Шаг 9: LLM — отчёт об обработке
    // ═══════════════════════════════════════════
    .step(Step::agent_think("Составь краткий отчёт: какие файлы обработаны, какие пропущены, сколько времени заняло"))

    .build();
```

## Как это работает в рантайме

Последовательность выполнения для типичного запуска:

```
Шаг 0  [RPA]     explorer.exe C:\inbox                    → ✓
Шаг 1  [RPA]     fs.list_files                             → [счёт_123.xlsx, договор_456.pdf, readme.txt]
Шаг 2  [Think]   LLM сортирует файлы по типу              → invoices: [счёт_123.xlsx], contracts: [договор_456.pdf], skipped: [readme.txt]
Шаг 3  [Decide]  LLM выбирает: с чего начать              → "process_invoices_first"
Шаг 4  [RPA]     EXCEL.EXE счёт_123.xlsx                   → ✓
Шаг 5  [RPA]     windows.find "Сумма"                      → ✓
Шаг 6  [RPA]     windows.click                             → ✓
Шаг 7  [RPA]     clipboard.read                            → "12 450.00 ₽"
Шаг 8  [Think]   LLM проверяет сумму                       → valid: true
Шаг 9  [Decide]  LLM: счёт корректен?                      → "save_to_db"
       └── on_choice → запуск под-workflow "save_invoice"
Шаг 10 [RPA]     1CV8.exe                                   → ✓
Шаг 11 [RPA]     windows.find "Счёт на оплату"              → ✓
Шаг 12 [RPA]     windows.set_text                           → ✓
Шаг 13 [RPA]     windows.find "Сохранить"                   → ✓
Шаг 14 [RPA]     windows.click                              → ✓
Шаг 15 [Think]   Проверка сохранения                        → ✓
Шаг 16 [Think]   LLM составляет отчёт                       → "Обработано: 1 счёт, 1 договор. Пропущено: 1."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Workflow: process_inbox completed (28.4s)
Steps: 17 | RPA: 11 | AI: 6 | Success: ✓
```

## Что здесь важно

**RPA-шаги (11 из 17)** — дешёвые, быстрые, детерминированные. Открыть, найти, кликнуть, прочитать.

**AI-шаги (6 из 17)** — только там, где нужно принять решение:
- Классифицировать файлы → Think
- Выбрать порядок → Decide
- Проверить корректность → Think
- Выбрать действие → Decide
- Написать причину → Think
- Составить отчёт → Think

**Ни одного AI-шага на простое действие.** LLM не вызывается для `click()`, `find()` или `input_text()` — это было бы пустой тратой денег и времени.

**Conditional routing** — после Decide маршрут меняется: счёт уходит в базу, ошибка — в review, мусор — в skip. Без LLM-ветвления это был бы if-else лес.
