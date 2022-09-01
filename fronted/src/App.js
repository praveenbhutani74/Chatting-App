
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ChatPage from './Components/ChatPage';
import Home from './Components/Home';

function App() {
  return (
    <div className='App'>
     <Routes>
      <Route exact path='/' element={<Home/>} />

     <Route exact path='chats' element={<ChatPage/>}/>
     </Routes>
    </div>
  );
}

export default App;
