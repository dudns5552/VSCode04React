// ChatStart.jsx

import React, { useState } from 'react';
import ChatRoomList from './ChatRoomList';
import { useNavigate } from 'react-router-dom';

function ChatStart() {
  //  새 채팅방 이름 상태 관리 (입력한 방명)
  const [newRoomName, setNewRoomName] = useState('');

  //  새 채팅방 입력창 표시 여부 상태 (처음엔 숨김)
  const [showInput, setShowInput] = useState(false);

  //  로그인 안 했을 때 사용자가 입력하는 대화명 상태
  const [chatName, setChatName] = useState('');

  //  페이지 이동을 위한 react-router-dom 훅
  const navigate = useNavigate();

  //  현재 사용자 대화명을 반환하는 함수
  //  로그인 상태면 세션에서 id를 꺼내고, 아니면 chatName 상태값 사용
  const getChatName = () => {
    const session = sessionStorage.getItem('islogined');
    return session ? JSON.parse(session).id : chatName;
  };

  //  [새 채팅] 버튼 클릭 시 입력창 보이도록 상태 변경
  const handleNewChatClick = () => {
    setShowInput(true);
  };

  //  새 채팅 시작 버튼 클릭 시 실행
  //  사용자 대화명과 방명이 모두 있으면 채팅 페이지로 이동
  //  없으면 경고창 띄움
  const handleStartNewChat = () => {
    const user = getChatName();
    if (!user || !newRoomName) {
      alert('대화명과 방명을 모두 입력하세요.');
      return;
    }
    //  쿼리스트링(roomId, userId)을 붙여서 이동
    navigate(`/chat/talk?roomId=${newRoomName}&userId=${user}`);
  };

  return (
    <div className="App">
      <h2>Firebase - 채팅 시작</h2>

      {/* 
         로그인하지 않은 상태면 대화명 입력란 보여줌 
         로그인했으면 세션에서 아이디를 바로 사용하기 때문에 안 보임
      */}
      {!sessionStorage.getItem('islogined') && (
        <>
          대화명: <input
            type="text"
            name="userId"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
          /><br />
        </>
      )}

      {/* 
         새 채팅 입력창이 보이지 않으면 새 채팅 버튼 표시 
         누르면 입력창이 보이도록 상태 변경됨 
      */}
      {!showInput ? (
        <button onClick={handleNewChatClick}>[새 채팅]</button>
      ) : (
        <>
          {/* 
             새 채팅방 이름 입력란과 채팅 시작 버튼 표시
          */}
          방명: <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          /><br />
          <button onClick={handleStartNewChat}>채팅 시작</button>
        </>
      )}

      <hr />

      {/* 
         기존 채팅방 목록을 보여주는 컴포넌트 
         현재 사용자 대화명(userId)을 prop으로 전달
      */}
      <ChatRoomList userId={getChatName()} />
    </div>
  );
}

export default ChatStart;
