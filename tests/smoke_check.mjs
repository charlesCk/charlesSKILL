#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");

const requiredFiles = [
  "README.md",
  "SECURITY.md",
  "CHANGELOG.md",
  "docs/QUALITY_REVIEW.md",
  "docs/OUTPUT_FIELD_TEMPLATE.md",
  "facebook/SKILL.md",
  "facebook/targets.example.json",
  "facebook/scripts/opencli_facebook_expand_comments.mjs",
  "小红书/SKILL.md",
  "小红书/config.example.json",
  "小红书/scripts/opencli_xiaohongshu_collect_comments.mjs",
  "appstore/SKILL.md",
  "appstore/config.example.json",
  "appstore/scripts/appstore_reviews_workbook.mjs",
  "examples/sample-opinion-summary.json",
  "projects/codex-work-progress/README.md",
  "projects/codex-work-progress/docs/progress-log.md",
  "projects/codex-work-progress/docs/reusable-assets.md",
  "projects/codex-work-progress/docs/reviewer-notes.md"
];

function fail(message) {
  console.error(`smoke_check failed: ${message}`);
  process.exitCode = 1;
}

function readJson(relativePath) {
  const fullPath = path.join(root, relativePath);
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (error) {
    fail(`${relativePath} is not valid JSON: ${error.message}`);
    return null;
  }
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) fail(`missing required file: ${file}`);
}

const facebookTargets = readJson("facebook/targets.example.json");
if (!Array.isArray(facebookTargets) || facebookTargets.length === 0) {
  fail("facebook/targets.example.json must be a non-empty array");
}

const xhsConfig = readJson("小红书/config.example.json");
if (!Array.isArray(xhsConfig?.queries) || xhsConfig.queries.length === 0) {
  fail("小红书/config.example.json must include non-empty queries");
}

const appstoreConfig = readJson("appstore/config.example.json");
if (!Array.isArray(appstoreConfig?.apps) || appstoreConfig.apps.length === 0) {
  fail("appstore/config.example.json must include non-empty apps");
}
if (!Array.isArray(appstoreConfig?.countries) || appstoreConfig.countries.length === 0) {
  fail("appstore/config.example.json must include non-empty countries");
}

const sample = readJson("examples/sample-opinion-summary.json");
for (const section of ["source_records", "comment_details", "summary", "limitations"]) {
  if (!sample || !(section in sample)) fail(`sample-opinion-summary.json missing ${section}`);
}

const scripts = [
  "facebook/scripts/opencli_facebook_expand_comments.mjs",
  "小红书/scripts/opencli_xiaohongshu_collect_comments.mjs",
  "appstore/scripts/appstore_reviews_workbook.mjs",
  "tests/smoke_check.mjs"
];

for (const script of scripts) {
  const result = spawnSync(process.execPath, ["--check", path.join(root, script)], {
    encoding: "utf8"
  });
  if (result.status !== 0) {
    fail(`${script} failed syntax check: ${result.stderr || result.stdout}`);
  }
}

if (!process.exitCode) {
  console.log("smoke_check passed");
}
