// ChatMessage.jsx

// React 및 Firebase 관련 모듈을 import
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// ✅ ChatMessage 컴포넌트 정의 시작
function ChatMessage() {
  // URL의 쿼리 파라미터를 읽기 위해 useSearchParams 사용
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // roomId: 채팅방 ID, userId: 현재 사용자 ID (URL에서 가져옴)
  const roomId = searchParams.get('roomId');
  const userId = searchParams.get('userId');

  // 파일 업로드 input 요소를 제어하기 위한 ref
  const fileInputRef = useRef(null);

  // 메시지 텍스트, 메시지 목록, 업로드할 파일, 파일 미리보기 상태
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // 스크롤을 제어하기 위한 마지막 메시지 ref
  const messagesEndRef = useRef(null);

  // ✅ 메시지 실시간 수신 (Firebase Realtime Database 리스너)
  useEffect(() => {
    const db = getDatabase(); // DB 인스턴스 가져오기
    const chatRef = ref(db, `chatRooms/${roomId}`); // 해당 채팅방의 경로 참조

    // 데이터가 변경될 때마다 호출되는 리스너 등록
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val(); // 전체 메시지 목록
      if (data) {
        // 타임스탬프 기준으로 정렬된 메시지 배열 생성
        const parsed = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
        setMessages(parsed);
      }
    });
  }, [roomId]);

  // ✅ 메시지 목록이 변경되면 자동으로 하단으로 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ 스크롤을 채팅창 하단으로 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ✅ 메시지 전송 함수
  const sendMessage = async () => {
    // 메시지도 파일도 없으면 전송 안 함
    if (!message && !file) return;

    const db = getDatabase();

    // 메시지 객체 생성
    const msg = {
      senderId: userId,
      text: message,
      timestamp: Date.now(),
    };

    // 파일이 있으면 Storage에 업로드하고 다운로드 URL 추가
    if (file) {
      const storage = getStorage();
      const fileRef = sRef(storage, `chatFiles/${roomId}/${file.name}`);
      await uploadBytes(fileRef, file); // 파일 업로드
      const url = await getDownloadURL(fileRef); // URL 가져오기
      msg.fileUrl = url; // 메시지에 파일 URL 포함
      msg.fileName = file.name; // 파일 이름 포함
    }

    // 메시지를 채팅방 경로에 push (실시간으로 반영됨)
    await push(ref(db, `chatRooms/${roomId}`), msg);

    // 입력창, 파일, 미리보기 초기화
    setMessage('');
    setFile(null);
    setFilePreview(null);
  };

  // ✅ 타임스탬프를 보기 좋게 포맷 (오늘이면 시간, 아니면 날짜)
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
    return isToday
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString();
  };

  // ✅ 파일 선택 시 호출됨 (미리보기용 이미지 처리 포함)
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected && selected.type.startsWith('image/')) {
      setFilePreview(URL.createObjectURL(selected));
    } else {
      setFilePreview(null);
    }
  };

  // ✅ Enter 키로 메시지 전송 (Shift+Enter는 줄바꿈)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ✅ 미리보기 닫기 (파일 선택 취소)
  const handleClosePreview = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // ➕ 파일 input 초기화
    }
  };

  // ✅ 채팅방 나가기 버튼 클릭 시 채팅방 목록으로 이동
  const handleLeaveRoom = () => {
    navigate('/chat');
  };

  // ✅ 컴포넌트 렌더링 (JSX 반환)
  return (
    <div className="chat-container">
      <h3>채팅방: {roomId}</h3>

      {/* ✅ 메시지 출력 영역 */}
      <div className="chat-message-list">
        {messages.map((msg, i) => {
          const isMine = msg.senderId === userId; // 내가 보낸 메시지 여부
          const isImage = msg.fileUrl && msg.fileName?.match(/\.(jpeg|jpg|png|gif|webp)$/i); // 이미지 파일 여부

          return (
            <div
              key={i}
              className={`chat-message ${isMine ? 'my-message' : 'other-message'}`} // CSS 클래스 설정
            >
              {!isMine && <strong>{msg.senderId}</strong>}<br />

              {/* 파일 메시지 출력 */}
              {msg.fileUrl && (
                isImage ? (
                  <>
                    <div className="chat-bubble">
                      <img src={msg.fileUrl} alt={msg.fileName} style={{ maxWidth: '200px' }} />
                    </div>
                    <br />
                  </>
                ) : (
                  <>
                    <div className="chat-bubble">
                      📎 <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">{msg.fileName}</a>
                    </div>
                    <br />
                  </>
                )
              )}

              {/* 텍스트 메시지 출력 */}
              {msg.text && <div className="chat-bubble">{msg.text}</div>}
              <div className="chat-time">{formatTime(msg.timestamp)}</div>
            </div>
          );
        })}

        {/* ✅ 스크롤을 위한 참조점 */}
        <div ref={messagesEndRef} />
      </div>

      {/* ✅ 메시지 입력창 영역 시작 */}
      <div className="chat-input">
        {/* 입력창과 전송 버튼을 수평 배치 */}
        <div className="chat-input-row">
          <textarea
            className="chat-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="메세지 입력"
            rows={2}
          />
          <button className="send-button" onClick={sendMessage}>보내기</button>
        </div>

        {/* 파일 선택과 나가기 버튼 */}
        <div className="chat-controls">
          <input type="file" onChange={handleFileChange} ref={fileInputRef} />
          <button className="leave-button" onClick={handleLeaveRoom}>채팅방 나가기</button>
        </div>

        {/* 이미지 파일 미리보기 표시 */}
        {filePreview && (
          <div className="file-preview">
            <strong>미리보기:</strong><br />
            <img src={filePreview} alt="preview" />
            <button className="close-preview" onClick={handleClosePreview}>❌</button>
          </div>
        )}
      </div>
      {/* ✅ 메시지 입력창 영역 끝 */}
    </div>
  );
}

export default ChatMessage; // 컴포넌트 외부 사용 가능하게 export
