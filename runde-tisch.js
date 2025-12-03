const OpenAI = require('openai');
const { Graph } = require('@langchain/langgraph');

const openai = new OpenAI({ apiKey: 'YOUR_OPENAI_KEY' }); // Ersetze mit deinem Key

class RoundTable {
  constructor() {
    this.models = [
      { name: 'grok4', model: 'grok-4' },
      { name: 'claude35', model: 'claude-3.5-sonnet' },
      { name: 'gemini2', model: 'gemini-2.0' },
      { name: 'llama405b', model: 'llama-3.1-405b' },
      { name: 'o3pro', model: 'o3-pro' },
      { name: 'perplexity', model: 'perplexity' },
      { name: 'genspark', model: 'genspark-agent' }
    ];
    this.graph = this.buildGraph();
  }

  buildGraph() {
    const graph = new Graph();
    this.models.forEach(model => {
      graph.addNode(model.name, (state) => this.callModel(model, state.input));
    });
    // Edges: Sequenzielle Debate
    this.models.forEach((model, i) => {
      if (i < this.models.length - 1) graph.addEdge(model.name, this.models[i+1].name);
    });
    graph.addEdge(this.models[this.models.length - 1].name, 'end');
    return graph.compile();
  }

  async callModel(model, input) {
    try {
      const response = await openai.chat.completions.create({
        model: model.model,
        messages: [{ role: 'user', content: `Diskutiere: ${input}` }]
      });
      return response.choices[0].message.content;
    } catch (error) {
      return `Fehler bei ${model.name}: ${error.message}`;
    }
  }

  async debate(input) {
    const result = await this.graph.invoke({ input });
    const konsensus = this.consensus(result);
    return konsensus;
  }

  consensus(results) {
    return `Konsensus aus ${this.models.length} KIs: ${Object.values(results).join(' + ')}`;
  }

  async pushToGitHub(repo, path, code) {
    try {
      await octokit.rest.repos.createOrUpdateFileContents({
        owner: 'hubertcpfeiffer-coder',
        repo,
        path,
        message: 'Auto-Optimierung durch Runden Tisch',
        content: Buffer.from(code).toString('base64')
      });
      console.log('Code gepusht – Selbst-Optimierung abgeschlossen.');
    } catch (error) {
      console.error('Push-Fehler:', error.message);
    }
  }
}

module.exports = { RoundTable };
