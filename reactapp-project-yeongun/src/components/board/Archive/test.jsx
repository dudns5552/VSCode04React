import { collection, getDocs, limit, orderBy, query, addDoc } from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { firestore, storage } from "../../../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function ArchiveWrite() {
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [uploadFiles, setUploadFiles] = useState([]); // 실제 파일 객체 저장
  const [filesPreview, setFilesPreview] = useState([]); // 미리보기 이미지 URL 저장

  const navigate = useNavigate();

  // 로그인된 사용자 ID (세션에서 꺼냄)
  const id = JSON.parse(sessionStorage.getItem('islogined')).id;

  // 현재 날짜 반환 함수
  const nowDate = () => {
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = ("0" + (1 + dateObj.getMonth())).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const hour = ("0" + dateObj.getHours()).slice(-2);
    const mi = ("0" + dateObj.getMinutes()).slice(-2);

    return `${year}.${month}.${day}/${hour}:${mi}`;
  };

  // 글 번호(idx) 자동 증가
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

  // Firestore에 데이터 추가 함수
  const write = async (collectionName, data) => {
    await addDoc(collection(firestore, collectionName), data);
    console.log('입력 성공');
    navigate('/archive/list'); // 글 등록 후 목록 페이지로 이동
  };

  // firebase 스토리지 루트 경로 확인용 (사용되진 않음)
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
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            // 제목과 내용 유효성 검사
            if (title.trim() === '') { alert('제목을 입력해주세요.'); return; }
            if (contents.trim() === '') { alert('내용을 입력해주세요.'); return; }

            const newIdx = await getNewIdx();
            const writeDate = nowDate();
            const collectionName = e.target.collection.value;

            // 🔽 업로드할 파일 정보를 저장할 배열
            const uploadFilesSet = [];

            // 🔽 파일들 firebase storage에 업로드하고 URL 가져오기
            for (let file of uploadFiles) {
              const filePath = `board/archive/${newIdx}/${file.name}`;
              const fileRef = ref(storage, filePath);
              await uploadBytes(fileRef, file); // 파일 업로드
              const downloadURL = await getDownloadURL(fileRef); // URL 추출
              uploadFilesSet.push({
                name: file.name,
                url: downloadURL,
                Path: filePath,
              });
            }

            // 🔽 업로드할 전체 데이터 객체
            const newData = {
              idx: newIdx,
              title: title,
              writer: id,
              writeDate: writeDate,
              contents: contents,
              files: uploadFilesSet,
            };

            await write(collectionName, newData); // firestore 저장

            // 🔽 폼 및 상태 초기화
            e.target.myfile.value = ''; // input[type="file"] 초기화
            setUploadFiles([]);         // 상태에서 파일 리스트 제거
            setFilesPreview([]);        // 프리뷰 이미지도 제거
            setTitle('');               // 제목 초기화
            setContents('');            // 내용 초기화
          }}
        >
          {/* DB에 저장될 collection 이름 */}
          <input type="hidden" name="collection" value="archiveBoard" />

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

          {/* 🔽 파일 선택 버튼 */}
          <input
            type="file"
            name="myfile"
            multiple
            onChange={(e) => {
              const filesArr = Array.from(e.target.files); // FileList를 배열로 변환
              setUploadFiles(filesArr); // 파일 상태에 저장

              // 이미지 미리보기를 위한 URL 생성
              const previewArr = filesArr.map(file => ({
                file,
                preview: URL.createObjectURL(file),
              }));
              setFilesPreview(previewArr); // 프리뷰 상태에 저장
            }}
          />

          {/* 🔽 프리뷰 출력 및 삭제 기능 */}
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
                  <a
                    href={preview}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.name}
                  </a>
                )}
                <button onClick={() => {
                  if (window.confirm('삭제할까요?')) {
                    // 선택 삭제: 프리뷰, 업로드 리스트 둘 다
                    const newPreviewArr = filesPreview.filter((_, idx) => idx !== delIdx);
                    const newUploadFilesArr = uploadFiles.filter((_, idx) => idx !== delIdx);
                    setFilesPreview(newPreviewArr);
                    setUploadFiles(newUploadFilesArr);
                  }
                }}>삭제</button>
              </div>
            );
          })}

          <input type="submit" value="전송" />
        </form>
      </article>
    </>
  );
}

export default ArchiveWrite;
