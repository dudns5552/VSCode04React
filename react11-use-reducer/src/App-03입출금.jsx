import { useReducer, useState } from "react";

// Action객체에서 사용할 값을 상수로 선언
const ActionTypes = {
  depo : 'deposit',
  with : 'withdraw'
}

// 리듀서함수 정의
const myReducer = (nowState, myAction) => {
  // 현재상태와 액션객체를 매개변수로 받음
  console.log('리듀서 함수 호출', nowState, myAction);
  // Action을 분석한 후 입출금 및 잔고조회
  switch (myAction.mode) {
    case ActionTypes.depo:
      return nowState + myAction.amount;
    case ActionTypes.with:
      return nowState - myAction.amount;
    default:
      return nowState;
  }
  // 스테이트 변경후 반환하면 즉시 적용되어 리렌더링 된다.
}

function App() {
  
  // 입출금 금액에 대해 스테이트 선언
  const [number, setNumber] = useState(0);
  // 앞에서 정의한 리듀서 함수를 기반으로 useReducer 객체 생성
  const [money, myDispatch] = useReducer(myReducer, 0);

  return (<>
    <div className="App">
      <h2>useReducer App</h2>
      <p>잔고 : {money}원</p>
      {/* 입출금을 위한 금액은 스핀버튼을 통해 1000원 단위로 증감 */}
      <input type="number" value={number} step={1000} 
        onChange={(e) => {
          setNumber(parseInt(e.target.value));
        }} />

      {/* 앞에서 선언한 상수를 이용해서 Action객체를 완성한 후
      디스패치 함수의 인수로 전달한다. */}
      <button onClick={() => {
        myDispatch({ mode: ActionTypes.depo, amount:number});
      }}>입금</button>
      <button onClick={() => {
        myDispatch({ mode: ActionTypes.with, amount:number });
      }}>출금</button>
    </div>
  </>); 
}
export default App;