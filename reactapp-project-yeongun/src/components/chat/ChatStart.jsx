import { useRef } from 'react';
import Navi from './Navi';
import { useState } from 'react';

function ChatStart() {

  /* 
  useRef 훅을 통해 변수를 생성하면 current라는 key를 가진 객체를
  반환한다. 즉, { current : 초기값 }과 같은 형태가 된다. 
  */

  // input택의 DOM에 접근하기 위해 useRef로 변수 생성
  // 대화방의 이름(아이디)
  const refRoom = useRef();
  // 접속자의 아이디
  const [chatName, setChatName] = useState();
  const refId = useRef();

  const getChatName = () => {
    const session = sessionStorage.getItem('islogined');
    if (session) {
      return JSON.parse(session).id;
    } else {
      return refId.current?.value || '';  // ❗null 체크
    }
  };
  /* 
  open() 함수를 이용해서 채팅창을 팝업으로 오픈한다.
    형식] open(팝업창의 요청URL, 창의 이름, 창의속성);
      두번째 인수인 '창의이름'에 이름을 부여하면, 새로운 창을 열었을때
      항상 같은 위치에서 열리게된다. 즉, 새로운 창을 열수 없으므로 
      여기서는 '창의이름'을 부여하지 않아야한다.
  */
  const openChatWin = () => {
    /* 
    useRef를 통해 참조한 input의 DOM을 이용해서 입력값을 얻어온다.
    그리고 팝업창을 띄울때 파라미터로 사용한다. 즉, 대화창을 팝업으로
    띄울때 방명과 대화명을 전달해야 한다.
    */
    const room = refRoom.current?.value || 'room1';
    const user = getChatName();

    if (!user) {
      alert('대화명을 입력해주세요!');
      return;
    }

    window.open(`/chat/talk?roomId=${room}&userId=${user}`, '', 'width=500,height=700');
  };

  return (<>
    <div className="App">
      <Navi />
      <h2>Firebase - Realtime Database Chatting</h2>
      {/* input에 앞에서 생성한 Ref변수를 추가하여 DOM에 접근한다.
        이렇게 하면 getElementXX와 같은 함수 없이 쉽게 접근할 수 있다. */}
      {/* 대화방의 ID는 room1로 고정한다. 단 필요하다면 변경하거나
        입력할 수 있다. */}
      방명 : <input type="text" name='roomId' value='room1'
        ref={refRoom} /><br />
      {/* 대화명 입력창은 로그인 상태가 아닌 경우에만 보이게 */}
      {!sessionStorage.getItem('islogined') && (
        <>대화명 : <input type="text" name="userId" ref={refId} /><br /></>
      )}

      {/* 버튼을 누르면 팝업으로 대화창을 오픈한다. */}
      <button onClick={openChatWin}>채팅시작</button>
    </div>
  </>);
}
export default ChatStart;