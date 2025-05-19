import { useState } from 'react';
import { useEffect } from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';

function Edit (props) {
  

  // 뷰 부분
  let params = useParams();
  console.log('idx', params.idx);

  // 열람 API는 JSON 객체이므로 빈객체를 초기값으로 지정
  let [boardData, setBoardData] = useState({});
  // API 요청 주소
  let requestUrl = "http://nakja.co.kr/APIs/php7/boardViewJSON.php";
  // 파라미터(쿼리스트링)
  let parameter = "tname=nboard_news&idx=" + params.idx +"&apikey=689cbc7df44dc3c5a64f415f652006e4";

  // 1차 렌더링 후 열람API 요청
  useEffect(function() {
    fetch(requestUrl + "?" + parameter)
      .then((result) => {
        return result.json();
      })
      .then((json) =>{
        console.log(json);
        // 스테이트 변경 및 리렌더링
        setBoardData(json);
      });
      return () => {
        console.log('useEffect 실행 ==> 컴포넌트 언마운트');
      }
  }, [params.idx]);







  // 에디트 부분
  const navigate = useNavigate();
  return (<>
    <header>
    <h2>게시판-수정</h2>
    </header>
    <nav>
      <Link to="/list">목록</Link>
    </nav>
    <article>
      <form onSubmit={
        (event) => {
          event.preventDefault();

          let w = event.target.writer.value;
          let t = event.target.title.value;
          let c = event.target.contents.value;
          
          console.log(w, t, c);


          //
          let addBoardData = {name:w, subject:t, content:c};

          let copyBoardData = [...boardData];
          copyBoardData.push(addBoardData);
          setBoardData(copyBoardData);
          //

          fetch('http://nakja.co.kr/APIs/php7/boardEditJSON.php', {
            method: 'POST',
            headers: {
              'Content-type' : 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: new URLSearchParams({
              tname: 'nboard_news',
              id: 'jsonAPI',
              name: w,
              subject: t,
              content: c,
              apikey: '689cbc7df44dc3c5a64f415f652006e4',
              idx: params.idx,
            }),
          })
          .then((response) => response.json())
          .then((json) => console.log(json));
          
          navigate("/list");
        }
      }>
        <table id="boardTable">
          <tbody>
            <tr>
              <th>작성자</th>
              
              <td><input type="text" name="writer" value={boardData.name} /></td>
            </tr>
            <tr>
              <th>제목</th>
              <td><input type="text" name="title" value={boardData.subject} /></td>
            </tr>
            <tr>
              <th>내용</th>
              <td><textarea name="contents" cols="22" rows="3" value={boardData.content}></textarea></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="전송"/>
      </form>
    </article>
  </>); 
}

export default Edit;