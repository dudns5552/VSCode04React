import {Link, useNavigate} from 'react-router-dom';

function Write (props) {
  
  // 페이지 이동을 위한 훅 사용
  const navigate = useNavigate();

  return (<>
    <header>
    <h2>게시판-작성</h2>
    </header>
    <nav>
      <Link to="/list">목록</Link>
    </nav>
    <article>
      <form onSubmit={
        (event) => {
          event.preventDefault();

          // 입력한 폼값 읽어오기 
          let w = event.target.writer.value;
          let t = event.target.title.value;
          let c = event.target.contents.value;
          
          console.log(w, t, c);

          // 작성 API 호출
          /* fetch함수를 통해 post방식으로 요청을 해야하는 경우
          두번째 인수가 필요하다. */
          fetch('http://nakja.co.kr/APIs/php7/boardWriteJSON.php', {
            // 1. 전송방식 설정
            method: 'POST',
            // 2. 헤더 설정(컨텐츠타입, 캐릭터셋)
            headers: {
              'Content-type' : 'application/x-www-form-urlencoded;charset=UTF-8',
            },

            /*
            3. 작성자가 입력한 폼값을 JSON형식으로 조립하여 전송한다. 
            URLSearchParams객체는 JSON형식의 데이터를 쿼리스트링 형식으로
            변환해준다. */
            body: new URLSearchParams({
              tname: 'nboard_news',
              id: 'jsonAPI',
              name: w,
              subject: t,
              content: c,
              apikey: '689cbc7df44dc3c5a64f415f652006e4',
            }),
          })
          .then((response) => response.json())
          .then((json) => console.log(json));
          
          // 글쓰기 완료시 목록으로 이동
          navigate("/list");
        }
      }>
        <table id="boardTable">
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