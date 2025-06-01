// 자료실 게시판 - 글쓰기 페이지
import { collection, getDocs, limit, orderBy, query, addDoc } from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { firestore, storage } from "../../../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function ArchiveWrite() {
  // 📌 상태 정의
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [uploadFiles, setUploadFiles] = useState([]); // 실제 파일 객체 저장
  const [filesPreview, setFilesPreview] = useState([]); // 미리보기 이미지 URL 저장

  const navigate = useNavigate();

  // 📌 로그인된 사용자 ID
  const id = JSON.parse(sessionStorage.getItem('islogined')).id;

  // 📌 현재 날짜 반환 함수
  const nowDate = () => {
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = ("0" + (1 + dateObj.getMonth())).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const hour = ("0" + dateObj.getHours()).slice(-2);
    const mi = ("0" + dateObj.getMinutes()).slice(-2);

    return `${year}.${month}.${day}/${hour}:${mi}`;
  };

  // 📌 글 번호(idx) 자동 증가
  const getNewIdx = async () => {
    const idxRef = collection(firestore, 'archiveBoard');
    const q = query(idxRef, orderBy('idx', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const maxIdx = querySnapshot.docs[0].data().idx;
      return maxIdx + 1;
    } else {
      return 1;
    }
  };

  // 📌 Firestore에 데이터 추가
  const write = async (collectionName, data) => {
    await addDoc(collection(firestore, collectionName), data);
    console.log('입력 성공');
    navigate('/archive/list');
  };

  // 📌 firebase storage 참조 확인용
  const storageRef = ref(storage, 'board/archive/');
  console.log('storageRef', storageRef);

  return (
    <>
      <header>
        <h2>자료게시판 - 작성</h2>
      </header>
      <nav>
        <Link to="/archive/list">목록</Link>
      </nav>

      <article>
        {/* 🔽 글쓰기 폼 시작 */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            if (title.trim() === '') { alert('제목을 입력해주세요.'); return; }
            if (contents.trim() === '') { alert('내용을 입력해주세요.'); return; }

            const newIdx = await getNewIdx();
            const writeDate = nowDate();
            const collectionName = e.target.collection.value;

            // 🔽 업로드할 파일 정보 저장용
            const uploadFilesSet = [];

            // 🔽 파일 storage 업로드 및 URL 수집
            for (let file of uploadFiles) {
              const filePath = `board/archive/${newIdx}/${file.name}`;
              const fileRef = ref(storage, filePath);
              await uploadBytes(fileRef, file);
              const downloadURL = await getDownloadURL(fileRef);
              uploadFilesSet.push({
                name: file.name,
                url: downloadURL,
                path: filePath,
              });
            }

            // 🔽 최종 저장 객체
            const newData = {
              idx: newIdx,
              title: title,
              writer: id,
              writeDate: writeDate,
              contents: contents,
              files: uploadFilesSet,
            };

            await write(collectionName, newData);

            // 🔽 상태 초기화
            e.target.myfile.value = '';
            setUploadFiles([]);
            setFilesPreview([]);
            setTitle('');
            setContents('');
          }}
        >
          {/* 🔽 컬렉션 이름 */}
          <input type="hidden" name="collection" value="archiveBoard" />

          {/* 🔽 글 입력 폼 */}
          <table id="boardTable">
            <colgroup>
              <col width="30%" />
              <col width="*" />
            </colgroup>
            <tbody>
              <tr>
                <th>제목</th>
                <td>
                  <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <th>내용</th>
                <td>
                  <textarea
                    name="contents"
                    cols="22"
                    rows="8"
                    value={contents}
                    onChange={(e) => setContents(e.target.value)}
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>

          {/* // 파일 업로드 기능 시작 */}
          {/* ✏️ 파일 선택 시 기존 파일 추가되도록 변경 */}
          <input
            type="file"
            name="myfile"
            multiple
            onChange={(e) => {
              const newFiles = Array.from(e.target.files); // 새로 선택한 파일들
              
              // ➕ 기존 상태에 새 파일들 추가
              const updatedUploadFiles = [...uploadFiles, ...newFiles];
              setUploadFiles(updatedUploadFiles);

              // ➕ 새 프리뷰 추가
              const newPreviewArr = newFiles.map(file => ({
                file,
                preview: URL.createObjectURL(file),
              }));
              setFilesPreview(prev => [...prev, ...newPreviewArr]);
            }}
          />
          {/* // 파일 업로드 기능 끝 */}

          {/* // 파일 미리보기 출력 시작 */}
          {filesPreview.map(({ file, preview }, delIdx) => {
            const extension = file.name.split('.').pop().toLowerCase();
            const isImage = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(extension);

            return (
              <div key={file.name} style={{ marginBottom: 10 }}>
                {isImage ? (
                  <img
                    src={preview}
                    alt={file.name}
                    style={{ maxWidth: '200px', maxHeight: '150px', border: '1px solid #ccc' }}
                  />
                ) : (
                  <a href={preview} target="_blank" rel="noopener noreferrer">{file.name}</a>
                )}
                <button onClick={() => {
                    // 삭제 처리
                    const newPreviewArr = filesPreview.filter((_, idx) => idx !== delIdx);
                    const newUploadFilesArr = uploadFiles.filter((_, idx) => idx !== delIdx);
                    setFilesPreview(newPreviewArr);
                    setUploadFiles(newUploadFilesArr);
                }}>삭제</button>
              </div>
            );
          })}
          {/* // 파일 미리보기 출력 끝 */}

          <input type="submit" value="전송" />
        </form>
        {/* 🔽 글쓰기 폼 끝 */}
      </article>
    </>
  );
}

export default ArchiveWrite;
