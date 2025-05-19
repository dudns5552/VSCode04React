import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";


function Edit(props) {
  
  const navigate = useNavigate();
  let params = useParams();
  console.log('수정idx', params.idx);

  // let [boardData, setBoardData] = useState({});
  let requestUrl = "http://nakja.co.kr/APIs/php7/boardViewJSON.php";
  let parameter = "tname=nboard_news&idx=" + params.idx +"&apikey=689cbc7df44dc3c5a64f415f652006e4";

  // 수정을 위한 State
  const [writer, setWriter] = useState('');
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');

  useEffect(function() {
    fetch(requestUrl +"?"+ parameter)
      .then((result) => {
        return result.json();
      })
      .then((json) => {
        // setBoardData(json);
        setWriter(json.name);
        setTitle(json.subject);
        setContents(json.content);
      });

    return () => {
      console.log('uesEffect 실행 ==> 컴포넌트 언마운트');
    }
  }, []);

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

          let i = event.target.idx.value;
          let w = event.target.writer.value;
          let t = event.target.title.value;
          let c = event.target.contents.value;
          
          console.log(w, t, c);

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
              idx: i,
            }),
          })
          .then((response) => response.json())
          .then((json) => console.log(json));
          
          navigate("/list");
        }
      }>
        <input type="hidden" name="idx" value={params.idx} />
        <table id="boardTable">
          <tbody>
            <tr>
              <th>작성자</th>
              
              <td><input type="text" name="writer" value={writer}
                onChange={(event) => {
                  setWriter(event.target.value);
                }} /></td>
            </tr>
            <tr>
              <th>제목</th>
              <td><input type="text" name="title" value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                }} /></td>
            </tr>
            <tr>
              <th>내용</th>
              <td><textarea name="contents" cols="22" rows="3" value={contents}
                onChange={(event) => {
                  setContents(event.target.value);
                }}></textarea></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="전송"/>
      </form>
    </article>
  </>); 
}
export default Edit;