/*
이벤트 처리
HTML에서는 이벤트 리스너를 작성할때 대소문자를 구분하지 않는다.
하지만 React에서는 이벤트명의 첫글자를 반드시 대문자로 기술해야한다.
또한 이벤트의 자식 콤포넌트가 부모 컴포넌트로 데이터를 전달하는 용도로
사용된다. "></div>*/

function MyBody(Props) {
  const liTag1 = [], liTag2 = [];

  for(let i=0 ; i < Props.propData1.length ; i++) {
    console.log(Props.propData1[i]);
    liTag1.push(
      <li key={i}>{Props.propData1[i]}</li>
    );
  }


  let keyCnt = 0;
  for(let row of Props.propData2){
    liTag2.push(
      <li key={keyCnt++}>{row}</li>
    );
  }

  return (<>
  <ol>
    {/* 첫번째 경고창은 고정된 메세지를 알림창으로 출력한다. 
    props로 전달된 함수를 자식 컴포넌트에서 그대로 사용하는 형식이다. 
    링크를 클릭하면 알림창이 뜨고, 닫으면 화면이 새로고침된다. */}

    <li><a href="/" onClick={() => {Props.onMyAlert1();}}>프론트앤드</a></li>
    <ul>
      {liTag1}
    </ul>
    {/* 이벤트 객체를 통해 화면이 새로고침 되지않도록 요청을 차단한다.
    React는 비동기 방식으로 화면을 전환하므로 화면이 새로고침 되면 
    안된다. 이런 경우 초기화면으로 전환되기 때문이다. */}
    <li><a href="/" onClick={(event) => {
      // 이벤트가 가진 기본 동작을 차단한다.
      event.preventDefault();
      Props.onMyAlert2('백앤드');}
    }>백앤드</a></li>
    <ul>
      {liTag2}
    </ul>
  </ol>
  </>);
}




function App() {
  const myData1 = ['HTML5', 'CSS3', 'Javascript', 'jQuery'];
  const myData2 = ['Java', 'Oracle', 'JSP', 'Spring Boot'];

  return (<>
    <div className="App">
    <h2>React - Event 처리</h2>
    <MyBody propData1={myData1} propData2={myData2}
     /* 함수를 정의하여 자식 컴포넌트로 전달한다. 매개변수가
      없는 형태로 고정된 값을 경고창에 띄운다. */
      onMyAlert1={function() {
        alert('알림창을 띄웁니다.');
      }}
      // 매개변수가 있는 일반 함수를 전달한다.
      onMyAlert2={function(msg) {
        alert(msg);
        // 자식 컴포넌트에서 전달한 데이터가 부모쪽에서 사용된다.
        console.error('전달된데이터', msg);
      }}
      ></MyBody>
    </div>
  </>);
}

export default App
