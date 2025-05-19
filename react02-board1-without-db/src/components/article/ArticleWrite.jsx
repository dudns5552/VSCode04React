function ArticleWrite(props) {
  
  return (<>
    <article>
    <form onSubmit={(event) => {
      // 제출되는 것을 차단
      event.preventDefault();

      /* 이벤트 객체의 target 속성으로 form하위 태그에 접근하여
      value를 읽어온다. */

      let title = event.target.title.value;
      let writer = event.target.writer.value;
      let contents = event.target.contents.value;

      // 3개의 폼값을 부모로 전달하여 쓰기처리 한다.
      props.writeAction(title, writer, contents);
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
            <td><textarea name="contents" rows="3"></textarea></td>
          </tr>
        </tbody>
      </table>
      <input type="submit" value="전송"/>
      </form>
    </article>
  </>); 
}
export default ArticleWrite;