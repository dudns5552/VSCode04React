/*
JSX에서 스타일을 적용하는 방법
  JSX에서는 HTML과는 조금 다른 방식으로 스타일을 적용한다.
    - class 속성은 className으로 변경한다. JS에서 이미 예약어로
      사용하고 있기 때문이다.
    - id속성은 그대로 사용할 수 있다.
    - style속성을 통해 인라인 방식을 사용할때는 컬리브레이스
      (콧수염괄호)로 JSON객체 형식의 값을 부여해야한다.
 */
function App() {
  // JSON 객체로 스타일 정의
  const mystyle = {
    color: "white",
    backgroundColor: "DodgerBlue",
    padding: "10px",
    fontFamily: "verdana"
  };

  return (<>
  <div className="App"></div>
    <h2>React - Style지정하기</h2>
  <ol>
    {/* style 속성을 인라인 방식으로 부여할때는 컬리브레이스를
    사용한다. */}
    <li style={{color : "red"}}>프론트앤드</li>
    {/* 정의된 객체로 속성을 부여할때는 중괄호 하나만 사용해도
    된다. */}
    <ul style={mystyle}>
      <li>HTML5</li>
      <li>CSS3</li>
      <li>Javascript</li>
      <li>jQuery</li>
    </ul>
    {/* index.css에 정의된 스타일시트 사용 */}
    <li className="backEnd">백앤드</li>
    <ul>
      <li id="backEndSub">Java</li>
      {/* class 속성을 사용하면 에러가 발생하진 않으나 경고가
      발생되므로, 권고사항대로 className을 사용하도록 하자 */}
      <li class="warnings">Oracle</li>
      <li>JSP</li>
      <li>Spring Boot</li>
    </ul>
  </ol>
  </>);
}

export default App;
