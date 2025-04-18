// App.jsx
import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import FlowchartTool from './FlowchartTool';
import 'reactflow/dist/style.css';

function App() {
  return (
    <ReactFlowProvider>
      <FlowchartTool />
    </ReactFlowProvider>
  );
}

export default App;