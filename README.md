# Flow

Flow is a local-first task flowchart built with React, TypeScript, Vite, Tailwind CSS, and ReactFlow.

## Requirements

- Node.js 24 (`nvm use` reads the included `.nvmrc`)
- npm 11 or newer

## Development

```bash
npm install
npm run dev
```

Useful verification commands:

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm run check
```

`npm run check` runs the complete local quality gate: lint, TypeScript, tests, and a production build.

## Architecture

- `src/flowchart` contains serializable domain types and pure graph, sizing, placement, and persistence functions.
- `src/hooks` coordinates React and ReactFlow state and user interactions.
- `src/components` renders the editor, nodes, dialogs, and controls.

The app stores the current chart in browser local storage under the existing `flowchart-nodes`, `flowchart-edges`, and `flowchart-title` keys. Stored values are validated when loaded, legacy node data receives current defaults, and transient selection state is not persisted.
