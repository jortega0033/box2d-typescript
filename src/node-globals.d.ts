// Minimal declarations for the Node globals the CLI and server use; the only
// devDependency is the TypeScript compiler, so there is no @types/node.
declare const process: {
  argv: string[];
  exitCode?: number;
  stdout: { write(text: string): void };
  stderr: { write(text: string): void };
};
