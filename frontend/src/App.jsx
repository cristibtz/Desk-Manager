import Dashboard from './components/Dashboard/Dashboard';
import Landing from './components/Landing/Landing';
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {


  return (
    <Router>
      <div>
        
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
        
        </Routes>
      </div>
    </Router>
  );
}


export default App;