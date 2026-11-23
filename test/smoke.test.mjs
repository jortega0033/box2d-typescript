// One smoke test per module: it imports, and the entry points answer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const cli = (...args) => spawnSync(process.execPath, ["dist/cli/main.js", ...args], { encoding: "utf8" });

for (const m of ["trace", "engine", "compare"]) {
  test(`${m} imports`, async () => {
    assert.equal((await import(`../dist/${m}/index.js`)).MODULE, m);
  });
}

test("web imports", async () => {
  assert.equal((await import("../dist/web/main.js")).MODULE, "web");
});

test("cli --help prints usage, --version prints the version", () => {
  assert.match(cli("--help").stdout, /Usage:[\s\S]*run <scene\.json>/);
  assert.equal(cli("--version").stdout.trim(), "0.0.0");
});

test("cli run and compare exit non-zero until built", () => {
  for (const [c, n] of [["run", "#11"], ["compare", "#7"]]) {
    const r = cli(c);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, new RegExp(`not implemented yet: see ${n}`));
  }
});

test("server entry point exits non-zero until built", () => {
  const r = spawnSync(process.execPath, ["dist/server/main.js"], { encoding: "utf8" });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /not implemented yet: see #12/);
});
