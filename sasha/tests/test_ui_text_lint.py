#!/usr/bin/env python3

import importlib.util
import unittest
from pathlib import Path


LINTER_PATH = Path(__file__).resolve().parents[1] / "scripts" / "ui_text_lint.py"
spec = importlib.util.spec_from_file_location("ui_text_lint", LINTER_PATH)
ui_text_lint = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(ui_text_lint)


def lint(text: str):
    return ui_text_lint.lint_item(ui_text_lint.items_from_text(text, None)[0])


class FinalPeriodTests(unittest.TestCase):
    def test_removes_period_from_one_sentence(self):
        issues = lint("Готово.")
        self.assertEqual(issues[0]["suggestion"], "Готово")

    def test_removes_only_final_period_from_two_sentences(self):
        issues = lint("Не загрузилось. Попробуйте снова.")
        self.assertEqual(issues[0]["suggestion"], "Не загрузилось. Попробуйте снова")

    def test_allows_final_period_from_three_sentences(self):
        self.assertEqual(lint("Первое. Второе. Третье."), [])

    def test_removes_period_before_closing_quote(self):
        issues = lint("«Готово.»")
        self.assertEqual(issues[0]["suggestion"], "«Готово»")


class OneLetterPrepositionTests(unittest.TestCase):
    def test_replaces_spaces_after_all_one_letter_prepositions(self):
        issues = lint("Оплатите в приложении к сроку с карты у кассира о тарифе")
        self.assertEqual(
            issues[0]["suggestion"],
            "Оплатите в приложении к сроку с карты у кассира о тарифе",
        )

    def test_accepts_existing_nonbreaking_space(self):
        self.assertEqual(lint("Оплатите в приложении"), [])


if __name__ == "__main__":
    unittest.main()
