/*
props(프롭스)
  : React에서 상태를 저장하기 위한 값으로 컴포넌트가 자식 컴포넌트로
  전달하는 읽기전용 데이터를 말한다. 전달시에는 HTML의 속성처럼 
  기술한다.
  형식]
      <컴포넌트 props속성명={전달할값}/>
      -> 이렇게 전달하면 자식 컴포넌트에서는 'props.속성명'과 같이 
        사용할 수 있다.*/ 

/*
컴포넌트로 전달되는 모든 프롭스를 매개변수로 props를 통해 한꺼번에
받는다. 이렇게 받은 값은 객체와 같이 'props.프롭스명'으로 사용할 수
있다.
*/ 
function FrontComp(Props) {
  const liRows = [];

  // 전달받은 값은 배열이므로 반복문을 통해 반복할 수 있다.
  for(let i=0 ; i < Props.propData1.length ; i++) {
    /* 반복하면서 빈 배열에 li태그를 순차적으로 추가한다. push() 함수는
    배열의 끝에 요소를 추가하는 기능을 가지고 있다. */
    liRows.push(
      <li key={i}>{Props.propData1[i]}</li>
    );
  }

  /*
  앞에서 li태그가 추가된 배열 변수를 UI에 삽입한다. 이 부분에 있는
  내용이 화면에 렌더링된다. */ 
  return (<>
  <li>프론트앤드-{Props.aTemp}</li>
  <ul>
    {liRows}
  </ul>
  </>)
}

/*
React에서는 게시판의 목록과 같이 반복적으로 출력되는 항목에
unique한 key라는 이름의 prop을 추가하도록 권고하고 있다.
따라서 위와 같이 배열의 인덱스나 중복되지 않는 일련번호등을
부여해야한다. 그렇지 않으면 Warning이 발생된다.
*/ 





/*
전달되는 인수를 매개변수에서 바로 구조분해하여 필요한 프롭스만 직접
추출하는 방식을 사용한다. 프롭스명을 자식 컴포넌트에서 그대로 사용할
수 있다. 단, 전달되는 갯수만큼 매개변수를 추가해야 한다.
*/ 
const BackComp = ({propData2, bTemp}) => {
  const liRows = [];

  let keyCnt = 0;
  // for~of 문을 사용해서 배열변수에 li태그를 추가한다.
  for(let row of propData2) {
    liRows.push(
      <li key={keyCnt++}>{row}</li>
    );
  }
  return (<>
    <li>백앤드-{bTemp}</li>
    <ul>
      {liRows}
    </ul>
  </>)
}




function App() {
  // props로 사용할 배열 변수 선언
  const frontData = ['HTML5', 'CSS3', 'Javascript', 'jQuery', 'React추가'];
  const backData = ['Java', 'Oracle', 'JSP', 'Spring Boot', 'Nextjs추가'];

  return (<>
    <div>
      <h2>React - Props 전달하기</h2>
      <ol>
        {/* 배열 데이터를 자식 컴포넌트로 props를 통해 전달한다. 프롭스는
         HTML의 속성을 명시하듯 기술하면 된다. */}
        <FrontComp propData1={frontData} aTemp={100}></FrontComp>
        <BackComp propData2={backData} bTemp={100}/>
      </ol>
    </div>
  </>);
}

export default App
