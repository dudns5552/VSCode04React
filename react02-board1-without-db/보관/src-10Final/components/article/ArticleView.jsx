function ArticleView(props) {
  
  console.log('선택한게시물 : ', props.selectRow);
  return (<>
    <article>
      <table id="boardTable">
        <colgroup>
          <col width="20%"/><col width="*" />
        </colgroup>
        <tbody>
          <tr>
            <th>작성자</th>
            <td>{props.selectRow.writer}</td>
          </tr>
          <tr>
            <th>제목</th>
            <td>{props.selectRow.title}</td>
          </tr>
          <tr>
            <th>날짜</th>
            <td>{props.selectRow.date}</td>
          </tr>
          <tr>
            <th>내용1</th>
            {/* JS의 고차함수인 map()을 이용해서 줄바꿈이 된 
            횟수만큼 반복해서 <br>태그로 변경한다. */}
            <td>{props.selectRow.contents.split('\n').
              map((currVal) => {
                console.log(currVal);
                return (<>
                  {/* br태그도 중복적으로 사용되므로 unique한 key
                  prop이 필요하다. */}
                  {currVal} <br key={Math.random()} />
                </>);
              })}</td>
          </tr>
          <tr>
            <th>내용2</th>
            <td style={{'whiteSpace' : 'pre-wrap'}}>
              {props.selectRow.contents}</td>
          </tr>
          <tr>
            <th>내용3</th>
            <td className="contWrap">{props.selectRow.contents}</td>
          </tr>
        </tbody>
      </table>
    </article>
  </>); 
}

export default ArticleView;