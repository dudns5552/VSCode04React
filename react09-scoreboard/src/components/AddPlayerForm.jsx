import { useRef } from "react";

/* 
일반적으로 컴포넌트 선언과 export default는 따로 진행하지만
아래와 같이 선언과 동시에 export 할 수 있다.
*/
export default function AddPlayerForm(props) {

  // input 요소에 접근하기 위한 ref를 생성
  const playerInputRef = useRef();
  
  return (<>
    <form className="form" noValidate
      onSubmit={(e) => {
        // '제출' 이벤트가 발생되면 폼값을 읽어온다.
        e.preventDefault();
        let playerName = e.target.player.value;

        // // 방법1 : 순수 JS를 사용
        // if(playerName === ''){
        //   // 입력된 이름이 없다면 경고창을 띄움
        //   alert("이름을 입력해주세요");
        //   // 입력을 위해 포커스 이동
        //   e.target.player.focus();
        //   // 실행 중지
        //   return;
        // }

        // 방법2 : useRef 훅 사용
        // useRef를 통해 input 요소의 현재 값에 접근
        const playerName2 = playerInputRef.current.value;
        if(playerName2 == ''){
          alert("플레이어 이름을 입력하세요.")
          playerInputRef.current.focus();
          return;
        }

        // 부모에서 전달받은 함수를 호출하여 플레이어 추가
        props.onAddPlayer(playerName);
        // 다음 선수 입력을 위해 입력란을 비워준다.
        e.target.player.value = '';
      }}>
      {/* 위에서 생성한 ref변수를 추가한다. */}
      <input type="text" name="player" minLength="10" className="input" 
        placeholder="이름을 추가하세요" required onChange={()=>{}}
        ref={playerInputRef} />
      {/* '선수추가' 경고창은 제거합니다. */}
      <input type="submit" className="input" value="Add Player" />
    </form>
  </>);
}