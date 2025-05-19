/* 
react-router-dom으로 부터 임포트한 컴포넌트와 관련 훅 */
import {Routes, Route, Link, NavLink} from 'react-router-dom';
import {Outlet, useLocation, useSearchParams} from 'react-router-dom';

const TopNavi = () => {
  /* 
  NavLink 컴포넌트는 a태그와 같이 하이퍼링크를 제공한다.
  단, a태그에 preventDefault()가 적용된 형태로 화면의 깜빡임없이 페이지
  이동을 할 수 있다. 또한 링크를 클릭했을때 active라는 클래스 속성을
  자동으로 추가해준다. */
  return (
    <nav>
      <NavLink to="/">HOME</NavLink>&nbsp;
      <NavLink to="/intro">인트로</NavLink>&nbsp;
      <NavLink to="/intro/router">Router관련Hook</NavLink>&nbsp;
      <NavLink to="/XYZ">잘못된URL</NavLink>&nbsp;
      {/* a태그를 사용하는 경우 화면의 깜빡임이 있으므로 이벤트 객체를
      통해 반드시 preventDefault() 함수를 사용해야한다. */}
      <a href="/aTag" onClick={(e) => {e.preventDefault()}}>A태그</a>
      &nbsp;
      {/* Link 컴포넌트는 NavLink와 기능은 동일하지만, active 속성값이
      부여되지 않는다. */}
      <Link to={"/linkTag"}>Link컴포넌트</Link>
    </nav>
  );
}

/* 
Outlet 컴포넌트
  웹사이트 제작시 공통으로 사용되는 레이아웃에서 특정 요청에 따른
  내용만 변경해서 사용해야 할때 사용한다.
*/
const CommonLayout = () => {
  return (
    <div>
      <header style={{ background: 'lightgray', padding: '10px'}}>
        Outlet 컴포넌트 알아보기
      </header>
      <article>
        {/* 각 페이지의 컴포넌트가 보여지는 부분에 설정한다. */}
        <Outlet />
      </article>
      <footer style={{ background:'lightgray', padding:'10px'}}>
        공통 레이아웃
      </footer>
    </div>
  );
}

const Home = () => {
  return (<>
  <h2>React Home</h2>
  <p>
    React Router에 대해 학습합니다.
  </p>
  </>)
}

/* 
localhost/intro 경로가 요청될때 Outlet 컴포넌트 위치에 삽입되어 
렌더링된다. 이 부분은 App 컴포넌트에 라우팅 처리 되어있다.
*/
const LayoutIndex = () => {
  return (<>
    <h2>레이아웃 인덱스 페이지</h2>
    <ul>
      <li>Outlet 컴포넌트 위치에 출력됩니다.</li>
      <li>Route 설정시 index로 지정합니다.</li>
    </ul>
  </>);
}

/* 
설정된 경로 외 잘못된 경로를 요청했을때 렌더링 되는 컴포넌트.
백앤드에서는 이런 경우 404 에러가 발생하게 된다.
*/
const NotFound = () => {
  return (
    <div>
      <h2>Not Found</h2>
      <p>
        페이지를 찾을 수 없습니다. ㅜㅜ
        <Link to='/'>Home</Link>
      </p>
    </div>
  );
}

/* 
localhost/intro/router 경로가 요청되었을때 Outlet 컴포넌트 부분에
삽입되어 렌더링된다.

useLocation 훅
  React Router를 통해 라우팅된 페이지에서 현재 URL(경로)과 관련된
  정보를 얻는데 사용된다. URL경로, 쿼리스트링 등의 관련정보를 제공한다.

useSearchParams
  현재 URL의 쿼리스트링을 얻어오거나 조작할때 사용한다.
*/
const RouterHooks = () => {

  // 별도의 인수 없이 변수를 정의
  const location = useLocation();
  // 쿼리스트링의 정보를 얻어오기 위한 변수와 변경을 위한 함수를 정의
  const [searchParams, setSearchParams] = useSearchParams();
  /* 쿼리스트링에서 파라미터를 얻어온다. 첫 진입시에는 둘다 null이다.
  아래 조작을 위한 함수가 실행되면 설정된 값을 읽어올 수 있다. */
  const mode = searchParams.get('mode');
  const pageNum = searchParams.get('pageNum');

  // 파라미터 mode의 값을 토글시켜주는 함수
  const changeMode = () => {
    // 삼항연산자를 통해 list/view를 토글한다.
    const nextMode = (mode === 'list') ? 'view' : 'list';
    /* 파라미터 변경을 위한 setXX함수를 통해 값을 변경한다.
    pageNum의 경우 값이 지정되지 않았으므로 기존의 값을 유지한다. */
    setSearchParams({
      mode : nextMode,
      pageNum
    });
    /* es6 에서는 객체 생성시 key와 value가 일치하면 하나의 값만 기술하면
    된다.
    {pageNum : pageNum} == {pageNum} */
  }

  // 다음페이지로 이동하기 위한 파라미터 조작
  const nextPage = () => {
    /* 페이지 번호가 없는 상태라면 페이지를 1로 지정하고, 값이 있다면
    +1 시켜준다. */
    let pageTemp = (pageNum === null || isNaN(pageNum)) 
    ?  1    : parseInt(pageNum) + 1;

    // 페이지제한를 10로 설정
    if(pageTemp === 11) {
      pageTemp = 10;
      window.alert('마지막 페이지 입니다.');
    }
    // mode는 고정된 상태에서 pageNum만 변경한다
    setSearchParams({
      mode,
      pageNum : pageTemp
    });
  }

  // 이전페이지로 이동하기 위해 파라미터를 조작
  const prevPage = () => {
    let pageTemp = (pageNum === null || isNaN(pageNum)) 
    ? 1 
    : parseInt(pageNum) -1;
    
    // 최소페이지를 1로 고정
    if(pageTemp === 0) {
      pageTemp = 1;
      window.alert('첫번째 페이지 입니다.');
    }
    setSearchParams({
      mode,
      pageNum : pageTemp
    });
  }

  return (<>
    <h2>라우터 관련 Hook</h2>
    <div>
      <ul>
        {/* useLocation 훅을 통해 얻을 수 있는 정보
          pathname : 쿼리스트링을 제외한 Host를 얻어온다.
          search : 쿼리스트링을 얻어온다. */}

        <li>URL : {location.pathname}</li>
        <li>쿼리스트링 : {location.search}</li>
        <li>mode : {mode}</li>
        <li>detail : {pageNum}</li>
      </ul>

      {/* 버튼에 함수 연결시 이벤트 리스너에 함수명만 붙여주면 된다. */}
      <button onClick={changeMode}>mode변경</button>
      <button onClick={prevPage}>이전Page</button>
      <button onClick={nextPage}>다음Page</button>
    </div>
  </>);
}


function App() {
  
  return (<>
    <div className="App">
      {/* 라우팅 처리가 필요없는 컴포넌트는 전체페이지에서 공통으로
      렌더링되는 네비게이션을 주로 사용한다. */}
      <TopNavi></TopNavi>

        {/* 라우팅 처리가 필요한 컴포넌트는 아래와 같이 path, 
        element 라는 속성(프롭스)을 통해 경로와 렌더링 할 
        컴포넌트를 지정한다. */}
        <Routes>
          <Route path="/" element={<Home></Home>}/>
          {/* 하위 경로가 필요한 경우에는 '중첩라우팅'을 사용한다. */}
          <Route path="/intro" element={<CommonLayout />}>
            {/* '/intro'로 요청이 들어오면 이 컴포넌트를 렌더링한다. */}
            <Route index element={<LayoutIndex />}/>
            {/* '/intro/router'와 같은 하위경로 요청이 들어오면
            RouterHooks 컴포넌트를 렌더링 한다. */}
            <Route path="router" element={<RouterHooks />}/>
            </Route>
          {/* 지정되지 않은 모든 경로에 대해서는 404 처리 */}
          <Route path="*" element={<NotFound></NotFound>}/>
        </Routes>
    </div>
  </>);
}

export default App
