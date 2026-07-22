import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { FlowchartContainer } from './components/flowchart/FlowchartContainer';

function App() {
  return (
    <ReactFlowProvider>
      <FlowchartContainer title="Taskmapper" />
    </ReactFlowProvider>
  );
}

export default App;
