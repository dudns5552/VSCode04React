import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useId } from "react";


function App() {



  return (<>
    <div className="App">
      <MyInput1 />
    </div>
  </>);
}

function MyInput1 () {

  // useId와 useRef로 상수 생성
  const myId = useId();
  const myRef = useRef();

  useEffect(() => {
    
    // 순수 JS를 통해 DOM을 얻어온다.
    const button1 = document.getElementById('btn');

    // useRef 훅을 통해서 DOM을 얻어온다.
    const button2 = myRef.current;

    console.log('버튼1', button1);
    console.log('버튼2', button2);
  }, []);

  // JavaScript를 통해 DOM에 스타일을 부여한다.
  function btn1Clicked () {

    const button1 = document.getElementById('btn');

    // 버튼의 배경색을 확인해서 black/white로 토글한다.
    if(button1.style.backgroundColor === 'black') {
      button1.style.backgroundColor = 'white';
      button1.style.color = 'black';
    }
    else{
      button1.style.backgroundColor = 'black';
      button1.style.color = 'white';
    }
  }

  const [btnStyle, setBtnStyle] = useState({
    'backgroundColor' : 'yellow',
    'color' : 'red',
  });

  // 배경색에 따라서 토글한다.
  const btn2Clicked = () => {
    
    if(btnStyle.color === 'red'){
      setBtnStyle({
        'backgroundColor' : 'blue',
        'color' : 'white',
      });
    }
    else{
      setBtnStyle({
        'backgroundColor' : 'yelow',
        'color' : 'red',
      });
    }
  }

  return (
    <div>
      {/* JS를 통해 스타일 설정 */}
      <button id="btn" onClick={btn1Clicked}>버튼1</button>
      {/* React hooks를 통해 스타일 변경 */}
      <button id={myId} ref={myRef} onClick={btn2Clicked}
        style={btnStyle}>버튼2</button>
    </div>
  );
}


export default App;