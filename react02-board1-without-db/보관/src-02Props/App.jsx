
// 매개변수 props를 통해 전달된값을 출력
function Header(props) {
  console.log('props', props.title);
  return (<>
    <header>
    <h2>{props.title}</h2>
    </header>
  </>)
}

function Nav () {
  return (
    <nav>
      <a href="/">글쓰기</a>
    </nav>
  )
}

function Article (props) {
  // 목록 생성을 위한 빈 배열
  const lists = [];
  // 프롭스로 전달된 객체형 배열의 크기만큼 반복
  for(let i= 0 ; i < props.boardData.length ; i++){
    // 각 루프에 해당하는 객체를 꺼낸 후 lists에 추가한다
    let row = props.boardData[i];
    lists.push(
      // 중복되지 않는 key prop은 게시물의 일련번호로 설정
      <tr key={row.no}>
        <td className="cen">{row.no}</td>
        {/* 제목을 클릭하면 열람으로 전환하기 위한 링크 생성 */}
        <td><a href={'/read/' + row.no}>{row.title}</a></td>
        <td className="cen">{row.writer}</td>
        <td className="cen">{row.date}</td>
      </tr>
    );
  }
  return(<>
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
          {/* 배열에 추가한 데이터를 이 부분에 출력 */}
          {lists}
        </tbody>
      </table>
    </article>
  </>)
}

function App() {
  // 게시판의 데이터로 사용할 객체형 배열
  const boardData = [
    {no: 1, title: '오늘은 React공부하는날', writer:'낙짜쌤', 
      date: '2023-01-01', contents: 'React를 뽀개봅시당'},
    {no: 2, title: '어제는 Javascript공부해씸', writer: '유겸이',
      date: '2023-03-03', contents: 'Javascript는 할게 많아요'},
    {no: 3, title: '내일은 Project해야징', writer:'개똥이',
      date: '2023-05-05', contents: 'Project는 뭘 만들어볼까?'},
  ];


  return (<>
    <div className="App">
      {/* 문자열을 '을 통해 프롭스를 전달한다. */}
      <Header title="게시판-목록(props)"></Header>
      <Nav></Nav>
      {/* 변수는 중괄호를 사용한다. */}
      <Article boardData={boardData}></Article>
    </div>
  </>); 
}
export default App;

