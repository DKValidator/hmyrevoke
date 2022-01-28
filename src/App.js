import './App.css';
import Allowances from './components/Allowances';
import Heading from './components/Heading';

function App() {
  return (
    <div className="App">
      <Heading />
      <Allowances addr='one1lyfvnmq6p7hmq050kah0h83cqgcy7g06hnzczd' />
    </div>
  );
}

export default App;
