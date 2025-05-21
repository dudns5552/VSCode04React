import { useState } from "react";

export default function EditPlayerForm(props) {

  // 프롭스로 전달받은 선수명을 스테이트로 저장
  const [playerName, setPlayName] = useState(props.playerName);
  
  return (<>
    <form className="form" noValidate
      onSubmit={(e) => {
        e.preventDefault();
        // target속성으로 폼값 받음
        let playerName = e.target.player.value;
        // 수정을 위한 함수 호출(선수의 일련번호, 수정할 선수명)
        props.onEditPlayer(props.playerIdx, playerName);
        // 수정폼을 숨김 처리
        props.setShowEdit(false);
      }}>
        {/* value에 설정된 값은 onChange 리스너를 통해 setter함수를
        호출해서 변경해야한다. */}
      <input type="text" name="player" minLength="10" className="input" 
        placeholder="이름을 추가하세요" required onChange={(e)=>{
          setPlayName(e.target.value);
        }} value={playerName} />
      <input type="submit" className="input" value="Edit" />
    </form>
  </>);
}