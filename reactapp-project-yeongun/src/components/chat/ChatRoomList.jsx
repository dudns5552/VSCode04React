// ChatRoomList.jsx
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

function ChatRoomList({ userId }) {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const db = getDatabase();
    const roomRef = ref(db, 'chatRooms');

    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const roomList = Object.entries(data).map(([roomId, messages]) => {
          const messageArray = Object.values(messages);
          const lastMessage = messageArray[messageArray.length - 1];
          return { roomId, lastMessage };
        });
        setRooms(roomList);
      }
    });
  }, []);

  const enterChatRoom = (roomId) => {
    navigate(`/chat/talk?roomId=${roomId}&userId=${userId}`);
  };

  return (
    <div className="room-list">
      {/* 제목은 고정 */}
      <h3 className="room-list-title">📃 기존 채팅방 목록</h3>

      {/* 스크롤 영역 */}
      <div className="room-scroll-box">
        {rooms.length === 0 ? (
          <p className="empty-msg">채팅방이 없습니다.</p>
        ) : (
          <ul className="room-ul">
            {rooms.map(({ roomId, lastMessage }) => (
              <li key={roomId} className="room-item" onDoubleClick={()=>{enterChatRoom(roomId)}}>
                <div className="room-name">🗂 {roomId}</div>
                <div className="last-msg">💬 {lastMessage?.text || '메세지 없음'}</div>
                <div className='btn-area'>
                  <button onClick={() => enterChatRoom(roomId)} className="btn-gray">
                    입장하기
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ChatRoomList;
