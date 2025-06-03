// ArchiveEdit.js
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import {
  ref,
  deleteObject,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { firestore, storage } from "../../../firebaseConfig";

function ArchiveEdit() {
  // 상태 정의 시작
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [viewData, setViewData] = useState(null); // ➕ 게시글 전체 정보 저장
  const [uploadFiles, setUploadFiles] = useState([]); // ➕ 업로드할 파일들
  const [filesPreview, setFilesPreview] = useState([]); // ➕ 업로드할 파일들의 미리보기
  const [renderFlag, setRenderFlag] = useState(false); // ➕ 파일 삭제 후 재렌더링 트리거
  const [snapshot, setSnapshot] = useState(null); // 문서 참조 저장
  // 상태 정의 끝

  const fileInputRef = useRef();

  const navigate = useNavigate();
  const { idx } = useParams();
  const viewIdx = Number(idx);

  // 게시글 불러오기 시작
  useEffect(() => {
    const getView = async () => {
      try {
        const q = query(
          collection(firestore, 'archiveBoard'), // ✏️ 컬렉션명 대소문자 일치
          where('idx', '==', viewIdx)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          alert('존재하지 않는 게시글입니다.');
          navigate('/archive/list');
          return;
        }

        const doc = querySnapshot.docs[0];
        const data = doc.data();
        setSnapshot(doc.ref);
        setViewData(data); // ➕ viewData 저장
        setTitle(data.title);
        setContents(data.contents);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      }
    };

    getView();
  }, [viewIdx, navigate, renderFlag]); // ➕ renderFlag 의존성 추가
  // 게시글 불러오기 끝

  // 게시글 수정 함수 시작
  const Edit = async () => {
    try {
      if (!snapshot) {
        alert("문서 참조가 없습니다.");
        return;
      }

      const newFiles = [];

      // ➕ 새로 추가된 파일들을 스토리지에 업로드
      for (const file of uploadFiles) {
        const storagePath = `board/archive/${file.name}`;
        const fileRef = ref(storage, storagePath);
        await uploadBytes(fileRef, file);
        const fileUrl = await getDownloadURL(fileRef);
        newFiles.push({
          name: file.name,
          url: fileUrl,
          path: storagePath
        });
      }

      // ✏️ 기존 파일에 새 파일 추가 (덮어쓰기 아님)
      const updatedFiles = [...(viewData.files || []), ...newFiles];

      await updateDoc(snapshot, {
        title,
        contents,
        files: updatedFiles
      });

      alert('수정 완료');
      navigate('/archive/list');
    } catch (err) {
      console.error("수정 실패:", err);
    }
  };
  // 게시글 수정 함수 끝

  return (
    <div className="free-board-container">
      <header className="freeview-header">
        <h2 className="board-title">자료게시판 - 수정</h2>
      </header>
      <nav>
        <Link to="/archive/list" className="nav-link tar">목록</Link>
      </nav>
      <article className="write-article">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            Edit();
          }}
        >
          <table className="write-table">
            <colgroup>
              <col width="20%" />
              <col width="*" />
            </colgroup>
            <tbody>
              <tr>
                <th>제목</th>
                <td>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-title"
                  />
                </td>
              </tr>
              <tr>
                <th>내용</th>
                <td>
                  <textarea
                    cols="22"
                    rows="8"
                    value={contents}
                    onChange={(e) => setContents(e.target.value)}
                    className="arc-input-contents"
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>

          {/* 업로드 버튼 시작 */}
          <input
            type="file"
            name="myfile"
            multiple
            ref={fileInputRef}
            onChange={(e) => {
              const filesArr = Array.from(e.target.files);
              const updatedUploadFiles = [...uploadFiles, ...filesArr];
              setUploadFiles(updatedUploadFiles);

              const previewArr = filesArr.map(file => ({
                file,
                preview: URL.createObjectURL(file)
              }));
              setFilesPreview(prev => [...prev, ...previewArr]);
            }}
          />
          {/* 업로드 버튼 끝 */}

          {/* 파일 미리보기 (새로 올린 파일) 시작 */}
          {filesPreview.map(({ preview, file }, index) => {
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

              {/* ➕ 새로 올린 파일 삭제 버튼 */}
              <button
                type="button"
                className="btn btn-red"
                onClick={ () => {
                  console.log('fileInputRef', fileInputRef.current.value);
                  console.log('filespreview', filesPreview[index].name);
                  // 미리보기와 업로드 파일에서 삭제
                  const updatedPreviews = [...filesPreview];
                  const updatedFiles = [...uploadFiles];
                  updatedPreviews.splice(index, 1);
                  updatedFiles.splice(index, 1);
                  setFilesPreview(updatedPreviews);
                  setUploadFiles(updatedFiles);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                ❌
              </button>
            </div>

          )})}

          {/* 파일 미리보기 끝 */}

          {/* 기존 파일 출력 및 삭제 버튼 시작 */}
          {viewData?.files?.map((file) => {
            const extension = file.name.split('.').pop().toLowerCase();
            const isImage = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(extension);
            return (
              <div key={file.name} style={{ marginBottom: 10 }}>
                {isImage ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    style={{ maxWidth: '200px', maxHeight: '150px', border: '1px solid #ccc' }}
                  />
                ) : (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.name}
                  </a>
                )}
                <button className="btn btn-red"
                  type="button"
                  onClick={async () => {
                    if (window.confirm('파일을 삭제하시겠습니까?')) {
                      try {
                        // 1️⃣ Firebase Storage에서 파일 삭제
                        await deleteObject(ref(storage, file.path));
                        console.log('파일 삭제 성공');

                        // 2️⃣ Firestore files 배열에서 해당 파일 제거
                        const newFileList = (viewData?.files || []).filter(
                          (f) => f.path !== file.path
                        );

                        await updateDoc(snapshot, {
                          files: newFileList,
                        });

                        // 3️⃣ 상태 업데이트 → 리렌더링 유도
                        setRenderFlag(!renderFlag);
                      } catch (e) {
                        console.error('파일 삭제 실패:', e);
                      }
                    }
                  }}
                >
                  ❌
                </button>
              </div>
            );
          })}
          {/* 기존 파일 출력 및 삭제 버튼 끝 */}

          <div className="btn-area">
            <input type="submit" value="수정하기" className="submit-btn" />
          </div>
        </form>
      </article>
    </div>
  );
}

export default ArchiveEdit;
