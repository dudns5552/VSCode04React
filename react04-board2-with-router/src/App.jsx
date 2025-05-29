// 라우팅 관련 컴포넌트 임포트
import {useNavigate} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';

import List from './components/board/List';
import View from './components/board/View';
import Write from './components/board/Write';
import NotFound from './components/common/NotFound';
// 스테이트 사용을 위한 import
import { useState } from 'react';

// 작성일 생성을 위한 함수 정의
function nowDate () {
   let dateObj = new Date();
    var year = dateObj.getFullYear();
    var month = ('0' + (1 + dateObj.getMonth())).slice(-2);
    var day = ('0' + dateObj.getDate()).slice(-2);

    // 0000-00-00 포맷의 날짜 생성
    return year + '-' + month + '-' + day;
}

function App() {
  // 데이터로 사용할 객체형 배열 생성
  // 작성을 위해 기존 배열을 스테이트로 변경한다.
  const [boardData,setBoardData] = useState([
    {no:1,title:'오늘은 React공부하는날', writer:'낙짜쌤', date:'2023-01-01',
      contents:'React를 뽀개봅시다'},
    {no:2,title:'어제는 Javascript공부함', writer:'유겸이', date:'2023-03-03',
      contents:'Javascript는 할게 너무 많아요'},
    {no:3,title:'내일은 Project해야지', writer:'길동이', date:'2023-05-05',
      contents:'Project는 뭘 만들어볼까?'}
  ]);

  // 일련번호를 부여할 스테이트 생성
  const [nextNo, setNextNo] = useState(4);

  // 작성 완료 후 페이지 이동을 위한 훅 선언
  const navigate = useNavigate();

  return(<>
  {/* 라우팅 처리를 위해 App컴포넌트를 감싸야 하므로 이와같이 App.jsx에서
  처리해도 된다. 하지만 주로 main.jsx에서 처리하는게 좋다. */}
      <Routes>
        {/* 데이터로 사용할 배열을 프롭스로 자식컴포넌트로 전달 */}
        <Route path='/' element={<List boardData={boardData}/>} />
        <Route path='/list' element={<List boardData={boardData}/>} />
        {/* 열람의 경우 게시물의 일련번호를 통해 객체를 선택해야 하므로
        중첩라우터로 구현하고, 일련번오의 경우 :no로 기술되어있다. */}
        <Route path='/view'>
          <Route path=':no' element={<View boardData={boardData} 
                            setBoardData={setBoardData} navigate={navigate}/>}/>
        </Route>
        {/* Write 컴포넌트로 글쓰기 처리를 위한 모든 스테이트와
        관련 함수를 프롭스로 전달한다. */}
        <Route path='/write' element={<Write
          boardData={boardData} setBoardData={setBoardData}
          nextNo={nextNo} setNextNo={setNextNo}
          navigate={navigate} nowDate={nowDate}
        ></Write>} />
        <Route path='*' element={<NotFound></NotFound>} />
      </Routes>
  </>);
}

export default App;
