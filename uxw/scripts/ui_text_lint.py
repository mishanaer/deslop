#!/usr/bin/env python3
"""Heuristic UX writing lint for Russian interface microcopy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional


SCRIPT_DIR = Path(__file__).resolve().parent
EXTRACT_PATH = SCRIPT_DIR / "extract_ui_strings.py"
spec = importlib.util.spec_from_file_location("extract_ui_strings", EXTRACT_PATH)
extract_ui_strings = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(extract_ui_strings)

Issue = Dict[str, Any]


def issue(item: Dict[str, Any], rule_id: str, severity: str, message: str, suggestion: Optional[str] = None) -> Issue:
    result: Issue = {
        "file": item.get("file", "<text>"),
        "line": item.get("line", 1),
        "key": item.get("key", ""),
        "component": item.get("component_guess", "unknown_ui_string"),
        "value": item["value"],
        "rule_id": rule_id,
        "severity": severity,
        "message": message,
    }
    if suggestion:
        result["suggestion"] = suggestion
    return result


def strip_final_period(text: str) -> str:
    return re.sub(r"\.$", "", text.strip())


def normalize_button(text: str) -> Optional[str]:
    stripped = strip_final_period(text)
    replacements = {
        "Хочу удалить": "Удалить",
        "Хочу сохранить": "Сохранить",
        "Сохраняю": "Сохранить",
        "Удаляю": "Удалить",
        "Отправляю": "Отправить",
        "Я понял": "Понятно",
        "ОК": "Понятно",
        "Ok": "Понятно",
        "OK": "Понятно",
    }
    return replacements.get(stripped)


def lint_item(item: Dict[str, Any], forced_component: Optional[str] = None) -> List[Issue]:
    value = item["value"].strip()
    lower = value.lower()
    component = forced_component or item.get("component_guess", "unknown_ui_string")
    scoped = {**item, "component_guess": component}
    issues: List[Issue] = []

    if re.search(r"\b(извините|простите|к сожалению|ой)\b", lower):
        issues.append(
            issue(
                scoped,
                "ui.tone.no_apologies",
                "warning",
                "Обычная UI-ошибка лучше звучит без извинений и эмоционального вступления.",
            )
        )

    if re.search(r"\b(ура|супер|отлично|поздравляем)\b", lower):
        issues.append(issue(scoped, "ui.tone.no_hype", "suggestion", "Проверьте, не слишком ли эмоциональный тон для продуктового UI."))

    if "!" in value:
        issues.append(issue(scoped, "ui.typography.no_exclamation", "suggestion", "Восклицание редко нужно в обычном UI."))

    if re.search(r"\b(Вы|Ваш|Вам|Вами|Вашего|Вашему|Вашим)\b", value):
        issues.append(issue(scoped, "ui.tone.lowercase_you", "suggestion", "В клиентском UI обычно пишут «вы» со строчной."))

    button_suggestion = normalize_button(value)
    if component == "button":
        if lower.startswith("хочу "):
            issues.append(issue(scoped, "ui.button.no_i_want", "warning", "Кнопка обычно должна быть прямым действием.", button_suggestion))
        if lower in {"сохраняю", "удаляю", "отправляю", "загружаю"}:
            issues.append(
                issue(scoped, "ui.button.no_system_present_tense", "warning", "Не используйте настоящее время от лица системы в кнопке.", button_suggestion)
            )
        if lower in {"ок", "ok"}:
            issues.append(issue(scoped, "ui.button.no_ok", "suggestion", "«Понятно» или конкретное действие обычно яснее.", button_suggestion))
        if value.endswith(".") and len(value) <= 40:
            issues.append(
                issue(scoped, "ui.typography.no_period_in_short_button", "suggestion", "В короткой кнопке точка обычно не нужна.", strip_final_period(value))
            )
        if len(value) > 32:
            issues.append(issue(scoped, "ui.button.too_long", "suggestion", "Проверьте длину кнопки для узких экранов."))

    if component in {"label", "placeholder", "unknown_ui_string"} and re.search(r"\b(введите|напишите|начните писать)\b", lower):
        suggestion = re.sub(r"^(Введите|Напишите|Начните писать)\s+", "", value).strip()
        issues.append(
            issue(scoped, "ui.form.no_enter_write_start_typing", "warning", "Лейбл или плейсхолдер обычно называет данные.", suggestion or None)
        )

    if component in {"link", "unknown_ui_string"} and re.search(r"\b(здесь|тут|по ссылке|подробнее здесь)\b", lower):
        issues.append(issue(scoped, "ui.link.meaningful_text", "warning", "Ссылка должна называть место назначения или действие."))

    if re.search(r"\b(нужно|необходимо|можно|должен|должна|следует)\b", lower):
        issues.append(issue(scoped, "ui.language.modal_verbs", "suggestion", "Проверьте, нужен ли модальный глагол или можно сказать действие прямо."))

    if re.search(r"\d+\s+%", value):
        issues.append(issue(scoped, "ui.typography.percent_no_space", "warning", "Процент пишется без пробела.", re.sub(r"(\d+)\s+%", r"\1%", value)))

    if re.search(r"\d\s+₽", value):
        suggestion = re.sub(r"(?<=\d) (?=\d{3}\b)", "\u00a0", value)
        suggestion = re.sub(r"(?<=\d) ₽", "\u00a0₽", suggestion)
        issues.append(issue(scoped, "ui.typography.currency_nbsp", "suggestion", "Между числом и валютой лучше неразрывный пробел.", suggestion))

    tech_suggestion = value.replace("QR-код", "QR‑код").replace("ПИН-код", "ПИН‑код").replace("СМС-код", "СМС‑код")
    if tech_suggestion != value:
        issues.append(
            issue(scoped, "ui.typography.technical_nonbreaking_hyphen", "suggestion", "Короткий технический термин лучше не разрывать переносом.", tech_suggestion)
        )

    if re.search(r"https?://\S+", value):
        issues.append(issue(scoped, "ui.link.raw_url", "warning", "Raw URL в UI обычно лучше заменить осмысленным текстом ссылки."))

    if component == "heading":
        if value.endswith(".") and len(value) <= 60:
            issues.append(
                issue(scoped, "ui.typography.no_period_in_short_heading", "suggestion", "В коротком заголовке точка обычно не нужна.", strip_final_period(value))
            )
        if len(value) > 70:
            issues.append(issue(scoped, "ui.heading.too_long", "suggestion", "Проверьте, не слишком ли длинный заголовок для UI."))

    return issues


def items_from_text(text: str, component: Optional[str]) -> List[Dict[str, Any]]:
    return [
        {
            "file": "<text>",
            "line": 1,
            "key": "input",
            "value": text,
            "component_guess": component or "unknown_ui_string",
            "source_type": "text",
        }
    ]


def collect_items(paths: Iterable[Path]) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    for file_path in extract_ui_strings.iter_files(paths, include=None):
        items.extend(extract_ui_strings.extract_file(file_path))
    return items


def format_text(issues: List[Issue]) -> str:
    lines: List[str] = []
    for item in issues:
        location = f"{item['file']}:{item['line']} {item['key']}".strip()
        lines.append(f"{location} [{item['severity']}] {item['rule_id']}")
        lines.append(f'"{item["value"]}"')
        if "suggestion" in item:
            lines.append(f'→ suggested: "{item["suggestion"]}"')
        lines.append(f"Reason: {item['message']}")
        lines.append("")
    return "\n".join(lines).rstrip()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="*", type=Path)
    parser.add_argument("--text", help="Lint a single string instead of files")
    parser.add_argument("--component", help="Force component type, for example button/error/label")
    parser.add_argument("--format", choices=("text", "json"), default="text")
    args = parser.parse_args()

    if args.text is not None:
        items = items_from_text(args.text, args.component)
    elif args.paths:
        items = collect_items(args.paths)
    else:
        parser.error("Provide paths or --text")

    issues: List[Issue] = []
    for item in items:
        if args.component and item.get("component_guess") not in {args.component, "unknown_ui_string"}:
            continue
        issues.extend(lint_item(item, args.component))

    if args.format == "json":
        print(json.dumps(issues, ensure_ascii=False, indent=2))
    else:
        output = format_text(issues)
        if output:
            print(output)
    return 1 if any(item["severity"] in {"error", "warning"} for item in issues) else 0


if __name__ == "__main__":
    sys.exit(main())
