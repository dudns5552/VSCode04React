import {Routes, Route} from 'react-router-dom';

import List from './components/board/List';
import View from './components/board/View';
import Write from './components/board/Write';
import NotFound from './components/common/NotFound';
import Edit from './components/board/Edit';

function App() {


  return(<>
    <div className="App">
      <Routes>
        <Route path='/' element={<List></List>} />
        <Route path='/list' element={<List></List>} />
        {/* 중첩라우팅으로 게시물의 일련번호가 하위경로 형태로 추가된다.
        이것을 useParams 훅을 통해 읽어올 수 있다. */}
        <Route path='/view'>
          <Route path=':idx' element={<View></View>} />
        </Route>
        <Route path='/write' element={<Write></Write>} />
        <Route path='/edit'>
          <Route path=':idx' element={<Edit></Edit>} />
        </Route>
        <Route path='*' element={<NotFound></NotFound>} />
      </Routes>
    </div>
  </>);
}

export default App;
