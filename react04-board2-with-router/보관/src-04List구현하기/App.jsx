import {BrowserRouter} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';

import List from './components/board/List';
import Write from './components/board/Write';
import View from './components/board/View';
import NotFound from './components/common/NotFound';




function App() {

  // 데이터로 사용할 객체형 배열 생성
  const boardData = [
    {no: 1, title: '오늘은 React공부하는날', writer:'낙짜쌤', 
      date: '2023-01-01', contents: 'React를 뽀개봅시당'},
    {no: 2, title: '어제는 Javascript공부해씸', writer: '유겸이',
      date: '2023-03-03', contents: 'Javascript는 할게 많아요'},
    {no: 3, title: '내일은 Project해야징', writer:'개똥이',
      date: '2023-05-05', contents: 'Project는 뭘 만들어볼까?'},
  ];

  return (<>
    <h2>라우팅 적용한 게시판</h2>

    <BrowserRouter>
      <div className="App">
         <Routes>
          {/* 데이터로 사용할 배열을 프롭스로 자식 컴포넌트에게 전달 */}
          <Route path='/' element={<List boardData={boardData} />}></Route>
          <Route path='/list' element={<List boardData={boardData} />}></Route>
          {/* 열람의 경우 게시물의 일련번호를 통해 객체를 선택해야 하므로
          중첩라우터로 구현하고, 일련번호의 경우 :no로 기술되어있다. */}
          <Route path='/view'>
            <Route path=':no' element={<View boardData={boardData} />} />
          </Route>
          <Route path='/write' element={<Write />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  </>)
}

export default App
