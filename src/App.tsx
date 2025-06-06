
import {ReactFlowProvider} from 'reactflow';
import 'reactflow/dist/style.css';
import { FlowchartContainer } from './components/flowchart/FlowchartContainer';


function App() {


  return (
    <ReactFlowProvider>
      <div className="basic-layout">
        <FlowchartContainer title="Taskmapper" />
      </div>
    </ReactFlowProvider>
  )
}

export default App;
