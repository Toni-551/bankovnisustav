import './App.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate(); 
  useEffect(() => {
    navigate('/login');
  }, [])
  return (
    <><Outlet /></>
  );
}

export default App;
