// ChatRoomList.jsx

import React, { useEffect, useState } from 'react';
//  Firebase 실시간 데이터베이스 관련 함수들
import { getDatabase, ref, onValue } from 'firebase/database';
//  react-router-dom의 페이지 이동용 훅
import { useNavigate } from 'react-router-dom';

function ChatRoomList({ userId }) {
  //  채팅방 목록을 저장하는 상태 (배열 형태)
  const [rooms, setRooms] = useState([]);

  //  페이지 이동을 위한 navigate 함수
  const navigate = useNavigate();

  //  컴포넌트가 처음 렌더링될 때 실행되는 훅
  useEffect(() => {
    //  Firebase 실시간 데이터베이스 객체 가져오기
    const db = getDatabase();

    //  'chatRooms' 경로에 대한 참조 생성
    const roomRef = ref(db, 'chatRooms');

    //  'chatRooms' 데이터가 바뀔 때마다 실행되는 리스너 등록
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val(); // 현재 'chatRooms' 데이터 전체를 가져옴
      if (data) {
        //  데이터가 있으면 각 채팅방(roomId)과 그 안의 메시지들(messages)을 배열로 변환
        const roomList = Object.entries(data).map(([roomId, messages]) => {
          //  messages 객체 안의 모든 메시지를 배열로 변환
          const messageArray = Object.values(messages);
          //  메시지 배열에서 가장 마지막 메시지를 선택 (최근 메시지)
          const lastMessage = messageArray[messageArray.length - 1];
          //  각 채팅방의 id와 마지막 메시지를 객체 형태로 반환
          return { roomId, lastMessage };
        });
        //  상태에 채팅방 목록 업데이트
        setRooms(roomList);
      }
    });
    //  빈 배열로 의존성 설정해 한 번만 실행되도록 함
  }, []);

  //  채팅방 입장 함수 - 해당 방으로 이동
  const enterChatRoom = (roomId) => {
    navigate(`/chat/talk?roomId=${roomId}&userId=${userId}`);
  };

  return (
    <div>
      <h3>📋 기존 채팅방 목록</h3>
      {/*  채팅방 목록이 없으면 안내 문구 출력 */}
      {rooms.length === 0 ? (
        <p>채팅방이 없습니다.</p>
      ) : (
        //  방 목록이 있으면 리스트 형태로 출력
        <ul>
          {rooms.map(({ roomId, lastMessage }) => (
            <li key={roomId} style={{ marginBottom: '1em' }}>
              {/*  방 이름 출력 */}
              <strong>{roomId}</strong><br />
              {/*  마지막 메시지 내용 출력, 없으면 '메세지 없음' 표시 */}
              마지막 메세지: {lastMessage?.text || '메세지 없음'}<br />
              {/*  입장하기 버튼, 클릭 시 해당 방으로 이동 */}
              <button onClick={() => enterChatRoom(roomId)}>입장하기</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChatRoomList;
