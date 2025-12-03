const { RoundTable } = require('./runde-tisch');
const { Octokit } = require('octokit');

const octokit = new Octokit({ auth: 'YOUR_GITHUB_TOKEN' }); // Ersetze mit deinem PAT-Token

async function main() {
  const tisch = new RoundTable();
  const input = 'Optimiere Biorhythmus-Modul für Bijagos-Insel';
  const output = await tisch.debate(input);
  console.log('Konsensus:', output);

  // Selbst-Optimierung: Code pushen
  await tisch.pushToGitHub('mio-lifepilot', 'src/biorhythmus.js', output);
}

main().catch(console.error);
