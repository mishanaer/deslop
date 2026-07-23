# Deslop UI evals

This suite tests the skill at four levels:

1. static schema, routing language, live repository paths, and reference quality;
2. platform-specific Web and Mini App exports plus generated copied-kit gateways;
3. positive and exact negative fixtures for visual evidence and source-only audits;
4. one isolated behavioral run for every prompt in `cases.json`.

Run from the repository root:

```sh
npm run verify:deslop-ui
```

The default command validates the public-safe behavioral report together with
the static, integration, evidence, and negative-fixture gates. The report is
snapshot-bound: a changed skill, reference, case, rubric, or prompt-supplied
artifact invalidates it until all behavioral cases are rerun.

Raw behavioral runs stay local because they contain agent IDs, timestamps,
filesystem paths, tool ledgers, and complete model output. They are ignored by
Git and must not be committed to a public repository. To validate a local raw
run as well as the public report:

```sh
npm run verify:deslop-ui:raw
```

`behavioral-report.json` contains only aggregate counts, the snapshot digest,
scores, and verdict. It deliberately excludes identities, paths, timestamps,
prompts, responses, and tool output.

## Behavioral run contract

Create the ignored local file `runs/final/manifest.json` and one
`<case-id>.json` file per case. Every case must use a distinct fresh agent and
must not mutate repository files.
Cases may declare one `artifact:<repo-relative-path>` plus an
`artifact-kind:` entry in their context. Supplied artifacts are part of the
snapshot digest: the agent must actually inspect each one, list it in
`filesRead`, retain the read/render in `toolLedger`, and attach matching
structured evidence. Merely mentioning an unseen screenshot does not pass.
Case agents must not read this README, `cases.json`, `rubric.json`, the runner,
or prior run files. The only permitted path under `evals/deslop-ui/` is the
artifact explicitly supplied in that case's context.

Each result has this shape:

```json
{
  "schemaVersion": 1,
  "caseId": "case-id",
  "snapshotDigest": "sha256:...",
  "agentId": "unique-agent-id",
  "startedAt": "ISO-8601 timestamp",
  "completedAt": "ISO-8601 timestamp",
  "prompt": "exact cases.json prompt",
  "context": ["exact", "case", "context"],
  "gateCriteria": {},
  "rawOutput": "complete unedited response",
  "actual": {
    "trigger": true,
    "mode": "build",
    "platform": "web",
    "outcome": "proceed",
    "references": ["references/01-direction.md"],
    "readOnly": false
  },
  "referencesRead": [
    "deslop-ui/SKILL.md",
    "deslop-ui/references/01-direction.md"
  ],
  "filesRead": ["deslop-ui/SKILL.md"],
  "filesChanged": [],
  "toolLedger": [
    {
      "kind": "read",
      "target": "deslop-ui/SKILL.md",
      "result": "read successfully"
    }
  ],
  "claims": [],
  "evidence": [],
  "gateResults": [
    {
      "id": "exact-case-gate",
      "pass": true,
      "evidence": ["specific behavior in the raw response"]
    }
  ],
  "verdict": "PASS"
}
```

The local `manifest.json` retains the snapshot file list and digest, run timing,
execution order, case-file/agent mapping, every rubric gate result, the
calculated non-blocking score, and final verdict. The raw verifier requires:

- every case ID and result file exactly once;
- a unique agent ID for every case;
- exact prompt, context, routing, live capability outcome, and reference route;
- every per-case gate to pass with evidence;
- every blocking rubric gate to pass;
- at least the non-blocking score declared in `rubric.json`.

After a successful raw verification, update `behavioral-report.json` with only
the aggregate values accepted by its strict schema. Never copy raw manifest or
case fields into the public report.

Capability-dependent cases may declare `gateCriteria` for a gate whose name
could otherwise confuse component availability with skill quality. The gate
passes when the skill either uses a live verified accessible capability or
correctly blocks unsafe delivery when the live probe says it is missing.

## Evidence model

Evidence is structured, not a prose escape hatch. Every record needs `id`,
`kind`, `surface`, `state`, `viewport`, `theme`, and a repository-relative
`artifact` that actually exists.

- `claims` is a controlled vocabulary: `rendered`, `responsive-verified`,
  `dark-theme-verified`, `a11y-verified`, `keyboard-tested`, and
  `code-confirmed`. `pixel-perfect-clone` exists only as an explicit rejected
  marker. Claims must be unique. Put ordinary reasoning in `rawOutput`; an
  invented claim label fails.
- Evidence `kind` is limited to `render`, `input-reference`, `source`, `dom`,
  `accessibility-tree`, and `keyboard`.
- `rendered` requires a render.
- `responsive-verified` requires matching renders at distinct viewports.
- `dark-theme-verified` requires matching light and dark renders.
- `a11y-verified` requires both DOM/accessibility-tree and keyboard evidence.
- `code-confirmed` requires source evidence.
- source-only audits cannot issue visual scores or visual verdicts.

Files under `fixtures/artifacts/` are synthetic validator fixtures. They prove
that the evidence rules accept and reject the right structures; they are not
evidence that a product interface was visually tested.

The two prompt-supplied SVGs are intentionally stronger fixtures:

- `dashboard-1440-light.svg` is a deterministic synthetic rendering of the
  current dashboard hierarchy. It can support observations about that artifact,
  never claims about a live browser or runtime behavior.
- `reference-input.svg` is an original OSS-safe study input with no third-party
  assets. It can support transferable-DNA analysis, never pixel cloning.
