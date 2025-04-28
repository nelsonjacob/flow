

import { useEffect } from 'react';
import {ReactFlowProvider} from 'reactflow';
import 'reactflow/dist/style.css';
import { FlowchartContainer } from './components/flowchart/FlowchartContainer';
import { logger } from './utils/logger';

function App() {

  useEffect(() => {
    logger.info('App component mounted');
  }, []);

  return (
    <ReactFlowProvider>
      <div className="basic-layout">
        <FlowchartContainer title="Taskmapper" />
      </div>
    </ReactFlowProvider>
  )
}

export default App;
