function Edit(props) {
  const [title, setTitle] = useState(props.selectRow.title);
  const [writer, setWriter] = useState(props.selectRow.writer);
  const [contents, setContents] = useState(props.selectRow.contents);

  return (<>
    <header>
      <h2>게시판-작성</h2>
    </header>
    <nav>
      <Link to="/list">목록</Link>
    </nav>
    <article>
      <form onSubmit={(event)=>{
        event.preventDefault();

        let title = event.target.title.value;
        let writer = event.target.writer.value;
        let contents = event.target.contents.value;
        
        let addBoardData = {no:nextNo, writer:writer, title:title, contents:contents, date:nowDate()};

        let copyBoardData = [...boardData];
        copyBoardData.push(addBoardData);
        setBoardData(copyBoardData);
        setNextNo(nextNo+1);
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
export default Edit;