// ChatMessage.jsx

import React, { useEffect, useRef, useState } from 'react';
//  URL 쿼리 파라미터 추출과 페이지 이동을 위한 훅
import { useSearchParams, useNavigate } from 'react-router-dom';
//  Firebase 실시간 데이터베이스 관련 함수
import { getDatabase, ref, push, onValue } from 'firebase/database';
//  Firebase Storage 관련 함수 (파일 업로드, URL 가져오기)
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage';

function ChatMessage() {
  //  URL 쿼리 파라미터를 가져옴 (roomId, userId)
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get('roomId');
  const userId = searchParams.get('userId');

  //  현재 입력중인 메시지 상태
  const [message, setMessage] = useState('');
  //  채팅 메시지 목록 상태
  const [messages, setMessages] = useState([]);
  //  업로드할 파일 상태
  const [file, setFile] = useState(null);
  //  이미지 미리보기용 URL 상태
  const [filePreview, setFilePreview] = useState(null);

  //  메시지 리스트의 스크롤을 맨 아래로 내리기 위한 ref
  const messagesEndRef = useRef(null);

  //  roomId가 바뀔 때마다 Firebase DB에서 해당 채팅방 메시지 실시간 구독 설정
  useEffect(() => {
    const db = getDatabase();
    //  특정 채팅방 경로 참조
    const chatRef = ref(db, `chatRooms/${roomId}`);
    //  채팅방 데이터가 바뀔 때마다 콜백 실행
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        //  메시지 객체들을 배열로 변환 후 timestamp 기준 오름차순 정렬
        const parsed = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
        setMessages(parsed);
      }
    });
  }, [roomId]);

  //  메시지 배열이 업데이트 될 때마다 스크롤을 맨 아래로 내림
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //  스크롤을 맨 아래로 내리는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  //  메시지 전송 함수 (텍스트 혹은 파일 전송 가능)
  const sendMessage = async () => {
    //  메시지도 없고 파일도 없으면 아무 동작 안함
    if (!message && !file) return;

    const db = getDatabase();
    //  기본 메시지 객체 생성
    const msg = {
      senderId: userId,
      text: message,
      timestamp: Date.now(),
    };

    if (file) {
      //  파일이 있으면 Firebase Storage에 업로드
      const storage = getStorage();
      //  채팅방별 폴더에 파일명으로 저장
      const fileRef = sRef(storage, `chatFiles/${roomId}/${file.name}`);
      await uploadBytes(fileRef, file);
      //  업로드한 파일 URL을 받아와 메시지에 추가
      const url = await getDownloadURL(fileRef);
      msg.fileUrl = url;
      msg.fileName = file.name;
    }

    //  메시지를 Firebase 실시간 DB에 추가 (push는 고유키 생성)
    await push(ref(db, `chatRooms/${roomId}`), msg);

    //  입력창과 파일 선택 초기화
    setMessage('');
    setFile(null);
    setFilePreview(null);
  };

  //  타임스탬프를 사람 읽기 좋은 형식으로 변환하는 함수
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    //  오늘 날짜인지 확인
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    //  오늘이면 시간 (시:분), 아니면 날짜 출력
    return isToday
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString();
  };

  //  파일 입력 변경 처리 (파일 선택 시 상태 업데이트 및 이미지면 미리보기 URL 생성)
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected && selected.type.startsWith('image/')) {
      setFilePreview(URL.createObjectURL(selected));
    } else {
      setFilePreview(null);
    }
  };

  //  엔터 키 눌렀을 때 메시지 전송 (기본 엔터 줄바꿈 방지)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  //  이미지 미리보기 닫기 처리 (파일 선택 초기화)
  const handleClosePreview = () => {
    setFile(null);
    setFilePreview(null);
  };

  //  채팅방 나가기 처리 - 채팅 시작 페이지로 이동
  const handleLeaveRoom = () => {
    navigate('/chat');
  };

  return (
    <div style={{ position: 'relative', paddingBottom: '3em' }}>
      {/*  현재 채팅방 아이디 표시 */}
      <h3>채팅방: {roomId}</h3>

      {/*  메시지 리스트 영역 - 스크롤 가능, 박스 테두리 */}
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '1em' }}>
        {messages.map((msg, i) => {
          //  메시지 보낸 사람이 현재 유저인지 판단
          const isMine = msg.senderId === userId;
          //  메시지에 첨부된 파일이 이미지인지 확인 (확장자 검사)
          const isImage = msg.fileUrl && msg.fileName?.match(/\.(jpeg|jpg|png|gif|webp)$/i);

          return (
            //  메시지별 div, 본인 메시지는 오른쪽, 타인은 왼쪽 정렬
            <div key={i} style={{ textAlign: isMine ? 'right' : 'left', marginBottom: '1em' }}>
              {/*  타인 메시지는 보낸 사람 아이디 출력 */}
              {!isMine && <strong>{msg.senderId}</strong>}<br />

              {/*  텍스트 메시지가 있으면 출력 */}
              {msg.text && <span>{msg.text}</span>}<br />

              {/*  파일이 첨부된 경우 */}
              {msg.fileUrl && (
                isImage ? (
                  //  이미지면 <img> 태그로 미리보기
                  <div><img src={msg.fileUrl} alt={msg.fileName} style={{ maxWidth: '200px' }} /></div>
                ) : (
                  //  이미지가 아니면 파일 링크 제공 (새 탭에서 열림)
                  <div>📎 <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">{msg.fileName}</a></div>
                )
              )}

              {/*  메시지 전송 시간 표시 (작게, 회색 글씨) */}
              <div style={{ fontSize: '0.8em', color: '#999' }}>{formatTime(msg.timestamp)}</div>
            </div>
          );
        })}
        {/*  메시지 리스트 마지막 위치에 ref 연결해 스크롤 이동 기준으로 사용 */}
        <div ref={messagesEndRef} />
      </div>

      {/*  메시지 입력 영역 */}
      <div style={{ marginTop: '1em' }}>
        {/*  텍스트 입력 */}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="메세지 입력"
          style={{ width: '60%' }}
        />
        {/*  파일 선택 인풋 */}
        <input type="file" onChange={handleFileChange} />
        {/*  보내기 버튼 */}
        <button onClick={sendMessage}>보내기</button>

        {/*  이미지 파일 선택 시 미리보기 영역 */}
        {filePreview && (
          <div style={{ marginTop: '0.5em', position: 'relative', display: 'inline-block' }}>
            <strong>미리보기:</strong><br />
            <img src={filePreview} alt="preview" style={{ maxWidth: '200px' }} />
            {/*  미리보기 닫기 버튼 */}
            <button
              onClick={handleClosePreview}
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                background: 'transparent',
                border: 'none',
                fontSize: '1.2em',
                cursor: 'pointer',
              }}
            >
              ❌
            </button>
          </div>
        )}
      </div>

      {/*  채팅방 나가기 버튼 - 오른쪽 아래 고정 */}
      <button
        onClick={handleLeaveRoom}
        style={{
          position: 'absolute',
          bottom: '0.5em',
          right: '0.5em',
          backgroundColor: '#f44336',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          padding: '0.5em 1em',
          cursor: 'pointer'
        }}
      >
        채팅방 나가기
      </button>
    </div>
  );
}

export default ChatMessage;
