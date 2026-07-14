#!/usr/bin/env python3
"""Extract likely Russian UI strings from locale files and frontend source."""

from __future__ import annotations

import argparse
import fnmatch
import json
import os
import re
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional


SUPPORTED_EXTS = {".json", ".yml", ".yaml", ".ts", ".tsx", ".js", ".jsx", ".vue"}
IGNORED_DIRS = {"node_modules", "dist", "build", "coverage", ".next", ".nuxt", ".git"}
IGNORED_FILES = {"package-lock.json", "yarn.lock", "pnpm-lock.yaml"}
RUSSIAN_RE = re.compile(r"[А-Яа-яЁё]")
QUOTED_RE = re.compile(r"""(?P<quote>["'`])(?P<value>(?:\\.|(?!\1).)*?[А-Яа-яЁё].*?)(?P=quote)""", re.DOTALL)


def is_ignored(path: Path) -> bool:
    return path.name in IGNORED_FILES or any(part in IGNORED_DIRS for part in path.parts)


def iter_files(paths: Iterable[Path], include: Optional[str]) -> Iterable[Path]:
    for path in paths:
        if is_ignored(path):
            continue
        if path.is_file():
            if path.suffix in SUPPORTED_EXTS and (include is None or fnmatch.fnmatch(path.name, include)):
                yield path
            continue
        if path.is_dir():
            for root, dirs, files in os.walk(path):
                root_path = Path(root)
                dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]
                for name in files:
                    file_path = root_path / name
                    if is_ignored(file_path):
                        continue
                    if file_path.suffix not in SUPPORTED_EXTS:
                        continue
                    if include and not fnmatch.fnmatch(name, include):
                        continue
                    yield file_path


def line_number(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def guess_component(key: str) -> str:
    lower = key.lower()
    checks = [
        ("button", ("button", "btn", "cta", "action")),
        ("error", ("error", "fail", "failure", "exception")),
        ("placeholder", ("placeholder", "hinttext")),
        ("label", ("label", "fieldlabel")),
        ("tooltip", ("tooltip",)),
        ("hint", ("hint", "helper")),
        ("alert", ("alert", "banner", "notification", "toast")),
        ("legal", ("legal", "agreement", "consent", "terms", "policy")),
        ("heading", ("title", "heading", "header")),
        ("link", ("link", "url")),
        ("empty_state", ("empty", "notfound", "noitems")),
        ("loading_state", ("loading", "loader", "progress")),
    ]
    for component, markers in checks:
        if any(marker in lower for marker in markers):
            return component
    return "unknown_ui_string"


def add_item(items: List[Dict[str, Any]], path: Path, key: str, value: str, line: int, source_type: str) -> None:
    cleaned = value.strip()
    if not cleaned or not RUSSIAN_RE.search(cleaned):
        return
    items.append(
        {
            "file": str(path),
            "key": key,
            "value": cleaned,
            "line": line,
            "component_guess": guess_component(key),
            "source_type": source_type,
        }
    )


def extract_json(path: Path, text: str) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        return extract_regex(path, text, "json")

    def walk(value: Any, key_path: List[str]) -> None:
        if isinstance(value, dict):
            for key, child in value.items():
                walk(child, key_path + [str(key)])
        elif isinstance(value, list):
            for index, child in enumerate(value):
                walk(child, key_path + [str(index)])
        elif isinstance(value, str):
            key = ".".join(key_path)
            encoded = json.dumps(value, ensure_ascii=False)
            offset = text.find(encoded)
            add_item(items, path, key, value, line_number(text, max(offset, 0)), "json")

    walk(data, [])
    return items


def extract_yaml_like(path: Path, text: str) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    pattern = re.compile(r"^(?P<indent>\s*)(?P<key>[\w.-]+)\s*:\s*(?P<value>.+?)\s*$")
    stack: List[tuple[int, str]] = []
    for idx, line in enumerate(text.splitlines(), start=1):
        match = pattern.match(line)
        if not match:
            continue
        indent = len(match.group("indent"))
        key = match.group("key")
        value = match.group("value").strip().strip("\"'")
        while stack and stack[-1][0] >= indent:
            stack.pop()
        full_key = ".".join([part for _, part in stack] + [key])
        if value and value not in {"|", ">"}:
            add_item(items, path, full_key, value, idx, "yaml")
        else:
            stack.append((indent, key))
    return items


def decode_js_string(value: str) -> str:
    if "\\" not in value:
        return value
    try:
        return bytes(value, "utf-8").decode("unicode_escape")
    except UnicodeDecodeError:
        return value


def extract_regex(path: Path, text: str, source_type: str) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    for index, match in enumerate(QUOTED_RE.finditer(text), start=1):
        value = decode_js_string(match.group("value"))
        add_item(items, path, f"inline_{index}", value, line_number(text, match.start()), source_type)
    return items


def extract_file(path: Path) -> List[Dict[str, Any]]:
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        text = path.read_text(encoding="utf-8", errors="ignore")

    suffix = path.suffix.lower()
    if suffix == ".json":
        return extract_json(path, text)
    if suffix in {".yml", ".yaml"}:
        return extract_yaml_like(path, text)
    return extract_regex(path, text, suffix.lstrip("."))


def format_md(items: List[Dict[str, Any]]) -> str:
    lines = ["| File | Line | Key | Component | Value |", "|---|---:|---|---|---|"]
    for item in items:
        value = str(item["value"]).replace("|", "\\|").replace("\n", " ")
        lines.append(f"| {item['file']} | {item['line']} | {item['key']} | {item['component_guess']} | {value} |")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="+", type=Path)
    parser.add_argument("--include", help="Filename glob, for example '*.tsx'")
    parser.add_argument("--format", choices=("text", "json", "md"), default="text")
    args = parser.parse_args()

    items: List[Dict[str, Any]] = []
    for file_path in iter_files(args.paths, args.include):
        items.extend(extract_file(file_path))

    if args.format == "json":
        print(json.dumps(items, ensure_ascii=False, indent=2))
    elif args.format == "md":
        print(format_md(items))
    else:
        for item in items:
            print(f"{item['file']}:{item['line']} {item['key']} [{item['component_guess']}] {item['value']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
