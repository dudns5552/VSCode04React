// ChatMessage.jsx

// Firebase 관련 import
import { realtime, storage } from '../../firebaseConfig';
import {
  ref as dbRef,
  child,
  set,
  onValue,
  push,
} from 'firebase/database';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

// React 및 기타 훅
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

// 🔽 스크롤 최하단 함수
const scrollTop = (chatWindow) => {
  if (chatWindow) {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
};

// 🔽 현재 날짜와 시간 반환 함수
const nowDate = () => {
  const dateObj = new Date();
  const year = dateObj.getFullYear();
  const month = ("0" + (1 + dateObj.getMonth())).slice(-2);
  const day = ("0" + dateObj.getDate()).slice(-2);
  const hour = ("0" + dateObj.getHours()).slice(-2);
  const minute = ("0" + dateObj.getMinutes()).slice(-2);

  return {
    date: `${year}.${month}.${day}`,
    time: `${hour}:${minute}`,
  };
};

// 🔽 채팅 컴포넌트 시작
function ChatMessage() {
  // 상태 정의
  const [uploadFiles, setUploadFiles] = useState([]); // 업로드할 실제 파일들
  const [filesPreview, setFilesPreview] = useState([]); // 미리보기용 { file, preview }

  const [chatData, setChatData] = useState([]);
  const [searchParams] = useSearchParams();
  const chatWindow = useRef(null);

  const roomId = searchParams.get('roomId');
  const userId = searchParams.get('userId');

  // ➕ 채팅 전송 함수 (Firebase Realtime DB 저장)
  async function sendMessage(message, uploadFilesSet) {
    const { date, time } = nowDate();
    const newKey = push(child(dbRef(realtime), 'temp')).key;

    await set(dbRef(realtime, `${roomId}/${newKey}`), {
      id: userId,
      message,
      date,
      time,
      files: uploadFilesSet,
    });
  }

  // 🔽 채팅 불러오기 리스너
  useEffect(() => {
    if (!roomId || !userId) return;

    const refPath = dbRef(realtime, roomId);
    onValue(refPath, (snapshot) => {
      const today = nowDate().date;
      const chatList = [];

      snapshot.forEach((child) => {
        const data = child.val();
        const isMine = data.id === userId;
        const isToday = data.date === today;

        chatList.push(
          <div
            key={child.key}
            className={isMine ? 'myMsg' : 'otherMsg'}
            style={{ textAlign: isMine ? 'right' : 'left', marginBottom: '10px' }}
          >
            <div style={{ fontSize: '10px', color: 'gray' }}>
              {isToday ? data.time : data.date}
            </div>
            {data.files &&
              data.files.map((file) => {
                const ext = file.name.split('.').pop().toLowerCase();
                const isImage = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext);
                return (
                  <div key={file.name}>
                    {isImage ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        style={{ maxWidth: '200px', maxHeight: '150px', border: '1px solid #ccc' }}
                      />
                    ) : (
                      <a href={file.url} target="_blank" rel="noreferrer">
                        {file.name}
                      </a>
                    )}
                  </div>
                );
              })}
            <div>{data.message}</div>
          </div>
        );
      });

      setChatData(chatList);
      setTimeout(() => scrollTop(chatWindow.current), 200);
    });
  }, [roomId, userId]);

  // 🔽 JSX 반환 시작
  return (
    <div className="App">
      <h2>Realtime 채팅</h2>
      대화명: {userId} &nbsp;
      <button onClick={() => window.self.close()}>채팅종료</button>

      {/* // 채팅 내역 표시 영역 시작 */}
      <div id="chatWindow" ref={chatWindow}>
        {chatData}

        {/* // ➕ 파일 미리보기 출력 시작 */}
        {filesPreview.map(({ file, preview }, idx) => {
          const ext = file.name.split('.').pop().toLowerCase();
          const isImage = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext);

          return (
            <div key={file.name} style={{ marginBottom: 10 }}>
              {isImage ? (
                <img src={preview} alt={file.name} style={{ maxWidth: '200px', maxHeight: '150px' }} />
              ) : (
                <a href={preview} target="_blank" rel="noreferrer">
                  {file.name}
                </a>
              )}
              <button
                onClick={() => {
                  const newPreview = filesPreview.filter((_, i) => i !== idx);
                  const newFiles = uploadFiles.filter((_, i) => i !== idx);
                  setFilesPreview(newPreview);
                  setUploadFiles(newFiles);
                }}
              >
                삭제
              </button>
            </div>
          );
        })}
        {/* // 파일 미리보기 출력 끝 */}
      </div>

      {/* // 채팅 입력 폼 시작 */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const message = e.target.message.value.trim();
          if (!message) return alert('메시지를 입력하세요');

          const uploaded = [];
          for (let file of uploadFiles) {
            const filePath = `chat/${roomId}/${Date.now()}_${file.name}`; // 고유 파일명
            const fileRef = storageRef(storage, filePath);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            uploaded.push({ name: file.name, url, path: filePath });
          }

          await sendMessage(message, uploaded);
          e.target.message.value = '';
          setUploadFiles([]);
          setFilesPreview([]);
        }}
      >
        {/* // ➕ 파일 업로드 필드 */}
        <input
          type="file"
          multiple
          onChange={(e) => {
            const newFiles = Array.from(e.target.files);
            const newPreviews = newFiles.map((file) => ({
              file,
              preview: URL.createObjectURL(file),
            }));

            setUploadFiles((prev) => [...prev, ...newFiles]);
            setFilesPreview((prev) => [...prev, ...newPreviews]);
          }}
        />
        <input type="text" name="message" placeholder="메시지 입력" />
        <button type="submit">전송</button>
      </form>
      {/* // 채팅 입력 폼 끝 */}
    </div>
  );
}

export default ChatMessage;
