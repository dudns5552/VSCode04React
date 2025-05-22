import { useState } from "react";

function App() {
  
  // 스테이트 생성
  const [count, setCount] = useState(0);

  // 감소, 증가, 리셋을 위한 함수 생성
  const down = () => {
    setCount(count - 1);
  }

  const up = () => {
    setCount(count - 1);
  }

  const reset = () => {
    setCount(0);
  }

  return (<>
    <div className="App">
      <h2>useRedeucer 훅 사용하기</h2>
      <div>
        <input type="button" value="-" onClick={down} />
        <input type="button" value="0" onClick={reset} />
        <input type="button" value="+" onClick={up} />
        <span>{count}</span>
      </div>
    </div>
  </>); 
}
export default App;