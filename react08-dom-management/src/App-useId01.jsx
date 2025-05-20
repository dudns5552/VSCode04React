import { useId } from "react";


function App() {

  /* 
  useId()는 고유한 아이디를 생성할때 사용하는 훅이다. DOM의
  아이디를 부여하거나 라벨리을 할때 편리하다.
  */
  const myId = useId();
  console.log('myId', myId);

  return (<>
    <div className="App">
      <MyInput />
    </div>
  </>);
}

function MyInput () {
  
  const ageId = useId();
  console.log('ageId', ageId);

  /* HTML에서의 label태그는 주로 체크박스나 라디오와 함께 사용된다. 
  label태그의 for속성과 input태그의 id속성이 일치하면 하나의 요소로
  라벨링되어 선택 영역이 보다 넓어지는 효과가 있다.
  단, for는 JavaScript의 예약어이므로 JSX에서는 htmlFor라고 작성해야
  한다. */

  return (<>
    <div>
      {/* HTML속성을 사용해서 연결 */}
      <label htmlFor="name">이름</label>
      <input type="text" id="name" />
      <br />
      {/* useId를 사용해서 연결 */}
      <label htmlFor={ageId}>나이</label>
      <input type="text" id={ageId} />
    </div>
  </>); 
}

export default App;
