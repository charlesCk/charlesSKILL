#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const FIELD_LABELS = {
  expectedAmount: ["合同预计总金额"],
  baseAmount: ["本币合同预计总金额"],
  exchangeRate: ["汇率"],
  financeAmount: ["合同金额（含税）", "合同金额"],
  financeAmountUpper: ["大写"],
  handler: ["经办人"],
  currency: ["币种"],
  contractName: ["合同名称"],
  cooperationContent: ["主要合作内容"],
  settlementStandard: ["结算标准"],
  paymentPlan: ["付款计划"]
};

function die(message) {
  console.error(JSON.stringify({ ok: false, error: message }, null, 2));
  process.exit(1);
}

function readJson(file) {
  if (!file) die("Usage: node create_seeyon_contract_draft.mjs /private/config.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function assertPrivateConfig(configPath) {
  const repoRoot = path.resolve(import.meta.dirname, "../../..");
  const full = path.resolve(configPath);
  if (full.startsWith(repoRoot + path.sep)) {
    die("Put the runtime config outside the repository so credentials are never committed.");
  }
}

function readDocxText(file) {
  if (!file || !fs.existsSync(file)) return "";
  const xml = execFileSync("unzip", ["-p", file, "word/document.xml"], { encoding: "utf8" });
  return xml
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function firstMatch(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return "";
}

function inferValues(config) {
  const values = { ...(config.values || {}) };
  const contractText = readDocxText(config.contractDocx);
  const instructionText = readDocxText(config.instructionDocx);
  const allText = `${contractText}\n${instructionText}`;

  values.contractName ||= firstMatch(contractText, [/^(.{4,80}(?:协议|合同|附件).*)$/m]) ||
    path.basename(config.contractDocx || "", path.extname(config.contractDocx || ""));
  values.expectedAmount ||= firstMatch(allText, [/(?:合同预计总金额|合同金额|金额)[：:\s]*([0-9,]+(?:\.\d{1,2})?)/]);
  values.startDate ||= firstMatch(allText, [/(?:起始日|开始日期|有效期自)[：:\s]*(\d{4}[-/.]\d{1,2}[-/.]\d{1,2})/]);
  values.endDate ||= firstMatch(allText, [/(?:终止日|结束日期|至)[：:\s]*(\d{4}[-/.]\d{1,2}[-/.]\d{1,2})/]);
  values.settlementStandard ||= firstMatch(allText, [/(结算标准[：:\s]*[\s\S]{10,260})/]);
  values.exchangeRate ||= values.currency === "人民币" || values.currency === "CNY" ? "1" : "";

  return {
    values,
    sourceTextStats: {
      contractChars: contractText.length,
      instructionChars: instructionText.length
    }
  };
}

function requiredMissing(values) {
  const required = [
    "oppositeEntity",
    "ownEntity",
    "contractName",
    "category1",
    "category2",
    "category3",
    "startDate",
    "endDate",
    "expectedAmount",
    "currency",
    "exchangeRate",
    "cooperationContent",
    "settlementStandard",
    "paymentPlan",
    "invoiceType",
    "invoiceTiming",
    "taxRate"
  ];
  return required.filter((key) => !String(values[key] || "").trim());
}

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    die("Playwright is required. Install it in the runtime environment before using this script.");
  }
}

async function fillByLabel(frame, labels, value) {
  if (!value) return false;
  return frame.evaluate(({ labels, value }) => {
    function normalize(text) {
      return String(text || "").replace(/\s+/g, "");
    }
    const wanted = labels.map(normalize);
    const roots = Array.from(document.querySelectorAll("[id$='_id'], td, div"));
    const root = roots.find((node) => wanted.some((label) => normalize(node.innerText).includes(label)));
    if (!root) return false;
    const input = root.querySelector("input:not([type=hidden]), textarea");
    if (input) {
      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }
    const browse = root.querySelector(".cap4-number__browse, .cap4-text__browse, span");
    if (browse) {
      browse.textContent = value;
      return true;
    }
    return false;
  }, { labels, value: String(value) });
}

async function patchCap4Model(frame, values) {
  return frame.evaluate((values) => {
    const vm = Array.from(document.querySelectorAll("*"))
      .map((el) => el.__vue__)
      .find((vue) => vue?.drawInitData?.currentFormData?.formmains);
    if (!vm) return { ok: false, reason: "CAP4 Vue model not found" };
    const formmains = vm.drawInitData.currentFormData.formmains;
    const main = Object.values(formmains)[0];
    if (!main) return { ok: false, reason: "formmain not found" };

    function findField(displayTexts) {
      return Object.entries(main).find(([, field]) => displayTexts.includes(field?.display))?.[0];
    }
    function setField(id, value, showValue = value, showValue2 = showValue) {
      if (!id || !main[id]) return false;
      main[id].value = String(value);
      main[id].showValue = String(showValue);
      main[id].showValue2 = String(showValue2);
      main[id].relationData ||= {};
      main[id].triggerData ||= {};
      return true;
    }

    const applicantId = findField(["申请人"]);
    const handlerId = findField(["经办人"]);
    const applicant = applicantId ? main[applicantId] : null;
    const expected = values.expectedAmount;
    const amountUpper = values.financeAmountUpper || "";

    const patched = {
      expected: setField(findField(["合同预计总金额"]), expected),
      baseAmount: setField(findField(["本币合同预计总金额"]), expected),
      exchangeRate: setField(findField(["汇率"]), values.exchangeRate || "1"),
      financeAmount: setField(findField(["合同金额", "合同金额（含税）"]), expected),
      upper: amountUpper ? setField(findField(["大写"]), amountUpper) : false,
      handler: values.handler === "self" && applicant && handlerId
        ? setField(handlerId, applicant.value, applicant.showValue, applicant.showValue2)
        : false
    };
    vm.$forceUpdate?.();
    return { ok: true, patched };
  }, values);
}

async function run(config, configPath) {
  assertPrivateConfig(configPath);
  const { values, sourceTextStats } = inferValues(config);
  const missing = requiredMissing(values);
  if (missing.length) {
    return { ok: false, stage: "preflight", missing, sourceTextStats };
  }
  if (config.dryRun) {
    return { ok: true, stage: "dryRun", values, sourceTextStats };
  }

  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({
    headless: config.headless !== false,
    executablePath: config.chromeExecutablePath
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const result = { ok: false, stage: "start", values, sourceTextStats };

  try {
    await page.goto(`${config.baseUrl.replace(/\/$/, "")}/index.jsp`, { waitUntil: "domcontentloaded" });
    await page.fill("#login_username, input[name='login_username'], input[name='username']", config.username);
    await page.fill("#login_password, input[name='login_password'], input[name='password']", config.password);
    await Promise.allSettled([
      page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15000 }),
      page.click("#login_button, button:has-text('登录'), input[type='submit']")
    ]);
    result.stage = "loggedIn";

    if (config.draftUrl) {
      await page.goto(config.draftUrl, { waitUntil: "domcontentloaded" });
    } else {
      await page.getByText("合同模块", { exact: false }).click({ timeout: 15000 });
      await page.getByText("新", { exact: true }).click({ timeout: 15000 });
      await page.getByText("合同", { exact: true }).click({ timeout: 15000 });
      await page.getByText("合同申请", { exact: false }).click({ timeout: 15000 });
    }
    await page.waitForTimeout(5000);
    const frame = page.frames().find((item) => item.name() === "zwIframe") || page.mainFrame();
    result.stage = "formOpened";

    await fillByLabel(frame, FIELD_LABELS.contractName, values.contractName);
    await fillByLabel(frame, FIELD_LABELS.expectedAmount, values.expectedAmount);
    await fillByLabel(frame, FIELD_LABELS.baseAmount, values.expectedAmount);
    await fillByLabel(frame, FIELD_LABELS.exchangeRate, values.exchangeRate || "1");
    await fillByLabel(frame, FIELD_LABELS.financeAmount, values.expectedAmount);
    await fillByLabel(frame, FIELD_LABELS.currency, values.currency);
    await fillByLabel(frame, FIELD_LABELS.cooperationContent, values.cooperationContent);
    await fillByLabel(frame, FIELD_LABELS.settlementStandard, values.settlementStandard);
    await fillByLabel(frame, FIELD_LABELS.paymentPlan, values.paymentPlan);
    result.cap4Patch = await patchCap4Model(frame, values);

    if (config.contractDocx) {
      const fileInputs = await frame.locator("input[type=file]").all();
      if (fileInputs.length) await fileInputs[0].setInputFiles(config.contractDocx);
    }

    await page.locator("#saveDraft_a, a:has-text('保存待发'), a:has-text('保存'), button:has-text('保存')").first().click({ timeout: 15000 });
    await page.waitForTimeout(5000);
    result.stage = "savedDraft";
    result.draftUrl = page.url();
    result.ok = true;
    return result;
  } finally {
    await fs.promises.mkdir(config.outputDir || path.join(os.tmpdir(), "seeyon-contract-draft"), { recursive: true }).catch(() => {});
    await browser.close().catch(() => {});
  }
}

const configPath = process.argv[2];
const config = readJson(configPath);
run(config, configPath)
  .then((result) => console.log(JSON.stringify(result, null, 2)))
  .catch((error) => die(error.stack || error.message));
