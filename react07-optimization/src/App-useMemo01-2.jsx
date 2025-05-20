

// 함수와 컴포넌트의 차이는 jsx문법이 들어가느냐 안들어가느냐의 차이이다.

import { useMemo } from "react";
import { useState } from "react";

const longTimeCalculate = (number) => {
  console.log('시간이 많이 걸리는 계산');
  for(let i=0 ; i<1234567890 ; i++) {}
  return number + 10000;
}

const simpleCalculate = (number) => {
  console.log('금방 끝나는 계산');
  return number + 1;
}

function App() {

  const [longTimeNum, setLongTimeNum] = useState(1);
  const [simpleNumber, setSimpleNumber] = useState(1);

  /* 
  step1 : 렌더링될때마다 2개의 함수는 모두 실행되어 성능에 영향을
    미치게 된다.
  */
  // const longTimeSum = longTimeCalculate(longTimeNum);
  // const simpleSum = simpleCalculate(simpleNumber);

  /* 
  step2 : 시간이 많이 걸리는 함수를 호출한 후 반환되는 값은 useMemo를
    통해 메모이제이션한다. 이 값은 lonTimeNum이 변경될때만 다시 함수를
    호출하므로, short버튼을 눌렀을때는 실행되지 않는다. 즉 렌더링시
    불필요하게 함수가 실행되는 것이 차단되어 성능이 향상된다.
  */
  const longTimeSum = useMemo(() => {
    return longTimeCalculate(longTimeNum);
  }, [longTimeNum]);
  const simpleSum = simpleCalculate(simpleNumber);

  return (<>
    <div className="App">
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
