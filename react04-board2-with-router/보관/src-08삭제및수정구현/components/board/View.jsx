import { Link, useParams } from "react-router-dom";

function View(props) {
  const setBoardData = props.setBoardData;
  const navigate = props.navigate;
  /**
  useParams 훅
  : 컴포넌트를 라우팅 처리할때 중첩된 구조내에서 :no와 같이 사용된
    파라미터의 값을 읽어올 수 있는 훅. 별도의 인수없이 선언한다.
   */
  var params = useParams();
  console.log('파라미터', params.no);
  /**
  데이터 배열의 크기만큼 반복하여 조건에 맞는 객체를 찾은 후 반환한다.
  빈 객체를 초기갑으로 사용했으므로, 배열의 크기인 N만큼 반복하게 된다.
  pV의 첫번째 값은 빈 객체
  cV의 첫번째 값은 데이터 배열의 0번 요소.
   */
  let vi = props.boardData.reduce((pV, cV)=>{
    return (cV.no===Number(params.no))? cV : pV;
  }, {});

  return (<>
    <header>
      <h2>게시판-읽기</h2>
    </header>
    <nav>
      <Link to="/list">목록</Link>&nbsp;
      <Link to="/edit">수정</Link>&nbsp;
      <Link to="/delete" onClick={(event)=>{
        event.preventDefault();
        let newBoardData = [];
        // 데이터의 개수만큼 반복
        for(let i=0; i<props.boardData.length; i++){
          if(Number(params.no) !== props.boardData[i].no){
            newBoardData.push(props.boardData[i]);
          }
        }
        setBoardData(newBoardData);
        navigate('/list');
      }}>삭제</Link>&nbsp;
    </nav>
    <article>
      <table id="boardTable">
        <colgroup>
          <col width="30%"/>
          <col width="*"/>
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
    </article>
    <footer>
      <button onClick={()=>{
        let preIndex = props.boardData.indexOf(vi)-1;
        let preNum;
        if(preIndex>=0){
          preNum = props.boardData[preIndex].no;
        }
        else{
          preNum = props.boardData[0].no;
        }
        navigate('/view/'+preNum);
      }}>이전글</button>

      <button onClick={()=>{
        let nextIndex = props.boardData.indexOf(vi)+1;
        let nextNum;
        if(nextIndex<props.boardData.length){
          nextNum = props.boardData[nextIndex].no;
        }
        else{
          nextNum = props.boardData[props.boardData.length-1].no;
        }
        navigate('/view/'+nextNum);
      }}>다음글</button>
    </footer>
  </>); 
}
export default View;