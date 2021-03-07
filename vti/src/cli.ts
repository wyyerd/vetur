import { Command } from 'commander';
import { diagnostics } from './commands/diagnostics';

function getVersion(): string {
  const { version }: { version: string } = require('../package.json');
  return `v${version}`;
}

(async () => {
  const program = new Command();
  program.name('vti').description('Vetur Terminal Interface').version(getVersion());

  program
    .command('diagnostics [workspace]')
    .description('Print all diagnostics')
    .option('-l, --log-level <logLevel>', 'Log level to print', 'WARN')
    .action(async (workspace, options) => {
      const logLevelOption: unknown = options.logLevel;
      if (
        logLevelOption !== 'ERROR' &&
        logLevelOption !== 'WARN' &&
        logLevelOption !== 'INFO' &&
        logLevelOption !== 'HINT'
      ) {
        throw new Error(`Invalid log level: ${logLevelOption}`);
      }
      await diagnostics(workspace, logLevelOption);
    });

  program.parse(process.argv);
})().catch(err => {
  console.error(`VTI operation failed with error`);
  console.error(err.stack);
  process.exit(1);
});
