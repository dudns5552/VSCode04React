// ChatStart.jsx
import React, { useState, useEffect } from 'react';
import ChatRoomList from './ChatRoomList';
import { useNavigate } from 'react-router-dom';

function ChatStart() {
  const [chatName, setChatName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const navigate = useNavigate();

  // 대화명 또는 로그인 상태 확인
  useEffect(() => {
    const session = sessionStorage.getItem('islogined');
    if (session) {
      setIsNameSet(true);
    } else if (chatName) {
      setIsNameSet(true);
    }
  }, [chatName]);

  // 대화명 가져오기
  const getChatName = () => {
    const session = sessionStorage.getItem('islogined');
    return session ? JSON.parse(session).id : chatName;
  };

  // 👉 대화명 정하기
  const handleSetNameClick = () => {
    const input = prompt('대화명을 입력하세요');
    if (input && input.trim()) {
      setChatName(input.trim());
    }
  };

  // 👉 새 채팅 시작
  const handleNewChatClick = () => {
    const roomName = prompt('채팅방 이름을 입력하세요');
    const user = getChatName();

    if (!user) {
      alert('먼저 대화명을 설정하세요.');
      return;
    }

    if (!roomName || !roomName.trim()) {
      alert('방 이름을 입력해야 합니다.');
      return;
    }

    navigate(`/chat/talk?roomId=${roomName.trim()}&userId=${user}`);
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">이슬 talk talk</h2>

      {/* 로그인되지 않았고 대화명이 없는 경우에만 대화명 정하기 표시 */}
      {!isNameSet && (
        <div className="btn-area">
          <button onClick={handleSetNameClick} className="primary-btn">
            대화명 정하기
          </button>
        </div>
      )}

      {/* 대화명이 정해지거나 로그인 상태면 새 채팅 표시 */}
      {isNameSet && (
        <div className="btn-area">
          <button onClick={handleNewChatClick} className="primary-btn">
            + 새 채팅
          </button>
        </div>
      )}

      <hr className="divider" />
      <ChatRoomList userId={getChatName()} />
    </div>
  );
}

export default ChatStart;
