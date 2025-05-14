


// 상태관리를 위한 useState 훅 임포트
import { useState } from "react";

/*
모듈화 한 컴포넌트를 임포트한다. 경로와 파일명까지만 기술하면되고
확장자는 기술하지 않는다. */ 
import ViewComponent from "./component/ViewComponent";
import WriteComponent from "./component/WriteComponent";
import ListComponent from "./component/ListComponent";


function App() {
  /*
  화면전환을 위한 스테이트 변수명은 mode, 초기값은 list, 변경을
  위한 함수는 setMode()로 선언한다. */ 
  const [mode, setMode] = useState('list');

  // 각 컴포넌트를 저장하기 위한 변수
  let contents = '';
  
  // 각 mode에 따라 컴포넌트를 변수에 할당
  if(mode === "view"){
    /*
    mode를 변경하기 위한 함수를 정의한 후 changeMode라는 이름으로
    프롭스를 전달한다. 자식컴포넌트에서는 이 함수를 받아서 
    'props.프롭스명' 형태로 호출하여 스테이트를 변경한다. 그러면
    화면은 새롭게 렌더링 된다.
    */ 
    contents = <ViewComponent changeMode={(pmode) => {setMode(pmode)}}>
    </ViewComponent>;
  }
  else if(mode === "write") {
    contents = <WriteComponent changeMode={(pmode) => {setMode(pmode)}}>
    </WriteComponent>;
  }
  else {
    contents = <ListComponent changeMode={(pmode) => {setMode(pmode)}}>
    </ListComponent>;
  }


  // 최종적으로 컴포넌트를 렌더링한다.
  return (<>
    <div className="App">
      <h2>React - 모듈화</h2>
      {contents}
    </div>
  </>);
}

export default App
