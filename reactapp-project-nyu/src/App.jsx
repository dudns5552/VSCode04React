import { NavLink, Route, Routes } from 'react-router-dom';
import List from './components/board/List';
import Free from './components/board/Free';
import QnA from './components/board/QnA';
import Login from './components/member/Login';
import Chat from './components/chat/Chat';
import Signup from './components/member/Signup';
import Modify from './components/member/Modify';
import Archive from './components/board/Archive';


function TobNav () {
  return (
    <nav id='topNav'>
      <NavLink to="/">HOME</NavLink>&nbsp;
      <NavLink to="/login">로그인</NavLink>&nbsp;
      <NavLink to="/signup">회원가입</NavLink>&nbsp;
      <NavLink to="/modify">회원정보수정</NavLink>&nbsp;
    </nav>
  );
}

function BodyNav () {
  return(
    <nav id='bodyNav'>
      <NavLink to="/free">자유게시판</NavLink>&nbsp;
      <NavLink to="/qna">Q&A</NavLink>&nbsp;
      <NavLink to="/archive">자료실</NavLink>&nbsp;
      <NavLink to="/chat">채팅</NavLink>
    </nav>
  );
}

function App() {
  
  return (<>
    <TobNav />
    <BodyNav />
    <Routes>
      <Route path='/' element={<List />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/modify' element={<Modify />} />
      <Route path='/free' element={<Free />} />
      <Route path='/qna' element={<QnA />} />
      <Route path='/archive' element={<Archive />} />
      <Route path='/chat' element={<Chat />} />
    </Routes>
  </>); 
}
export default App;