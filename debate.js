const { RoundTable } = require('./runde-tisch');

async function runDebate() {
  const tisch = new RoundTable();
  const input = 'Verbessere den Avatar-Code für bessere Voice-Integration.';
  const output = await tisch.debate(input);
  console.log(output);
  // Push zu GitHub
  await tisch.pushToGitHub('mio-lifepilot', 'src/avatar.js', output);
}

runDebate().catch(console.error);
