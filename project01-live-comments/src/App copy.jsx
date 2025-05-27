import { useState } from "react";

function App() {

  const [cData, setCData] = useState([
    {no: 1, writer: '작성자명', date: '2025-03-22 14:30', text: '댓글은 여기에 출력됩니다. 줄바꿈 처리도 해주세요. <br> 댓글 작성과 수정은 모달창을 이용하면 됩니다.'},
  ]);

  const [sN, setSN] = useState(2);

  return (<>
    <div className="App">

    </div>
  </>); 
}
export default App;