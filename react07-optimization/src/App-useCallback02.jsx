import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";

// Box 컴포넌트 정의 프롭스로 받은 스타일을 div에 적용한다.
const Box = ({ createBoxStyle }) => {
  
  // 스테이트 생성
  const [style, setStyle] = useState({});

  // 프롭스로 받은 createBoxStyle 함수가 변경될때마다 호출되도록 정의
  useEffect(() => {
    console.log('박스 키우기');
    // 함수의 반환값으로 스테이트 변경
    setStyle(createBoxStyle());
  }, [createBoxStyle]);

  // div 박스를 렌더링 한다.
  return <div style={style}></div>
} 

function App() {

  // 박스와 배경색 설정을 위한 스테이트
  const [size, setSize] = useState(100);
  const [isDark, setIsDark] = useState(false);

  // 스타일 반환을 위한 함수 선언
  /* 
  Step1 : App컴포넌트가 렌덜이 될때마다 새로운 참조값이 부여된다. 따라서
    테마변경을 눌러도 이와 상관없는 '박스키우기'가 출력된다.
  */
  // const createBoxStyle = () => {
  //   return {
  //     backgroundColor : 'pink',
  //     width : `${size}px`,
  //     height : `${size}px`,
  //   };
  // }


  /* 
  Step2 : useCallback을 함수에 적용한다. size가 변경될때만 새롭게 함수를
    메모이제이션하므로 애플리케이션의 성능이 향상된다.
  */
  const createBoxStyle = useCallback (() => {
    return {
      backgroundColor : 'pink',
      width : `${size}px`,
      height : `${size}px`,
    };
  }, [size]);


  return (<>
    {/* div박스의 배경색이 isDark에 따라 black/white로 변경된다. */}
    <div className="App" style={{
      background : isDark ? 'black' : 'white',
    }}>
      <h2>useCallback()</h2>
      {/* 스핀버튼으로 증감시킨 값이 size를 변경하고, 새롭게 렌더링한다. */}
      <input type="number" value={size} step={5}
        onChange={(e) => setSize(e.target.value)} />
      
      {/* 버튼을 누를때마다 배경색이 변경된다. */}
      <button onClick={() => setIsDark(!isDark)}>테마변경</button>
      {/* Style을 반환하는 함수를 프롭스로 전달한다. */}
      <Box createBoxStyle={createBoxStyle} />
    </div>
  </>);
}

export default App;
