import { Link } from "react-router-dom";

function Write(props) {
  const boardData = props.boardData;
  const setBoardData = props.setBoardData;
  const nextNo = props.nextNo;
  const setNextNo = props.setNextNo;
  const navigate = props.navigate;
  const nowDate = props.nowDate;

  return (<>
    <header>
      <h2>게시판-작성</h2>
  </header>
    <nav>
      <Link to="/list">목록</Link>
    </nav>
    <article>
      <form onSubmit={(event)=>{
        // submit 이벤트 차단
        event.preventDefault();

        // 이벤트객체의 target속성으로 DOM의 입력값을 읽어옴
        let title = event.target.title.value;
        let writer = event.target.writer.value;
        let contents = event.target.contents.value;
        
        // 스테이트, 폼값, 함수의 반환값으로 새롭게 추가할 객체 생성
        let addBoardData = {no:nextNo, writer:writer, title:title, contents:contents, date:nowDate()};

        // 기존 데이터의 복사본을 생성
        let copyBoardData = [...boardData];
        // 새로 만든 객체를 추가
        copyBoardData.push(addBoardData);
        // 이를 통해 스테이트를 변경(업데이트)
        setBoardData(copyBoardData);
        // 시퀀스 번호 증가
        setNextNo(nextNo+1);
        // 모든 작업이 완료되면 목록으로 이동한다.
        navigate('/list');
      }}>
        <table id="boardTable">
          <colgroup>
            <col width="30%"/>
            <col width="*"/>
          </colgroup>
          <tbody>
            <tr>
              <th>작성자</th>
              <td><input type="text" name="writer" /></td>
            </tr>
            <tr>
              <th>제목</th>
              <td><input type="text" name="title" /></td>
            </tr>
            <tr>
              <th>날짜</th>
              <td>2023-05-05</td>
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
export default Write;