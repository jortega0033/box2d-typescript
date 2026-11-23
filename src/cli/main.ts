// src/cli: headless runner and compare command. Imports src/engine, src/trace, src/compare and the Node standard library.
export const VERSION = "0.0.0";

export const USAGE = `box2d-typescript ${VERSION}

Usage:
  node dist/cli/main.js run <scene.json> [--ticks N]
  node dist/cli/main.js compare <observed-trace> <reference-trace>
  node dist/cli/main.js --help | --version
`;

export function main(args: string[]): { code: number; out: string; err: string } {
  const [cmd] = args;
  if (cmd === undefined || cmd === "--help" || cmd === "-h") return { code: 0, out: USAGE, err: "" };
  if (cmd === "--version") return { code: 0, out: `${VERSION}\n`, err: "" };
  if (cmd === "run") return { code: 1, out: "", err: "not implemented yet: see #11\n" };
  if (cmd === "compare") return { code: 1, out: "", err: "not implemented yet: see #7\n" };
  return { code: 2, out: "", err: `unknown command: ${cmd}\n${USAGE}` };
}

const result = main(process.argv.slice(2));
process.stdout.write(result.out);
process.stderr.write(result.err);
process.exitCode = result.code;
