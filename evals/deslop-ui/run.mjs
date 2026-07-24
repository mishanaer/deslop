#!/usr/bin/env node

import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { setupProject as setupMiniAppProject } from "../../mini-app/bin/mini-app.mjs";
import { setupProject as setupWebUiProject } from "../../web-ui/bin/web-ui.mjs";

const evalDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(evalDir, "../..");
const skillDir = resolve(root, "deslop-ui");

const failures = [];
const passes = [];

function read(path) {
  return readFileSync(resolve(root, path), "utf8");
}

function readJson(path) {
  return JSON.parse(read(path));
}

function check(id, condition, detail) {
  if (condition) {
    passes.push({ id, detail });
    return;
  }

  failures.push({ id, detail });
}

function containsAll(text, values) {
  const haystack = text.toLowerCase();
  return values.every((value) => haystack.includes(value.toLowerCase()));
}

function sorted(values) {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function equalArrays(left, right) {
  return JSON.stringify(sorted(left)) === JSON.stringify(sorted(right));
}

function issue(code, message) {
  return { code, message };
}

function formatIssues(issues) {
  return issues.map(({ code, message }) => `${code}: ${message}`).join("; ");
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

function repoArtifactExists(path) {
  if (!isNonEmptyString(path) || path.startsWith("/") || path.includes("\0")) {
    return false;
  }

  const absolute = resolve(root, path);
  const fromRoot = relative(root, absolute);
  return fromRoot !== ".."
    && !fromRoot.startsWith(`..${sep}`)
    && existsSync(absolute);
}

function validateEvidenceRecords(evidence, claims, { sourceOnly = false } = {}) {
  const issues = [];
  const records = Array.isArray(evidence) ? evidence : [];
  const claimList = Array.isArray(claims) ? claims : [];
  const allowedClaims = new Set([
    "rendered",
    "responsive-verified",
    "dark-theme-verified",
    "a11y-verified",
    "keyboard-tested",
    "code-confirmed",
    "pixel-perfect-clone",
  ]);
  const allowedEvidenceKinds = new Set([
    "render",
    "input-reference",
    "source",
    "dom",
    "accessibility-tree",
    "keyboard",
  ]);
  const ids = new Set();
  const requiredFields = [
    "id",
    "kind",
    "surface",
    "state",
    "viewport",
    "theme",
    "artifact",
  ];

  if (!Array.isArray(evidence)) {
    issues.push(issue("evidence.invalid-schema", "evidence must be an array"));
  }
  if (!Array.isArray(claims) || !claimList.every(isNonEmptyString)) {
    issues.push(issue("claim.invalid-schema", "claims must be an array of strings"));
  }
  if (new Set(claimList).size !== claimList.length) {
    issues.push(issue("claim.duplicate", "claims must be unique"));
  }
  for (const claim of claimList) {
    if (!allowedClaims.has(claim)) {
      issues.push(
        issue(
          "claim.unknown",
          `${claim} is not a supported verification claim`,
        ),
      );
    }
  }

  for (const [index, record] of records.entries()) {
    if (!isPlainObject(record)) {
      issues.push(issue("evidence.invalid-schema", `evidence[${index}] must be an object`));
      continue;
    }

    const missing = requiredFields.filter((field) => !isNonEmptyString(record[field]));
    if (missing.length > 0) {
      issues.push(
        issue(
          "evidence.invalid-schema",
          `evidence[${index}] lacks ${missing.join(", ")}`,
        ),
      );
      continue;
    }

    if (ids.has(record.id)) {
      issues.push(issue("evidence.duplicate-id", `duplicate evidence id ${record.id}`));
    }
    ids.add(record.id);

    if (!allowedEvidenceKinds.has(record.kind)) {
      issues.push(
        issue(
          "evidence.unknown-kind",
          `${record.id} uses unsupported evidence kind ${record.kind}`,
        ),
      );
    }
    if (!repoArtifactExists(record.artifact)) {
      issues.push(
        issue(
          "evidence.artifact-missing",
          `${record.id} points to missing or external artifact ${record.artifact}`,
        ),
      );
    }
  }

  const validRecords = records.filter((record) =>
    isPlainObject(record)
    && requiredFields.every((field) => isNonEmptyString(record[field])),
  );
  const renderEvidence = validRecords.filter((record) => record.kind === "render");
  const hasRender = renderEvidence.length > 0;
  const hasResponsivePair = renderEvidence.some((left) =>
    renderEvidence.some((right) =>
      left.id !== right.id
      && left.surface === right.surface
      && left.state === right.state
      && left.theme === right.theme
      && left.viewport !== right.viewport,
    ),
  );
  const hasThemePair = renderEvidence.some((light) =>
    light.theme.toLowerCase() === "light"
    && renderEvidence.some((dark) =>
      dark.theme.toLowerCase() === "dark"
      && light.surface === dark.surface
      && light.state === dark.state
      && light.viewport === dark.viewport,
    ),
  );
  const hasAccessibilityTree = validRecords.some((record) =>
    ["accessibility-tree", "dom"].includes(record.kind),
  );
  const hasKeyboard = validRecords.some((record) => record.kind === "keyboard");
  const hasSource = validRecords.some((record) => record.kind === "source");

  const claimRequirements = [
    ["rendered", hasRender, "claim.rendered.missing-evidence", "a render record"],
    [
      "responsive-verified",
      hasResponsivePair,
      "claim.responsive.missing-evidence",
      "two matching renders with distinct viewports",
    ],
    [
      "dark-theme-verified",
      hasThemePair,
      "claim.dark-theme.missing-evidence",
      "matching light and dark renders",
    ],
    [
      "a11y-verified",
      hasAccessibilityTree && hasKeyboard,
      "claim.a11y.missing-evidence",
      "both accessibility-tree/DOM and keyboard evidence",
    ],
    [
      "keyboard-tested",
      hasKeyboard,
      "claim.keyboard.missing-evidence",
      "keyboard evidence",
    ],
    [
      "code-confirmed",
      hasSource,
      "claim.code-confirmed.missing-evidence",
      "source evidence",
    ],
  ];

  for (const [claim, satisfied, code, requirement] of claimRequirements) {
    if (claimList.includes(claim) && !satisfied) {
      issues.push(issue(code, `${claim} requires ${requirement}`));
    }
  }

  if (claimList.includes("pixel-perfect-clone")) {
    issues.push(
      issue(
        "claim.pixel-perfect-clone",
        "pixel-perfect cloning is disallowed",
      ),
    );
  }

  const visualClaims = new Set([
    "rendered",
    "responsive-verified",
    "dark-theme-verified",
    "a11y-verified",
    "keyboard-tested",
  ]);
  if (sourceOnly && claimList.some((claim) => visualClaims.has(claim))) {
    issues.push(
      issue(
        "claim.source-only.visual",
        "source-only audits may not make visual or interaction verification claims",
      ),
    );
  }
  if (sourceOnly && hasRender) {
    issues.push(
      issue(
        "evidence.source-only.render",
        "source-only audits may not contain render evidence",
      ),
    );
  }

  return issues;
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    return { error: "missing YAML frontmatter", values: {}, keys: [] };
  }

  const values = {};
  const keys = [];

  for (const rawLine of match[1].split(/\r?\n/)) {
    if (!rawLine.trim()) {
      continue;
    }

    const line = rawLine.match(/^([a-z][a-z0-9_-]*):\s*(.*)$/i);
    if (!line) {
      return {
        error: `unsupported or multiline frontmatter: ${rawLine}`,
        values,
        keys,
      };
    }

    const [, key, rawValue] = line;
    keys.push(key);

    if (!rawValue) {
      return { error: `frontmatter ${key} is not a scalar`, values, keys };
    }

    let value = rawValue;
    if (rawValue.startsWith('"')) {
      try {
        value = JSON.parse(rawValue);
      } catch {
        return { error: `frontmatter ${key} is not a valid quoted string`, values, keys };
      }
    } else if (
      rawValue.startsWith("[")
      || rawValue.startsWith("{")
      || /^(?:true|false|null|\d+)$/i.test(rawValue)
    ) {
      return { error: `frontmatter ${key} must be a string`, values, keys };
    }

    values[key] = value;
  }

  return { error: null, values, keys };
}

function extractExportNames(source) {
  const names = new Set();
  const exportBlocks = source.matchAll(/export\s*\{([\s\S]*?)\}\s*(?:from\s+["'][^"']+["'])?/g);

  for (const block of exportBlocks) {
    for (const rawPart of block[1].split(",")) {
      const clean = rawPart
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\btype\s+/g, "")
        .trim();

      if (!clean) {
        continue;
      }

      const alias = clean.match(/\bas\s+([A-Za-z_$][A-Za-z0-9_$]*)$/);
      const direct = clean.match(/^([A-Za-z_$][A-Za-z0-9_$]*)$/);
      const name = alias?.[1] ?? direct?.[1];
      if (name) {
        names.add(name);
      }
    }
  }

  return names;
}

function extractInlineIdentifiers(markdown) {
  return new Set(
    [...markdown.matchAll(/`([A-Z][A-Za-z0-9]+)`/g)].map((match) => match[1]),
  );
}

function slugToPascal(slug) {
  return slug
    .split("-")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join("");
}

function parseWebCatalog() {
  const source = read("web-ui/src/storybook/catalog.ts");
  const slugsBlock = source.match(/const slugs = \[([\s\S]*?)\]\s+as const/);
  const slugs = slugsBlock
    ? [...slugsBlock[1].matchAll(/"([^"]+)"/g)].map((match) => match[1])
    : [];
  const blockNames = [...source.matchAll(/exportName:\s*"([^"]+)"/g)]
    .map((match) => match[1]);

  const primaryOverrides = {
    chart: "ChartContainer",
    direction: "DirectionProvider",
    "input-otp": "InputOTP",
    resizable: "ResizablePanelGroup",
    sonner: "Toaster",
  };

  return {
    slugs,
    blockNames,
    primaryNames: slugs.map((slug) => primaryOverrides[slug] ?? slugToPascal(slug)),
  };
}

function parseWebExports() {
  return parseExportsFromDirectory("web-ui/src/components/ui");
}

function parseExportsFromDirectory(path) {
  const directory = resolve(root, path);
  const names = new Set();

  for (const file of readdirSync(directory)) {
    if (![".ts", ".tsx"].includes(extname(file))) {
      continue;
    }

    const source = readFileSync(resolve(directory, file), "utf8");
    for (const name of extractExportNames(source)) {
      names.add(name);
    }
  }

  return names;
}

function extractPlatformIdentifiers(markdown) {
  const result = {
    web: new Set(),
    "mini-app": new Set(),
  };
  let platform = null;

  for (const line of markdown.split(/\r?\n/)) {
    const prefixed = line.match(/^\s*-\s+(Web|Mini App):\s*(.*)$/);
    if (prefixed) {
      platform = prefixed[1] === "Web" ? "web" : "mini-app";
      for (const name of extractInlineIdentifiers(prefixed[2])) {
        result[platform].add(name);
      }
      continue;
    }

    if (/^\s{2,}\S/.test(line) && platform) {
      for (const name of extractInlineIdentifiers(line)) {
        result[platform].add(name);
      }
      continue;
    }

    platform = null;
  }

  return result;
}

async function generateMiniAppGateway() {
  const fixtureRoot = mkdtempSync(resolve(tmpdir(), "deslop-ui-eval-"));
  try {
    mkdirSync(resolve(fixtureRoot, "src"), { recursive: true });
    writeFileSync(
      resolve(fixtureRoot, "package.json"),
      `${JSON.stringify({
        name: "deslop-ui-eval-consumer",
        private: true,
        type: "module",
        scripts: {},
        dependencies: {
          "@deslop/mini-app": "0.1.0",
        },
      }, null, 2)}\n`,
      "utf8",
    );
    writeFileSync(
      resolve(fixtureRoot, "src/main.js"),
      "export const fixture = true\n",
      "utf8",
    );

    await setupMiniAppProject(fixtureRoot, {
      hooks: false,
      install: false,
      log: () => {},
    });

    return readFileSync(
      resolve(fixtureRoot, "src/components/mini-app/index.js"),
      "utf8",
    );
  } finally {
    rmSync(fixtureRoot, { force: true, recursive: true });
  }
}

async function generateWebGateway() {
  const fixtureRoot = mkdtempSync(resolve(tmpdir(), "deslop-ui-web-eval-"));
  const catalog = readJson("web-ui/agent/components.json");

  try {
    mkdirSync(resolve(fixtureRoot, "src"), { recursive: true });
    writeFileSync(
      resolve(fixtureRoot, "package.json"),
      `${JSON.stringify({
        name: "deslop-ui-web-eval-consumer",
        private: true,
        type: "module",
        scripts: {},
        dependencies: {
          "@deslop/web-ui": "0.1.0",
        },
      }, null, 2)}\n`,
      "utf8",
    );
    writeFileSync(
      resolve(fixtureRoot, "src/main.ts"),
      "export const fixture = true\n",
      "utf8",
    );

    await setupWebUiProject(fixtureRoot, {
      hooks: false,
      install: false,
      log: () => {},
    });

    const gatewayPath = resolve(
      fixtureRoot,
      "src/components/web-ui/index.ts",
    );
    const generatedCatalog = JSON.parse(
      readFileSync(
        resolve(fixtureRoot, ".deslop/web-ui/components.json"),
        "utf8",
      ),
    );
    const moduleFiles = catalog.modules.map(({ local }) => ({
      local,
      exists: existsSync(
        resolve(fixtureRoot, `src/components/web-ui/${local}.ts`),
      ),
    }));

    return {
      gateway: readFileSync(gatewayPath, "utf8"),
      generatedCatalog,
      moduleFiles,
    };
  } finally {
    rmSync(fixtureRoot, { force: true, recursive: true });
  }
}

function executableSource(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function hasAccessibleButton(source) {
  const executable = executableSource(source);
  const native = /<m\.button\b|<button\b/.test(executable);
  const emulated = /\brole\s*=\s*["']button["']/.test(executable)
    && /\btabIndex\b/.test(executable)
    && /\bonKeyDown\b/.test(executable);

  return native || emulated;
}

function computeCapabilityProbes(generatedGateway) {
  const switchSource = read("mini-app/src/components/Switch/index.js");
  const regularButtonSource = read(
    "mini-app/src/components/Button/RegularButton/index.js",
  );
  const executableSwitch = executableSource(switchSource);

  const switchKeyboard = /\btabIndex\b/.test(executableSwitch)
    && /\bonKeyDown\b/.test(executableSwitch);
  const switchNamed = /\.\.\.[A-Za-z_$][A-Za-z0-9_$]*\b/.test(executableSwitch)
    || /\baria-(?:label|labelledby)\b/.test(executableSwitch);

  return new Map([
    ["mini-app-switch-accessible", switchKeyboard && switchNamed],
    [
      "mini-app-regular-button-accessible",
      hasAccessibleButton(regularButtonSource),
    ],
    [
      "mini-app-gateway-use-snackbar",
      /\buseSnackbar\b/.test(generatedGateway),
    ],
  ]);
}

function resolvedCaseOutcome(testCase, capabilityProbes) {
  if (testCase.expect.outcome !== "capability-dependent") {
    return testCase.expect.outcome;
  }

  const probe = testCase.expect.capabilityProbe;
  if (!probe || !capabilityProbes.has(probe.id)) {
    return undefined;
  }

  return capabilityProbes.get(probe.id) ? probe.available : probe.missing;
}

function behavioralSnapshotFiles() {
  const references = readdirSync(resolve(root, "deslop-ui/references"))
    .filter((name) => name.endsWith(".md"))
    .map((name) => `deslop-ui/references/${name}`);
  const caseArtifacts = readJson("evals/deslop-ui/cases.json").cases
    .flatMap((testCase) => testCase.context ?? [])
    .filter((entry) => entry.startsWith("artifact:"))
    .map((entry) => entry.slice("artifact:".length));

  return sorted([
    "deslop-ui/SKILL.md",
    ...references,
    "evals/deslop-ui/cases.json",
    "evals/deslop-ui/rubric.json",
    ...new Set(caseArtifacts),
  ]);
}

function behavioralSnapshotDigest(paths) {
  const hash = createHash("sha256");
  for (const path of paths) {
    hash.update(path);
    hash.update("\0");
    hash.update(read(path));
    hash.update("\0");
  }
  return `sha256:${hash.digest("hex")}`;
}

function validateRoutingFixture(path, caseMap, resolveOutcome) {
  const issues = [];
  const fixture = readJson(path);
  const results = fixture.results;

  if (!Array.isArray(results) || results.length === 0) {
    return [issue("routing.results", "fixture must contain at least one result")];
  }

  const ids = results.map((result) => result?.id).filter(isNonEmptyString);
  if (new Set(ids).size !== ids.length) {
    issues.push(issue("routing.duplicate-id", "fixture result IDs must be unique"));
  }

  for (const [index, result] of results.entries()) {
    if (!isPlainObject(result) || !isNonEmptyString(result.id)) {
      issues.push(issue("routing.invalid-schema", `results[${index}] is invalid`));
      continue;
    }

    const testCase = caseMap.get(result.id);
    if (!testCase) {
      issues.push(issue("routing.unknown-case", `${result.id} is not a declared case`));
      continue;
    }

    const expected = {
      ...testCase.expect,
      outcome: resolveOutcome(testCase),
    };
    for (const key of ["trigger", "mode", "platform", "outcome"]) {
      if (result[key] !== expected[key]) {
        issues.push(
          issue(
            `routing.${key}`,
            `${result.id}: ${key}=${JSON.stringify(result[key])}, expected ${JSON.stringify(expected[key])}`,
          ),
        );
      }
    }

    if (!equalArrays(result.references ?? [], expected.references)) {
      issues.push(issue("routing.references", `${result.id}: reference route differs`));
    }

    if ((expected.mode === "audit" || expected.trigger === false) && result.readOnly !== true) {
      issues.push(
        issue(
          "routing.read-only",
          `${result.id}: audit/non-trigger result is not read-only`,
        ),
      );
    }

    issues.push(
      ...validateEvidenceRecords(
        result.evidence,
        result.claims,
        { sourceOnly: result.outcome === "source-audit-with-limitations" },
      ).map((entry) => ({
        ...entry,
        message: `${result.id}: ${entry.message}`,
      })),
    );
  }

  return issues;
}

function validateAuditFixture(path, evidencePath, { sourceOnly = false } = {}) {
  const text = read(path);
  const issues = [];
  const requiredSections = [
    "## Verdict",
    "## Verified",
    "## Not verified",
  ];

  for (const section of requiredSections) {
    if (!text.includes(section)) {
      issues.push(issue("audit.section", `missing ${section}`));
    }
  }

  const verdict = text.match(
    /## Verdict\s*\r?\n\s*(PASS WITH CONDITIONS|PASS|FAIL|NOT ASSESSED|BLOCKED)\b/i,
  )?.[1]?.toUpperCase();
  const allowedVerdicts = new Set([
    "PASS",
    "PASS WITH CONDITIONS",
    "FAIL",
    "NOT ASSESSED",
    "BLOCKED",
  ]);
  if (!allowedVerdicts.has(verdict)) {
    issues.push(issue("audit.verdict", "missing or invalid verdict"));
  }

  const blockingBody = text.match(
    /## Blocking findings\s*([\s\S]*?)(?=\r?\n## |\s*$)/i,
  )?.[1] ?? "";
  if (
    /^\s*-\s+/m.test(blockingBody)
    && !["FAIL", "BLOCKED"].includes(verdict)
  ) {
    issues.push(
      issue("audit.blocking-verdict", "blocking finding requires FAIL or BLOCKED"),
    );
  }

  if (
    ["NOT ASSESSED", "BLOCKED"].includes(verdict)
    && text.includes("## Scores")
  ) {
    issues.push(
      issue("audit.scores-without-assessment", `${verdict} may not include visual scores`),
    );
  }

  const findings = [
    ...text.matchAll(/^\s*-\s+\[[^\]]+\]\s+([^\r\n]+)/gim),
  ].map((match) => match[1]);
  if (findings.length === 0 || findings.some((finding) =>
    !containsAll(finding, ["Evidence:", "Impact:", "Fix:"])
  )) {
    issues.push(
      issue(
        "audit.finding-structure",
        "each finding must contain Evidence, Impact, and Fix",
      ),
    );
  }

  for (const match of text.matchAll(/Evidence:\s*([^\r\n]+)/gi)) {
    const evidence = match[1];
    if (
      /viewport=|\bat\s+\d+\s*px\b|artifact=/i.test(evidence)
      && !containsAll(evidence, [
        "surface=",
        "state=",
        "viewport=",
        "theme=",
        "artifact=",
      ])
    ) {
      issues.push(
        issue(
          "audit.evidence-coordinates",
          "observed finding lacks complete artifact coordinates",
        ),
      );
    }

    const artifact = evidence.match(/artifact=`([^`]+)`/i)?.[1]
      ?? evidence.match(/artifact=([^;\s]+)/i)?.[1];
    if (artifact && !repoArtifactExists(artifact)) {
      issues.push(
        issue(
          "audit.artifact-missing",
          `finding points to missing artifact ${artifact}`,
        ),
      );
    }
  }

  if (/make it cleaner|add more whitespace|make (?:it|the .*?) pop/i.test(text)) {
    issues.push(issue("audit.vague-critique", "contains vague critique"));
  }

  if (
    /fully verified|all work/i.test(text)
    && !/(screenshot|rendered dom|browser|viewport)/i.test(text)
  ) {
    issues.push(
      issue(
        "audit.unsupported-completeness",
        "claims complete verification without evidence",
      ),
    );
  }

  if (!existsSync(resolve(root, evidencePath))) {
    issues.push(issue("audit.evidence-sidecar", `missing ${evidencePath}`));
  } else {
    const sidecar = readJson(evidencePath);
    if (sidecar.sourceOnly !== sourceOnly) {
      issues.push(
        issue(
          "audit.source-only-schema",
          `sourceOnly must be ${sourceOnly}`,
        ),
      );
    }
    issues.push(
      ...validateEvidenceRecords(
        sidecar.evidence,
        sidecar.claims,
        { sourceOnly },
      ),
    );
  }

  if (sourceOnly && ["PASS", "PASS WITH CONDITIONS", "FAIL"].includes(verdict)) {
    issues.push(
      issue(
        "audit.source-only-verdict",
        "source-only audit must be NOT ASSESSED or BLOCKED",
      ),
    );
  }
  if (sourceOnly && text.includes("## Scores")) {
    issues.push(
      issue(
        "audit.source-only-scores",
        "source-only audit may not include visual scores",
      ),
    );
  }

  return issues;
}

function validateBehavioralRuns(cases, rubric, capabilityProbes) {
  const issues = [];
  const runDirectory = "evals/deslop-ui/runs/final";
  const manifestPath = `${runDirectory}/manifest.json`;
  const snapshotFiles = behavioralSnapshotFiles();
  const snapshotDigest = behavioralSnapshotDigest(snapshotFiles);

  if (!existsSync(resolve(root, manifestPath))) {
    return [
      issue(
        "behavioral.manifest-missing",
        `missing ${manifestPath}; expected snapshot ${snapshotDigest}`,
      ),
    ];
  }

  const manifest = readJson(manifestPath);
  const caseIds = cases.map((testCase) => testCase.id);
  const manifestCases = Array.isArray(manifest.cases) ? manifest.cases : [];
  const manifestCaseIds = manifestCases.map((entry) => entry?.id);
  const executionOrder = manifest.executionOrder;
  const expectedFiles = cases.map((testCase) => `${testCase.id}.json`);
  const actualFiles = existsSync(resolve(root, runDirectory))
    ? readdirSync(resolve(root, runDirectory))
      .filter((name) => name.endsWith(".json") && name !== "manifest.json")
    : [];

  if (manifest.schemaVersion !== 1) {
    issues.push(issue("behavioral.manifest-schema", "manifest schemaVersion must be 1"));
  }
  if (manifest.snapshotDigest !== snapshotDigest) {
    issues.push(
      issue(
        "behavioral.snapshot-stale",
        `manifest=${manifest.snapshotDigest ?? "missing"} current=${snapshotDigest}`,
      ),
    );
  }
  if (!equalArrays(manifest.snapshotFiles ?? [], snapshotFiles)) {
    issues.push(
      issue(
        "behavioral.snapshot-files",
        "manifest snapshotFiles do not match the current skill/eval snapshot",
      ),
    );
  }
  if (
    !Array.isArray(executionOrder)
    || executionOrder.length !== caseIds.length
    || new Set(executionOrder).size !== caseIds.length
    || JSON.stringify(executionOrder) !== JSON.stringify(caseIds)
  ) {
    issues.push(
      issue(
        "behavioral.execution-order",
        "executionOrder must list every case ID exactly once",
      ),
    );
  }
  if (
    manifestCases.length !== caseIds.length
    || new Set(manifestCaseIds).size !== caseIds.length
    || !equalArrays(manifestCaseIds, caseIds)
  ) {
    issues.push(
      issue(
        "behavioral.case-index",
        "manifest cases must index every declared case exactly once",
      ),
    );
  }
  if (!equalArrays(actualFiles, expectedFiles)) {
    issues.push(
      issue(
        "behavioral.result-files",
        `run directory must contain exactly ${expectedFiles.length} case files`,
      ),
    );
  }

  const manifestStarted = Date.parse(manifest.startedAt);
  const manifestCompleted = Date.parse(manifest.completedAt);
  if (
    !Number.isFinite(manifestStarted)
    || !Number.isFinite(manifestCompleted)
    || manifestCompleted < manifestStarted
  ) {
    issues.push(
      issue(
        "behavioral.manifest-timing",
        "manifest must include ordered ISO startedAt/completedAt timestamps",
      ),
    );
  }

  const agentIds = [];
  for (const testCase of cases) {
    const entry = manifestCases.find((candidate) => candidate?.id === testCase.id);
    if (!entry) {
      continue;
    }

    const expectedFile = `${testCase.id}.json`;
    if (entry.file !== expectedFile || !isNonEmptyString(entry.agentId)) {
      issues.push(
        issue(
          "behavioral.case-index-entry",
          `${testCase.id}: expected file=${expectedFile} and a non-empty agentId`,
        ),
      );
      continue;
    }

    const resultPath = `${runDirectory}/${entry.file}`;
    if (!existsSync(resolve(root, resultPath))) {
      issues.push(issue("behavioral.case-file-missing", `${resultPath} is missing`));
      continue;
    }

    const result = readJson(resultPath);
    agentIds.push(result.agentId);
    const expectedOutcome = resolvedCaseOutcome(testCase, capabilityProbes);
    const expectedReferencesRead = [
      "deslop-ui/SKILL.md",
      ...testCase.expect.references.map((path) => `deslop-ui/${path}`),
    ];
    const expectedArtifactReads = testCase.context
      .filter((entry) => entry.startsWith("artifact:"))
      .map((entry) => entry.slice("artifact:".length));
    const suppliedArtifactKind = testCase.context
      .find((entry) => entry.startsWith("artifact-kind:"))
      ?.slice("artifact-kind:".length);
    const expectedArtifactEvidenceKind = suppliedArtifactKind === "synthetic-render-fixture"
      ? "render"
      : suppliedArtifactKind === "synthetic-reference"
        ? "input-reference"
        : undefined;

    if (
      result.schemaVersion !== 1
      || result.caseId !== testCase.id
      || result.snapshotDigest !== snapshotDigest
      || result.agentId !== entry.agentId
    ) {
      issues.push(
        issue(
          "behavioral.case-schema",
          `${testCase.id}: schema, identity, agent, or snapshot mismatch`,
        ),
      );
    }
    if (result.prompt !== testCase.prompt || !equalArrays(result.context ?? [], testCase.context)) {
      issues.push(
        issue(
          "behavioral.case-input",
          `${testCase.id}: prompt/context differ from cases.json`,
        ),
      );
    }
    if (
      JSON.stringify(result.gateCriteria ?? {})
      !== JSON.stringify(testCase.gateCriteria ?? {})
    ) {
      issues.push(
        issue(
          "behavioral.gate-criteria",
          `${testCase.id}: gateCriteria must exactly retain the declared evaluation semantics`,
        ),
      );
    }
    if (!isNonEmptyString(result.rawOutput)) {
      issues.push(
        issue(
          "behavioral.raw-output",
          `${testCase.id}: rawOutput must preserve the full non-empty response`,
        ),
      );
    }

    const started = Date.parse(result.startedAt);
    const completed = Date.parse(result.completedAt);
    if (
      !Number.isFinite(started)
      || !Number.isFinite(completed)
      || completed < started
      || (
        Number.isFinite(manifestStarted)
        && Number.isFinite(manifestCompleted)
        && (started < manifestStarted || completed > manifestCompleted)
      )
    ) {
      issues.push(
        issue(
          "behavioral.case-timing",
          `${testCase.id}: invalid or out-of-manifest timing`,
        ),
      );
    }

    const actual = result.actual;
    if (
      !isPlainObject(actual)
      || actual.trigger !== testCase.expect.trigger
      || actual.mode !== testCase.expect.mode
      || actual.platform !== testCase.expect.platform
      || actual.outcome !== expectedOutcome
      || !equalArrays(actual.references ?? [], testCase.expect.references)
      || actual.readOnly !== (
        testCase.expect.mode === "audit"
        || testCase.expect.trigger === false
        || [
          "block-on-hard-gate",
          "clarify",
          "inspect-before-direction",
          "inspect-local-kit",
          "report-missing-capability",
          "request-artifact",
          "source-audit-with-limitations",
        ]
          .includes(expectedOutcome)
      )
    ) {
      issues.push(
        issue(
          "behavioral.actual-routing",
          `${testCase.id}: actual routing/outcome/readOnly differs from the live expectation`,
        ),
      );
    }

    if (!equalArrays(result.referencesRead ?? [], expectedReferencesRead)) {
      issues.push(
        issue(
          "behavioral.references-read",
          `${testCase.id}: referencesRead must exactly match routed skill references`,
        ),
      );
    }
    if (
      !isStringArray(result.filesRead)
      || ![...expectedReferencesRead, ...expectedArtifactReads]
        .every((path) => result.filesRead.includes(path))
    ) {
      issues.push(
        issue(
          "behavioral.files-read",
          `${testCase.id}: filesRead must include the skill, routed references, and supplied artifacts`,
        ),
      );
    }
    const leakedEvalReads = isStringArray(result.filesRead)
      ? result.filesRead.filter((path) =>
        path.startsWith("evals/deslop-ui/")
        && !expectedArtifactReads.includes(path)
      )
      : [];
    const leakedEvalLedger = Array.isArray(result.toolLedger)
      ? result.toolLedger.filter((entryValue) =>
        isPlainObject(entryValue)
        && entryValue.target.includes("evals/deslop-ui/")
        && !expectedArtifactReads.includes(entryValue.target)
      )
      : [];
    if (leakedEvalReads.length > 0 || leakedEvalLedger.length > 0) {
      issues.push(
        issue(
          "behavioral.eval-leakage",
          `${testCase.id}: case agent read eval harness, rubric, cases, or prior runs`,
        ),
      );
    }
    if (!Array.isArray(result.filesChanged) || result.filesChanged.length !== 0) {
      issues.push(
        issue(
          "behavioral.read-only-harness",
          `${testCase.id}: eval agent must not mutate repository files`,
        ),
      );
    }
    if (
      !Array.isArray(result.toolLedger)
      || result.toolLedger.length === 0
      || result.toolLedger.some((entryValue) =>
        !isPlainObject(entryValue)
        || !["read", "command", "render", "none"].includes(entryValue.kind)
        || !isNonEmptyString(entryValue.target)
        || !isNonEmptyString(entryValue.result)
      )
    ) {
      issues.push(
        issue(
          "behavioral.tool-ledger",
          `${testCase.id}: toolLedger must contain typed target/result records`,
        ),
      );
    }
    for (const referencePath of expectedReferencesRead) {
      if (
        !result.toolLedger?.some((entryValue) =>
          isPlainObject(entryValue)
          && ["read", "command"].includes(entryValue.kind)
          && entryValue.target.includes(referencePath)
        )
      ) {
        issues.push(
          issue(
            "behavioral.reference-tool-ledger",
            `${testCase.id}: ${referencePath} must appear in a read/command ledger target`,
          ),
        );
      }
    }
    for (const artifactPath of expectedArtifactReads) {
      if (
        !result.toolLedger?.some((entryValue) =>
          isPlainObject(entryValue)
          && entryValue.target === artifactPath
          && ["read", "render"].includes(entryValue.kind)
        )
      ) {
        issues.push(
          issue(
            "behavioral.artifact-tool-ledger",
            `${testCase.id}: supplied artifact ${artifactPath} must have a read/render ledger entry`,
          ),
        );
      }
      if (
        !result.evidence?.some((record) =>
          isPlainObject(record)
          && record.artifact === artifactPath
          && record.kind === expectedArtifactEvidenceKind
        )
      ) {
        issues.push(
          issue(
            "behavioral.artifact-evidence",
            `${testCase.id}: supplied artifact ${artifactPath} requires ${expectedArtifactEvidenceKind ?? "typed"} evidence`,
          ),
        );
      }
    }

    const evidenceIssues = validateEvidenceRecords(
      result.evidence,
      result.claims,
      { sourceOnly: expectedOutcome === "source-audit-with-limitations" },
    );
    for (const evidenceIssue of evidenceIssues) {
      issues.push({
        ...evidenceIssue,
        message: `${testCase.id}: ${evidenceIssue.message}`,
      });
    }

    const gateResults = Array.isArray(result.gateResults)
      ? result.gateResults
      : [];
    const gateIds = gateResults.map((gate) => gate?.id);
    if (
      gateResults.length !== testCase.gates.length
      || new Set(gateIds).size !== testCase.gates.length
      || !equalArrays(gateIds, testCase.gates)
    ) {
      issues.push(
        issue(
          "behavioral.case-gates",
          `${testCase.id}: gateResults must cover every declared gate exactly once`,
        ),
      );
    }
    for (const gate of gateResults) {
      if (
        gate?.pass !== true
        || !isStringArray(gate.evidence)
        || gate.evidence.length === 0
      ) {
        issues.push(
          issue(
            "behavioral.case-gate-failed",
            `${testCase.id}/${gate?.id ?? "unknown"} must pass with concrete evidence`,
          ),
        );
      }
    }
    if (result.verdict !== "PASS") {
      issues.push(
        issue(
          "behavioral.case-verdict",
          `${testCase.id}: verdict must be PASS, received ${result.verdict}`,
        ),
      );
    }
  }

  if (
    agentIds.length !== caseIds.length
    || !agentIds.every(isNonEmptyString)
    || new Set(agentIds).size !== caseIds.length
  ) {
    issues.push(
      issue(
        "behavioral.fresh-agents",
        `expected ${caseIds.length} unique fresh agent IDs`,
      ),
    );
  }

  const rubricResult = manifest.rubric;
  const rubricGates = Array.isArray(rubricResult?.gateResults)
    ? rubricResult.gateResults
    : [];
  const declaredRubricIds = rubric.gates.map((gate) => gate.id);
  const resultRubricIds = rubricGates.map((gate) => gate?.id);
  if (
    rubricGates.length !== rubric.gates.length
    || new Set(resultRubricIds).size !== rubric.gates.length
    || !equalArrays(resultRubricIds, declaredRubricIds)
  ) {
    issues.push(
      issue(
        "behavioral.rubric-gates",
        "manifest rubric must score every declared gate exactly once",
      ),
    );
  }

  let computedScore = 0;
  for (const declared of rubric.gates) {
    const scored = rubricGates.find((gate) => gate?.id === declared.id);
    if (!scored) {
      continue;
    }
    const expectedPoints = declared.blocking
      ? 0
      : (scored.pass === true ? declared.points : 0);
    const validPass = declared.blocking
      ? scored.pass === true
      : typeof scored.pass === "boolean";
    if (
      scored.blocking !== declared.blocking
      || !validPass
      || scored.pointsEarned !== expectedPoints
      || !isStringArray(scored.evidence)
      || scored.evidence.length === 0
    ) {
      issues.push(
        issue(
          "behavioral.rubric-gate-failed",
          `${declared.id}: mismatch, failure, score error, or missing evidence`,
        ),
      );
    }
    if (!declared.blocking) {
      computedScore += expectedPoints;
    }
  }

  const declaredMaximum = rubric.gates
    .filter((gate) => !gate.blocking)
    .reduce((total, gate) => total + gate.points, 0);
  if (
    rubricResult?.nonBlockingScore !== computedScore
    || rubricResult?.maximumNonBlockingScore !== declaredMaximum
    || declaredMaximum !== rubric.passing.maximum_non_blocking_score
    || computedScore < rubric.passing.minimum_non_blocking_score
  ) {
    issues.push(
      issue(
        "behavioral.rubric-score",
        `score=${computedScore}/${declaredMaximum}, minimum=${rubric.passing.minimum_non_blocking_score}`,
      ),
    );
  }
  if (manifest.verdict !== "PASS" || rubricResult?.verdict !== "PASS") {
    issues.push(
      issue(
        "behavioral.final-verdict",
        "manifest and rubric verdicts must both be PASS",
      ),
    );
  }

  return issues;
}

function validateBehavioralReport(cases, rubric) {
  const issues = [];
  const reportPath = "evals/deslop-ui/behavioral-report.json";
  const snapshotDigest = behavioralSnapshotDigest(behavioralSnapshotFiles());

  if (!existsSync(resolve(root, reportPath))) {
    return [
      issue(
        "behavioral.report-missing",
        `missing ${reportPath}; expected snapshot ${snapshotDigest}`,
      ),
    ];
  }

  const report = readJson(reportPath);
  const expectedKeys = [
    "blockingRubricGateCount",
    "blockingRubricGatesPassed",
    "caseCount",
    "caseGateCount",
    "caseGatesPassed",
    "maximumNonBlockingScore",
    "nonBlockingScore",
    "rubricGateCount",
    "rubricGatesPassed",
    "schemaVersion",
    "snapshotDigest",
    "uniqueFreshAgents",
    "verdict",
  ];
  const caseGateCount = cases.reduce(
    (total, testCase) => total + testCase.gates.length,
    0,
  );
  const blockingRubricGateCount = rubric.gates.filter(
    (gate) => gate.blocking,
  ).length;
  const maximumNonBlockingScore = rubric.gates
    .filter((gate) => !gate.blocking)
    .reduce((total, gate) => total + gate.points, 0);

  if (!equalArrays(Object.keys(report), expectedKeys)) {
    issues.push(
      issue(
        "behavioral.report-schema",
        "public report keys must match the privacy-safe aggregate schema",
      ),
    );
  }
  if (report.schemaVersion !== 1 || report.snapshotDigest !== snapshotDigest) {
    issues.push(
      issue(
        "behavioral.report-snapshot",
        `report=${report.snapshotDigest ?? "missing"} current=${snapshotDigest}`,
      ),
    );
  }
  if (
    report.caseCount !== cases.length
    || report.uniqueFreshAgents !== cases.length
    || report.caseGateCount !== caseGateCount
    || report.caseGatesPassed !== caseGateCount
  ) {
    issues.push(
      issue(
        "behavioral.report-cases",
        `expected ${cases.length} cases, ${cases.length} fresh agents, and ${caseGateCount}/${caseGateCount} case gates`,
      ),
    );
  }
  if (
    report.rubricGateCount !== rubric.gates.length
    || report.rubricGatesPassed !== rubric.gates.length
    || report.blockingRubricGateCount !== blockingRubricGateCount
    || report.blockingRubricGatesPassed !== blockingRubricGateCount
    || report.nonBlockingScore !== maximumNonBlockingScore
    || report.maximumNonBlockingScore !== maximumNonBlockingScore
    || report.nonBlockingScore < rubric.passing.minimum_non_blocking_score
  ) {
    issues.push(
      issue(
        "behavioral.report-rubric",
        `expected ${rubric.gates.length}/${rubric.gates.length} rubric gates and score ${maximumNonBlockingScore}/${maximumNonBlockingScore}`,
      ),
    );
  }
  if (report.verdict !== "PASS") {
    issues.push(
      issue(
        "behavioral.report-verdict",
        `expected PASS, received ${report.verdict ?? "missing"}`,
      ),
    );
  }

  return issues;
}

const skillPath = resolve(skillDir, "SKILL.md");
check("schema.skill-exists", existsSync(skillPath), "deslop-ui/SKILL.md exists");

const skill = read("deslop-ui/SKILL.md");
const frontmatter = parseFrontmatter(skill);
check("schema.frontmatter-parse", !frontmatter.error, frontmatter.error ?? "frontmatter parsed");
check(
  "schema.frontmatter-keys",
  equalArrays(frontmatter.keys, ["name", "description"]),
  `keys: ${frontmatter.keys.join(", ")}`,
);
check("schema.name", frontmatter.values.name === "deslop-ui", `name: ${frontmatter.values.name}`);
check(
  "schema.description",
  typeof frontmatter.values.description === "string"
    && frontmatter.values.description.length >= 120,
  "description is a substantive scalar string",
);
check(
  "schema.no-scaffold",
  !/\bTODO\b|Structuring This Skill|Replace with the first main section/i.test(skill),
  "no scaffold text",
);
check(
  "schema.trigger-language",
  containsAll(frontmatter.values.description ?? "", [
    "build",
    "redesign",
    "audit",
    "polish",
    "microcopy",
    "frontend",
    "brand strategy",
    "graphic design",
  ]),
  "description covers positive and negative routing",
);
check(
  "schema.line-budget",
  skill.split(/\r?\n/).length < 500,
  `${skill.split(/\r?\n/).length} SKILL.md lines`,
);

const agentYaml = read("deslop-ui/agents/openai.yaml");
check(
  "schema.agent-metadata",
  containsAll(agentYaml, [
    "display_name:",
    "short_description:",
    "default_prompt:",
    "$deslop-ui",
  ]) && !/\bTODO\b/.test(agentYaml),
  "agents/openai.yaml is complete",
);

const requiredReferences = [
  "references/01-direction.md",
  "references/02-composition.md",
  "references/03-web-ui.md",
  "references/04-mini-app.md",
  "references/05-states-and-responsive.md",
  "references/06-critique.md",
  "references/07-design-memory.md",
  "references/08-reference-study.md",
];

for (const reference of requiredReferences) {
  check(
    `references.exists.${reference}`,
    existsSync(resolve(skillDir, reference)),
    `${reference} exists`,
  );
  check(
    `references.linked.${reference}`,
    skill.includes(reference),
    `${reference} is directly routed from SKILL.md`,
  );

  const text = read(`deslop-ui/${reference}`);
  const lineCount = text.split(/\r?\n/).length;
  check(
    `references.contents.${reference}`,
    lineCount <= 100 || text.includes("## Contents"),
    `${reference}: ${lineCount} lines${text.includes("## Contents") ? ", has Contents" : ""}`,
  );
}

check(
  "references.routing-core",
  containsAll(skill, [
    "For `build` and `redesign`",
    "For `polish`",
    "Web UI: `references/03-web-ui.md`",
    "Mini App: `references/04-mini-app.md`",
    "an `audit` explicitly covers interaction states",
    "screenshot, URL, competitor",
    "project has `DESIGN.md`",
  ]),
  "conditional reference routes are explicit",
);

const requiredRepoPaths = [
  "AGENTS.md",
  "sasha/SKILL.md",
  "design-system/README.md",
  "design-system/bin/design-system.mjs",
  "web-ui/AGENTS.md",
  "web-ui/agent/COMPONENTS.md",
  "web-ui/agent/components.json",
  "web-ui/src/storybook/catalog.ts",
  "web-ui/src/components/ui",
  "web-ui/src/components/blocks",
  "web-ui/src/components/charts",
  "web-ui/src/index.css",
  "web-ui/src/lib/icons.tsx",
  "mini-app/AGENTS.md",
  "mini-app/agent/COMPONENTS.md",
  "mini-app/agent/components.json",
  "mini-app/src/components",
];

for (const path of requiredRepoPaths) {
  check(`paths.${path}`, existsSync(resolve(root, path)), `${path} exists`);
}

const webCatalog = parseWebCatalog();
const webAgentCatalog = readJson("web-ui/agent/components.json");
const webExports = parseWebExports();
const webBlockExports = parseExportsFromDirectory("web-ui/src/components/blocks");
const webChartExports = parseExportsFromDirectory("web-ui/src/components/charts");
const allWebExports = new Set([
  ...webExports,
  ...webBlockExports,
  ...webChartExports,
]);
const generatedWebGateway = await generateWebGateway();

const miniAppCatalog = readJson("mini-app/agent/components.json");
const miniAppCatalogNames = new Set(miniAppCatalog.components.map((component) => component.name));
const miniAppExports = extractExportNames(read("mini-app/src/library.js"));
const generatedMiniAppGateway = await generateMiniAppGateway();
const generatedMiniAppExports = extractExportNames(generatedMiniAppGateway);
const liveNames = new Set([...allWebExports, ...miniAppCatalogNames, ...miniAppExports]);
const allowedIdentifiers = new Set([
  "AGENTS",
  "COMPONENTS",
  "CSS",
  "DESIGN",
  "DOM",
  "JSX",
  "MiniAppProvider",
  "Tailwind",
]);

const webReferenceIdentifiers = extractInlineIdentifiers(
  read("deslop-ui/references/03-web-ui.md"),
);
const unknownWebReferenceIdentifiers = [...webReferenceIdentifiers].filter((name) =>
  !allWebExports.has(name) && !allowedIdentifiers.has(name),
);
check(
  "components.live.references/03-web-ui.md",
  unknownWebReferenceIdentifiers.length === 0,
  unknownWebReferenceIdentifiers.length === 0
    ? `${webReferenceIdentifiers.size} Web identifiers resolve to Web exports`
    : `unknown Web identifiers: ${unknownWebReferenceIdentifiers.join(", ")}`,
);
check(
  "components.boundary.references/03-web-ui.md",
  containsAll(read("deslop-ui/references/03-web-ui.md"), [
    ".deslop/web-ui/COMPONENTS.md",
    ".deslop/web-ui/source",
    "src/components/web-ui",
    "npm run check:web-ui",
  ])
    && !/from\s+["']@deslop\/web-ui\/(?:components|blocks|charts)\//.test(
      read("deslop-ui/references/03-web-ui.md"),
    ),
  "Web consumer guidance uses the generated local gateway and read-only source copy",
);
check(
  "components.unified-installer-routing",
  containsAll(read("deslop-ui/references/03-web-ui.md"), [
    "@deslop/design-system setup --web",
    "@deslop/web-ui setup",
  ])
    && containsAll(read("deslop-ui/references/04-mini-app.md"), [
      "@deslop/design-system setup --mini-app",
      "@deslop/mini-app setup",
    ]),
  "both platform references route through the unified installer with direct-package fallback",
);

const miniAppReferenceIdentifiers = extractInlineIdentifiers(
  read("deslop-ui/references/04-mini-app.md"),
);
const unknownMiniAppReferenceIdentifiers = [...miniAppReferenceIdentifiers].filter((name) =>
  !miniAppExports.has(name) && !miniAppCatalogNames.has(name) && !allowedIdentifiers.has(name),
);
check(
  "components.live.references/04-mini-app.md",
  unknownMiniAppReferenceIdentifiers.length === 0,
  unknownMiniAppReferenceIdentifiers.length === 0
    ? `${miniAppReferenceIdentifiers.size} Mini App identifiers resolve to Mini App exports`
    : `unknown Mini App identifiers: ${unknownMiniAppReferenceIdentifiers.join(", ")}`,
);

const compositionText = read("deslop-ui/references/02-composition.md");
const compositionPlatforms = extractPlatformIdentifiers(compositionText);
const unknownCompositionWeb = [...compositionPlatforms.web].filter((name) =>
  !allWebExports.has(name) && !allowedIdentifiers.has(name),
);
const unknownCompositionMiniApp = [...compositionPlatforms["mini-app"]].filter((name) =>
  !miniAppExports.has(name) && !miniAppCatalogNames.has(name) && !allowedIdentifiers.has(name),
);
const platformIdentifiers = new Set([
  ...compositionPlatforms.web,
  ...compositionPlatforms["mini-app"],
]);
const genericCompositionIdentifiers = [...extractInlineIdentifiers(compositionText)]
  .filter((name) => !platformIdentifiers.has(name));
const unknownCompositionGeneric = genericCompositionIdentifiers.filter((name) =>
  !liveNames.has(name) && !allowedIdentifiers.has(name),
);
check(
  "components.live.references/02-composition.web",
  unknownCompositionWeb.length === 0,
  unknownCompositionWeb.length === 0
    ? `${compositionPlatforms.web.size} Web-prefixed identifiers resolve to Web`
    : `unknown Web-prefixed identifiers: ${unknownCompositionWeb.join(", ")}`,
);
check(
  "components.live.references/02-composition.mini-app",
  unknownCompositionMiniApp.length === 0,
  unknownCompositionMiniApp.length === 0
    ? `${compositionPlatforms["mini-app"].size} Mini App-prefixed identifiers resolve to Mini App`
    : `unknown Mini App-prefixed identifiers: ${unknownCompositionMiniApp.join(", ")}`,
);
check(
  "components.live.references/02-composition.generic",
  unknownCompositionGeneric.length === 0,
  unknownCompositionGeneric.length === 0
    ? `${genericCompositionIdentifiers.length} generic identifiers resolve`
    : `unknown generic identifiers: ${unknownCompositionGeneric.join(", ")}`,
);

check(
  "components.web-catalog-parity",
  webCatalog.slugs.length > 0
    && webCatalog.slugs.every((slug) =>
      existsSync(resolve(root, `web-ui/src/components/ui/${slug}.tsx`)),
    ),
  `${webCatalog.slugs.length} Web catalog entries have source files`,
);
check(
  "components.web-agent-catalog",
  Array.isArray(webAgentCatalog.modules)
    && webAgentCatalog.modules.length > 0
    && generatedWebGateway.moduleFiles.every(({ exists }) => exists),
  `${generatedWebGateway.moduleFiles.filter(({ exists }) => exists).length}/${webAgentCatalog.modules.length} Web agent modules generated`,
);
check(
  "components.web-generated-gateway",
  webAgentCatalog.modules.every(({ local }) =>
    generatedWebGateway.gateway.includes(`export * from "./${local}"`)
  ),
  `${webAgentCatalog.modules.length} Web modules are routed through the generated local gateway`,
);
check(
  "components.web-generated-catalog",
  JSON.stringify(generatedWebGateway.generatedCatalog)
    === JSON.stringify(webAgentCatalog),
  "generated Web consumer catalog matches the repository agent catalog",
);

const missingMiniAppExports = [...miniAppCatalogNames].filter((name) => !miniAppExports.has(name));
check(
  "components.mini-app-export-parity",
  missingMiniAppExports.length === 0,
  missingMiniAppExports.length === 0
    ? `${miniAppCatalogNames.size} Mini App catalog names are publicly exported`
    : `Mini App catalog names missing from library exports: ${missingMiniAppExports.join(", ")}`,
);

const expectedGatewayExports = new Set(["MiniAppProvider", ...miniAppCatalogNames]);
check(
  "components.mini-app-generated-gateway",
  equalArrays([...generatedMiniAppExports], [...expectedGatewayExports]),
  equalArrays([...generatedMiniAppExports], [...expectedGatewayExports])
    ? `${generatedMiniAppExports.size} generated gateway exports match the live catalog`
    : `generated=${sorted(generatedMiniAppExports).join(", ")} expected=${sorted(expectedGatewayExports).join(", ")}`,
);

const webPackageExports = readJson("web-ui/package.json").exports;
const expectedWebSubpaths = [
  "./styles.css",
  "./components/*",
  "./blocks/*",
  "./charts/*",
];
check(
  "components.web-public-subpaths",
  expectedWebSubpaths.every((subpath) => isNonEmptyString(webPackageExports?.[subpath])),
  `public Web subpaths: ${expectedWebSubpaths.join(", ")}`,
);

const capabilityProbes = computeCapabilityProbes(generatedMiniAppGateway);
for (const [probeId, available] of capabilityProbes) {
  check(
    `capability.live.${probeId}`,
    typeof available === "boolean",
    `${probeId}: ${available ? "available" : "missing"}`,
  );
}
check(
  "capability.button-comment-is-not-native",
  hasAccessibleButton("/** Prefer this over a raw <button>. */\nreturn <m.div />") === false,
  "button-like JSX inside comments does not satisfy the accessibility probe",
);
check(
  "capability.button-native-jsx",
  hasAccessibleButton("return <button type=\"button\" />") === true,
  "native button JSX satisfies the accessibility probe",
);
check(
  "capability.button-emulated-contract",
  hasAccessibleButton(
    "return <div role=\"button\" tabIndex={0} onKeyDown={handleKeyDown} />",
  ) === true,
  "an emulated button requires role, focusability, and keyboard activation",
);

const webReference = read("deslop-ui/references/03-web-ui.md");
const miniAppReference = read("deslop-ui/references/04-mini-app.md");
const webMentioned = new Set(
  webCatalog.primaryNames.filter((name) => webReference.includes(`\`${name}\``)),
);
const miniAppMentioned = new Set(
  [...miniAppCatalogNames].filter((name) => miniAppReference.includes(`\`${name}\``)),
);
const maxInventoryRatio = 0.7;

check(
  "inventory.web-not-copied",
  webMentioned.size / webCatalog.primaryNames.length <= maxInventoryRatio,
  `${webMentioned.size}/${webCatalog.primaryNames.length} canonical Web families repeated`,
);
check(
  "inventory.mini-app-not-copied",
  miniAppMentioned.size / miniAppCatalogNames.size <= maxInventoryRatio,
  `${miniAppMentioned.size}/${miniAppCatalogNames.size} Mini App components repeated`,
);
check(
  "inventory.no-fixed-counts",
  !/\b\d+\s+(?:Web UI\s+|Mini App\s+|UI\s+)?components?\b/i.test(
    [skill, ...requiredReferences.map((path) => read(`deslop-ui/${path}`))].join("\n"),
  ),
  "skill does not freeze inventory counts",
);

const direction = read("deslop-ui/references/01-direction.md");
const composition = read("deslop-ui/references/02-composition.md");
const states = read("deslop-ui/references/05-states-and-responsive.md");
const critique = read("deslop-ui/references/06-critique.md");
const memory = read("deslop-ui/references/07-design-memory.md");
const study = read("deslop-ui/references/08-reference-study.md");

check(
  "quality.direction",
  containsAll(direction, [
    "product grounding",
    "user_job:",
    "structural_fingerprint:",
    "signature:",
    "Spend boldness once",
    "fake activity",
  ]),
  "direction requires product grounding, one signature, and real evidence",
);
check(
  "quality.composition",
  containsAll(composition, [
    "Structural fingerprint",
    "information relationships",
    "Responsive transformation",
    "Do not describe responsiveness as",
    "Card",
  ]),
  "composition is relationship-led and responsive",
);
check(
  "quality.states",
  containsAll(states, [
    "focus",
    "loading",
    "partial",
    "empty",
    "validation error",
    "system error",
    "success",
    "offline/stale",
    "permission",
    "reduced motion",
    "out-of-order responses",
    "Deduplicate retries",
    "state × viewport × theme",
    "320",
    "1440",
  ]),
  "state and viewport matrix is complete",
);
check(
  "quality.critique",
  containsAll(critique, [
    "observed",
    "code-confirmed",
    "inferred",
    "Evidence:",
    "Impact:",
    "Fix:",
    "Hard gates",
    "Not verified",
    "actually rendered",
    "surface, state, viewport, theme",
    "accessibility-tree evidence",
    "NOT ASSESSED",
    "BLOCKED",
    "not visual or accessibility evidence",
  ]),
  "critique uses evidence and visual claim discipline",
);
check(
  "quality.visual-command-boundary",
  /checks (?:do not|don't|cannot) prove visual|do not prove\s+visual|not visual evidence/i.test(
    `${skill}\n${critique}`,
  ),
  "build/verify checks are explicitly not visual evidence",
);
check(
  "quality.memory",
  containsAll(memory, [
    "persistent product intent",
    "not transient experiments",
    "duplicated copies of the live component inventory",
    "Validate the document",
  ]),
  "design memory avoids transient and duplicated truth",
);
check(
  "quality.reference-study",
  containsAll(study, [
    "transferable decisions",
    "non-transferable material",
    "Deslop component",
    "Do not reproduce a reference pixel-for-pixel",
    "Missing capability",
  ]),
  "reference study extracts logic without cloning",
);

const casesDocument = readJson("evals/deslop-ui/cases.json");
const cases = Array.isArray(casesDocument.cases) ? casesDocument.cases : [];
check(
  "cases.document-schema",
  casesDocument.version === 1
    && casesDocument.skill === "deslop-ui"
    && Array.isArray(cases)
    && cases.length > 0,
  "cases.json has version, skill, and non-empty cases",
);
const ids = cases.map((testCase) => testCase.id);
const caseMap = new Map(cases.map((testCase) => [testCase.id, testCase]));
const blocks = new Set(cases.map((testCase) => testCase.block));
const modes = new Set(cases.map((testCase) => testCase.expect.mode).filter(Boolean));
const negatives = cases.filter((testCase) => testCase.expect.trigger === false);

check("cases.unique-ids", new Set(ids).size === ids.length, `${ids.length} unique case ids`);
const declaredCaseGateCount = cases.reduce(
  (total, testCase) => total + testCase.gates.length,
  0,
);
check(
  "cases.regression-counts",
  cases.length === 27 && declaredCaseGateCount === 104,
  `${cases.length}/27 cases and ${declaredCaseGateCount}/104 declared case gates`,
);
check(
  "cases.specialist-blocks",
  equalArrays([...blocks], [
    "trigger-scope",
    "art-composition",
    "component-integration",
    "visual-qa-adversarial",
  ]),
  `blocks: ${[...blocks].join(", ")}`,
);
check(
  "cases.mode-coverage",
  equalArrays([...modes], ["audit", "build", "polish", "redesign"]),
  `modes: ${[...modes].join(", ")}`,
);
check("cases.negative-coverage", negatives.length >= 4, `${negatives.length} negative triggers`);
check(
  "cases.required-adversarial",
  [
    "route-reference-redesign",
    "route-platform-ambiguous",
    "direction-unfamiliar-lab",
    "audit-no-artifact",
    "integration-mini-app-missing-capability",
    "qa-audit-no-render",
    "adversarial-clone-fabricate-bypass",
  ].every((id) => caseMap.has(id)),
  "adversarial and generalization cases are present",
);

for (const testCase of cases) {
  const validContext = isStringArray(testCase.context);
  const artifactContext = validContext
    ? testCase.context
      .filter((entry) => entry.startsWith("artifact:"))
      .map((entry) => entry.slice("artifact:".length))
    : [];
  const artifactKindContext = validContext
    ? testCase.context
      .filter((entry) => entry.startsWith("artifact-kind:"))
      .map((entry) => entry.slice("artifact-kind:".length))
    : [];
  const validGates = isStringArray(testCase.gates)
    && testCase.gates.length > 0
    && new Set(testCase.gates).size === testCase.gates.length;
  const validGateCriteria = testCase.gateCriteria === undefined
    || (
      isPlainObject(testCase.gateCriteria)
      && Object.keys(testCase.gateCriteria).length > 0
      && Object.entries(testCase.gateCriteria).every(([gateId, criterion]) =>
        testCase.gates.includes(gateId) && isNonEmptyString(criterion)
      )
    );
  const validExpectation = isPlainObject(testCase.expect)
    && typeof testCase.expect.trigger === "boolean"
    && ["audit", "build", "polish", "redesign", null].includes(testCase.expect.mode)
    && ["web", "mini-app", null].includes(testCase.expect.platform)
    && isNonEmptyString(testCase.expect.outcome)
    && Array.isArray(testCase.expect.references);
  check(
    `cases.schema.${testCase.id}`,
    isNonEmptyString(testCase.id)
      && isNonEmptyString(testCase.block)
      && isNonEmptyString(testCase.prompt)
      && validContext
      && validGates
      && validGateCriteria
      && validExpectation,
    `${testCase.id} has a complete typed case schema`,
  );
  check(
    `cases.artifacts.${testCase.id}`,
    (
      artifactContext.length === 0
      && artifactKindContext.length === 0
    )
      || (
        artifactContext.length === 1
        && artifactKindContext.length === 1
        && ["synthetic-render-fixture", "synthetic-reference"]
          .includes(artifactKindContext[0])
        && artifactContext.every((path) =>
          repoArtifactExists(path) && testCase.prompt.includes(path)
        )
      ),
    artifactContext.length === 0
      ? `${testCase.id} has no supplied artifact`
      : `${testCase.id} names one typed existing supplied artifact in context and prompt`,
  );

  const expectedReferences = testCase.expect.references;
  const referencesValid = expectedReferences.every((reference) =>
    requiredReferences.includes(reference),
  );
  check(`cases.references.${testCase.id}`, referencesValid, `${testCase.id} routes valid references`);
  check(
    `cases.nontrigger.${testCase.id}`,
    testCase.expect.trigger !== false
      || (
        testCase.expect.mode === null
        && testCase.expect.references.length === 0
      ),
    `${testCase.id} non-trigger does not load the skill`,
  );

  const capabilityDependent = testCase.expect.outcome === "capability-dependent";
  const probe = testCase.expect.capabilityProbe;
  check(
    `cases.capability.${testCase.id}`,
    capabilityDependent
      ? (
        isPlainObject(probe)
        && capabilityProbes.has(probe.id)
        && isNonEmptyString(probe.available)
        && isNonEmptyString(probe.missing)
        && isNonEmptyString(resolvedCaseOutcome(testCase, capabilityProbes))
      )
      : probe === undefined,
    capabilityDependent
      ? `${testCase.id} resolves ${probe?.id ?? "missing probe"} to ${resolvedCaseOutcome(testCase, capabilityProbes)}`
      : `${testCase.id} has no capability-dependent branch`,
  );
}

const notice = read("deslop-ui/NOTICE.md");
const provenance = [
  ["Anthropic frontend-design", "github.com/anthropics/skills", "Apache-2.0"],
  ["Impeccable", "github.com/pbakaus/impeccable", "Apache-2.0"],
  ["Hallmark", "github.com/Nutlope/hallmark", "MIT"],
  ["Google DESIGN.md", "github.com/google-labs-code/design.md", "Apache-2.0"],
  ["Vercel Web Interface Guidelines", "github.com/vercel-labs/agent-skills", "MIT"],
  ["UI Skills", "github.com/ibelick/ui-skills", "MIT"],
  ["UI UX Pro Max", "github.com/nextlevelbuilder/ui-ux-pro-max-skill", "MIT"],
];

for (const [project, source, license] of provenance) {
  check(
    `provenance.${project}`,
    containsAll(notice, [project, `https://${source}`, license]),
    `${project}: source and ${license}`,
  );
}
check(
  "provenance.no-bundled-assets",
  containsAll(notice, ["No third-party code", "screenshots", "fonts", "icons", "assets"]),
  "NOTICE bounds copied material",
);
check("provenance.no-todo", !/\bTODO\b/.test(notice), "NOTICE has no placeholders");

const goodRoutingIssues = validateRoutingFixture(
  "evals/deslop-ui/fixtures/good/routing.json",
  caseMap,
  (testCase) => resolvedCaseOutcome(testCase, capabilityProbes),
);
const badRoutingIssues = validateRoutingFixture(
  "evals/deslop-ui/fixtures/bad/routing.json",
  caseMap,
  (testCase) => resolvedCaseOutcome(testCase, capabilityProbes),
);
const goodAuditIssues = validateAuditFixture(
  "evals/deslop-ui/fixtures/good/audit.md",
  "evals/deslop-ui/fixtures/good/audit.evidence.json",
);
const badAuditIssues = validateAuditFixture(
  "evals/deslop-ui/fixtures/bad/audit.md",
  "evals/deslop-ui/fixtures/bad/audit.evidence.json",
);
const goodSourceAuditIssues = validateAuditFixture(
  "evals/deslop-ui/fixtures/good/source-only-audit.md",
  "evals/deslop-ui/fixtures/good/source-only-audit.evidence.json",
  { sourceOnly: true },
);
const badSourceAuditIssues = validateAuditFixture(
  "evals/deslop-ui/fixtures/bad/source-only-audit.md",
  "evals/deslop-ui/fixtures/bad/source-only-audit.evidence.json",
  { sourceOnly: true },
);
const expectedBadRoutingCodes = readJson(
  "evals/deslop-ui/fixtures/bad/routing.json",
).expectedErrorCodes;
const expectedBadAuditCodes = readJson(
  "evals/deslop-ui/fixtures/bad/audit.evidence.json",
).expectedErrorCodes;
const expectedBadSourceAuditCodes = readJson(
  "evals/deslop-ui/fixtures/bad/source-only-audit.evidence.json",
).expectedErrorCodes;
const uniqueIssueCodes = (issues) => sorted(new Set(issues.map(({ code }) => code)));

check(
  "fixtures.good-routing",
  goodRoutingIssues.length === 0,
  goodRoutingIssues.length === 0
    ? "good routing fixture passes"
    : formatIssues(goodRoutingIssues),
);
check(
  "fixtures.bad-routing",
  equalArrays(uniqueIssueCodes(badRoutingIssues), expectedBadRoutingCodes),
  `actual=${uniqueIssueCodes(badRoutingIssues).join(", ")} expected=${expectedBadRoutingCodes.join(", ")}`,
);
check(
  "fixtures.good-audit",
  goodAuditIssues.length === 0,
  goodAuditIssues.length === 0
    ? "good audit fixture passes"
    : formatIssues(goodAuditIssues),
);
check(
  "fixtures.bad-audit",
  equalArrays(uniqueIssueCodes(badAuditIssues), expectedBadAuditCodes),
  `actual=${uniqueIssueCodes(badAuditIssues).join(", ")} expected=${expectedBadAuditCodes.join(", ")}`,
);
check(
  "fixtures.good-source-only-audit",
  goodSourceAuditIssues.length === 0,
  goodSourceAuditIssues.length === 0
    ? "good source-only audit fixture passes"
    : formatIssues(goodSourceAuditIssues),
);
check(
  "fixtures.bad-source-only-audit",
  equalArrays(uniqueIssueCodes(badSourceAuditIssues), expectedBadSourceAuditCodes),
  `actual=${uniqueIssueCodes(badSourceAuditIssues).join(", ")} expected=${expectedBadSourceAuditCodes.join(", ")}`,
);

const rubric = readJson("evals/deslop-ui/rubric.json");
const rubricIds = rubric.gates.map((gate) => gate.id);
check(
  "rubric.unique-gates",
  new Set(rubricIds).size === rubricIds.length,
  `${rubricIds.length} unique rubric gates`,
);
check(
  "rubric.blocking-coverage",
  [
    "schema",
    "reference-routing",
    "live-paths",
    "live-components",
    "no-inventory-copy",
    "trigger-coverage",
    "audit-integrity",
    "visual-qa-integrity",
    "artifact-evidence",
    "behavioral-execution",
  ].every((id) => rubric.gates.some((gate) => gate.id === id && gate.blocking)),
  "required blocking gates are declared",
);

const rubricNonBlockingMaximum = rubric.gates
  .filter((gate) => !gate.blocking)
  .reduce((total, gate) => total + (Number.isFinite(gate.points) ? gate.points : 0), 0);
check(
  "rubric.schema",
  rubric.version === 1
    && isPlainObject(rubric.passing)
    && rubric.passing.blocking_gates_must_pass === true
    && Number.isFinite(rubric.passing.minimum_non_blocking_score)
    && Number.isFinite(rubric.passing.maximum_non_blocking_score)
    && rubric.gates.every((gate) =>
      isNonEmptyString(gate.id)
      && typeof gate.blocking === "boolean"
      && isNonEmptyString(gate.evidence)
      && isNonEmptyString(gate.criterion)
      && (gate.blocking || Number.isFinite(gate.points))
    ),
  "rubric has typed passing semantics and gate criteria",
);
check(
  "rubric.score-range",
  rubricNonBlockingMaximum === rubric.passing.maximum_non_blocking_score
    && rubric.passing.minimum_non_blocking_score <= rubricNonBlockingMaximum,
  `rubric threshold ${rubric.passing.minimum_non_blocking_score}/${rubricNonBlockingMaximum}`,
);

const validateRawRuns = process.argv.includes("--raw-runs");
const behavioralIssues = [
  ...validateBehavioralReport(cases, rubric),
  ...(validateRawRuns
    ? validateBehavioralRuns(cases, rubric, capabilityProbes)
    : []),
];
check(
  "behavioral.all-cases",
  behavioralIssues.length === 0,
  behavioralIssues.length === 0
    ? validateRawRuns
      ? "27/27 fresh-agent raw runs, 104/104 case gates, 17/17 rubric gates, 10/10 blocking gates, score 28/28, PASS"
      : "public-safe report: 27/27 cases, 104/104 case gates, 17/17 rubric gates, 10/10 blocking gates, score 28/28, PASS"
    : formatIssues(behavioralIssues),
);

console.log(`Deslop UI evals: ${passes.length} passed, ${failures.length} failed`);
for (const result of failures) {
  console.error(`✗ ${result.id}: ${result.detail}`);
}

if (failures.length > 0) {
  process.exit(1);
}

console.log(
  validateRawRuns
    ? "✓ Schema, routing, live catalogs, raw behavioral runs, public report, rubric, provenance, and fixtures passed"
    : "✓ Schema, routing, live catalogs, public-safe behavioral report, rubric, provenance, and fixtures passed",
);
