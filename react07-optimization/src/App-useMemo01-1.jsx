

// 함수와 컴포넌트의 차이는 jsx문법이 들어가느냐 안들어가느냐의 차이이다.

import { useState } from "react";

/* 
함수형 컴포넌트의 특징
  - 컴포넌트가 렌더링될때 정의된 함수가 실행된다.
  - 이때 함수 내부의 모든 변수가 초기화된다. 즉 렌더링될때마다 컴포넌트
    내부의 모든 코드가 실행되는 구조를 가진다.
*/

// 호출시 시간이 매우 많이 걸리는 로직을 수행하는 함수(API 통신 등)
const longTimeCalculate = (number) => {
  console.log('시간이 많이 걸리는 계산');
  // 12억번 정도 반복하는 for문
  for(let i=0 ; i<1234567890 ; i++) {}
  return number + 10000;
}

// 매우 간단한 로직을 수행하는 함수
const simpleCalculate = (number) => {
  console.log('금방 끝나는 계산');
  return number + 1;
}

function App() {

  // 스테이트 생성
  const [longTimeNum, setLongTimeNum] = useState(1);
  const [simpleNumber, setSimpleNumber] = useState(1);

  /* 
  step1 : App 컴포넌트가 렌더링 되면 아래 2개의 함수를 호출하여 반환된
    값으로 설정된다. 매개변수로는 스테이트가 인수로 전달된다.
  */
  const longTimeSum = longTimeCalculate(longTimeNum);
  const simpleSum = simpleCalculate(simpleNumber);

  return (<>
    <div className="App">


      {/* input 상자의 스핀박스를 누를때마다 핸들러에서 각 setter 함수를
      호출한다. 이 입력값을 통해 스테이트를 변경한다. */}
      <h2>Long Time 계산기</h2>

      <input type="number" value={longTimeNum} 
        onChange={(e) => setLongTimeNum(parseInt(e.target.value))} />
      <span> + 10000 = {longTimeSum}</span>


      <h2>short Time 계산기</h2>

      <input type="number" value={simpleNumber} 
        onChange={(e) => setSimpleNumber(parseInt(e.target.value))} />
      <span> + 1 = {simpleSum}</span>
    </div>
  </>);
}

export default App
