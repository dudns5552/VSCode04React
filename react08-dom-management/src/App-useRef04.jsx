import { useEffect } from "react";
import { useRef } from "react";

function App() {

  // useRef를 통해 상수 생성
  const inputRef = useRef();

  // 화면의 렌더링이 완료된 후 입력상자로 포커스를 이동
  useEffect(() => {
    console.log(inputRef);
    inputRef.current.focus();
  }, []);

  // 함수 정의
  const login = () => {
    // input의 DOM에 접근해서 value를 읽어옴
    alert(`환영합니다. ${inputRef.current.value}`);
    // 빈값을 할당
    inputRef.current.value = '';
    // 포커스를 이동
    inputRef.current.focus();
  }

  return (<>
    <div className="App">
      <input type="text" placeholder="아이디" ref={inputRef} />
      <button onClick={login}>로그인</button>
    </div>
  </>);
}
export default App;
