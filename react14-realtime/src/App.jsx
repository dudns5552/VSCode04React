import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RealtimeCRUD from './components/RealtimeCRUD';
import Listener from './components/Listener';
import ChatStart from './components/ChatStart';
import ChatMessage from './components/ChatMessage';

function App() {
  return (<>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RealtimeCRUD />} />
        <Route path='/crud' element={<RealtimeCRUD />} />
        <Route path='/listener' element={<Listener/>}/>
        {/* 실시간 채팅은 2단계로 라우팅 처리가 되어있음
        첫번째 화면은 대화방, 대화명 입력을 위한 입력상자가 있음. 
        2개의 정보를 입력 후 팝업창으로 채팅 대화창(두번째화면)을 
        띄우게됨. */}
        <Route path='/chat'>
          <Route index element={<ChatStart/>}/>
          <Route path='talk' element={<ChatMessage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </>); 
}
export default App;