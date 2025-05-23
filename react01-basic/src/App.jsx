import { useState } from 'react'

function App() {

  const [myCount, setMyCount] = useState({cnt : 0});

  const plusMyCount1 = () => {
    // 스테이트 변수 원본을 1 증가 시킨다.
    myCount.cnt += 1; 
    /* 이 경우 참조값의 변화가 없기때문에 값은 변경되지만 화면에
    적용되지 않는다. 즉, 리렌더링 되지 않는다. */
    
    setMyCount(myCount);
    console.log("변경후1", myCount);
  }
  const plusMyCount2 = () => {
    /*  스프레드 연산자를 통해 객체의 복사본을 만든다. 이때 새로운
    참조값이 생성된다. */
    let newMyCount = {...myCount}; 
    // 복사본을 1증가 시킨다.
    newMyCount.cnt += 1;
    /* 증가된 복사본을 통해 스테이트를 변경한다. 이 경우
    참조값이 변화했으므로, 값의 변경이 인식되어 리렌더링 된다. */ 
    setMyCount(newMyCount);
    console.log("변경후2", myCount);
  }
  return (<>
    <div>
      <h2>React-얕은비교</h2>
      <p>Count : { myCount.cnt }</p> 
      <button type='button' onClick={plusMyCount1}>원본증가</button>
      <button type='button' onClick={plusMyCount2}>복사본증가</button>
    </div>
  </>)
}

export default App
