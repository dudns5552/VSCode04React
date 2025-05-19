import {Link} from 'react-router-dom';

function List(props) {
  /**
  App컴포넌트에서 프롭스를 통해 전달한 배열데이터를 고차함수인 map()을 통해
  반복해서 출력할 목록을 생성한다.
   */
   const lists = props.boardData.map((row)=>{
    return (<tr key={row.no}>
        <td className="cen">{row.no}</td>
        {/* 열람으로 이동하기 위한 링크는 "/view/일련번호"와 같이 구성하고
        라우팅 처리 부분에서 :no로 기술되어 있다. 이 부분은 useParams 훅을
        통해 읽을 수 있다. */}
        <td><Link to={'/view/'+row.no}>{row.title}</Link></td> 
        <td className="cen">{row.writer}</td>
        <td className="cen">{row.date}</td>
    </tr>) ;
  });

  return (<>
    <header>
      <h2>게시판-목록</h2>
    </header>
    <nav>
      {/* 각 링크는 <a>에서 <Link> 컴포넌트로 변경 */}
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
          {/* map을 통해 구성한 목록부분을 여기서 출력한다. */}
          {lists}
        </tbody>
      </table>
    </article>
  </>);
}
export default List;