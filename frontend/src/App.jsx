import StrategyChart from './components/StrategyChart';
import ControlPanel from './components/ControlPanel/ControlPanel';

export default function App() {

  return (
    <>
      {/* <StrategyChart /> */}
      <div className='page'>
        <StrategyChart />
        <ControlPanel />
      </div>
    </>
  )
}