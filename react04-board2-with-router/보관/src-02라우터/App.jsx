// 라우팅 관련 컴포넌트 임포트
import {BrowserRouter} from 'react-router-dom';
import {Routes, Route, Link} from 'react-router-dom';

function List (props) {
  
  return (<>
    <header>
    <h2>게시판-목록</h2>
  </header>
    <nav>
      {/* 각 링크는 a태그에서 Link 컴포넌트로 변경 */}
      {/* <a href="/write">글쓰기</a> */}
      <Link to="/write">글쓰기</Link>
    </nav>
    <article>
      <table id="boardTable">
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>작성자</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="cen">1</td>
            <td><a href="/view/1">오늘은 React공부하는날 </a></td>
            <td className="cen">낙짜쌤</td>
            <td className="cen">2030-05-05</td>
          </tr>
        </tbody>
      </table>
    </article>
  </>); 
}

function View (props) {
  
  return (<>
    <header>
      <h2>게시판-읽기</h2>
    </header>
    <nav>
      {/* <a href="/list">목록</a>&nbsp;
      <a href="/edit">수정</a>&nbsp;
      <a href="/delete">삭제</a> */}
      <Link to="/list">목록</Link>
      <Link to="/edit">수정</Link>
      <Link to="/delete">삭제</Link>
    </nav>
    <article>
      <table id="boardTable">
        <colgroup>
        <col width="20%" /><col width="*" />
        </colgroup>
        <tbody>
          <tr>
            <th>작성자</th>
            <td>성유겸</td>
          </tr>
          <tr>
            <th>제목</th>
            <td>오늘은 React공부하는날</td>
          </tr>
          <tr>
            <th>날짜</th>
            <td>2023-05-05</td>
          </tr>
          <tr>
            <th>내용</th>
            <td>열심히 해봅시당. <br/> 열공 합시당.</td>
          </tr>
        </tbody>
      </table>
    </article>
  </>); 
}

function Write (props) {
  
  return (<>
    <header>
    <h2>게시판-작성</h2>
    </header>
    <nav>
      {/* <a href="/list">목록</a> */}
      <Link to="/list">목록</Link>
    </nav>
    <article>
      <form>
        <table id="boardTable">
          <tbody>
            <tr>
              <th>작성자</th>
              <td><input type="text" name="writer"/></td>
            </tr>
            <tr>
              <th>제목</th>
              <td><input type="text" name="title"/></td>
            </tr>
            <tr>
              <th>내용</th>
              <td><textarea name="contents" cols="22" rows="3"></textarea></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="전송"/>
      </form>
    </article>
  </>); 
}

function NotFound () {
  return (<>
    <div>
      <h2>Not Found</h2>
      <p>
        페이지를 찾을 수 없습니다.
      </p>
    </div>
  </>);
}

function App() {

  return (<>
    <h2>라우팅 적용한 게시판</h2>
      {/* 라우팅 처리를 위해 App컴포넌트를 감싸야 하므로 이와같이
      App.jsx에서 처리해도 된다. 하지만 주로 main.jsx에서 처리하는 것이
      좋다. */}
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* 첫 실행시에는 목록이 렌더링 된다. */}
          <Route path='/' element={<List></List>}></Route>
          <Route path='/list' element={<List></List>}></Route>
          <Route path='/view' element={<View></View>}></Route>
          <Route path='/write' element={<Write></Write>}></Route>
          <Route path='*' element={<NotFound></NotFound>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  </>)
}

export default App
