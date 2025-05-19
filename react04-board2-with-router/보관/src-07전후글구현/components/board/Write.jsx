import {Link} from 'react-router-dom';

function Write (props) {
  
  // App 컴포넌트에서 전달한 스테이트와 관련함수를 모두 받아서 저장
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
      <form onSubmit={(event) => {
      // 제출되는 것을 차단
      event.preventDefault();

      /* 이벤트 객체의 target 속성으로 form하위 태그에 접근하여
      DOM의 입력값(value)을 읽어온다. */
      let t = event.target.title.value;
      let w = event.target.writer.value;
      let c = event.target.contents.value;

      // 스테이트, 폼값, 함수의 반환값으로 새롭게 추가할 객체 생성
      let addBoardData = {no: nextNo, title: t, writer: w, 
        contents: c, date: nowDate()};

      // 기존 데이터의 복사본 생성
      let copyBoardData = [...boardData];
      // 새로 만든 객체를 추가
      copyBoardData.push(addBoardData);
      // 스테이트를 업데이트
      setBoardData(copyBoardData);
      // 시퀀스 번호 증가
      setNextNo(nextNo+1);
      // 모든 작업이 완료되면 목록으로 이동
      navigate('list');
      }}>
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

export default Write;