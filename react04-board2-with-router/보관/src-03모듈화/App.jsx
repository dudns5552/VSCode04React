import {BrowserRouter} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';

import List from './components/board/List';
import Write from './components/board/Write';
import View from './components/board/View';
import NotFound from './components/common/NotFound';




function App() {

  return (<>
    <h2>라우팅 적용한 게시판</h2>

    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<List></List>}></Route>
          <Route path='/list' element={<List></List>}></Route>
          <Route path='/view' element={<View></View>}></Route>
          <Route path='/write' element={<Write></Write>}></Route>
          <Route path='*' element={<NotFound></NotFound>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  </>)
}

export default App
