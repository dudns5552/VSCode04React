import {Link, useParams} from 'react-router-dom';

function View (props) {
  
  var params = useParams();
  console.log('파라미터', params.no);

  let vi = props.boardData.reduce((prev, curr) => {
    if(curr.no === Number(params.no)) {
      prev = curr;
    }
    return prev;
  }, {});
  
  let nextNum;
  let prevNum;
  
  if(vi.no-1 < 1){
    prevNum = 1;
  }
  else{
    prevNum = vi.no-1;
  }
  if(vi.no+1 > props.boardData.length){
    nextNum = vi.no;
  }
  else{
    nextNum = vi.no+1;
  }

  return (<>
    <header>
      <h2>게시판-읽기</h2>
    </header>
    <nav>
      <Link to="/list">목록</Link>&nbsp;
      <Link to="/edit">수정</Link>&nbsp;
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
            <td>{vi.writer}</td>
          </tr>
          <tr>
            <th>제목</th>
            <td>{vi.title}</td>
          </tr>
          <tr>
            <th>날짜</th>
            <td>{vi.date}</td>
          </tr>
          <tr>
            <th>내용</th>
            <td>{vi.contents}</td>
          </tr>
        </tbody>
      </table>
      <nav>
        <Link to={"/view/" + prevNum}>prev</Link>
        <Link to={"/view/" + nextNum}>next</Link>
      </nav>
    </article>
  </>); 
}

export default View