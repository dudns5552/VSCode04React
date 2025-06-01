// ArchiveView.js
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { ref, deleteObject } from 'firebase/storage'; // ✏️ ref 추가
import { Link, useNavigate, useParams } from "react-router-dom";
import { firestore, storage } from "../../../firebaseConfig";
import { useEffect, useState } from "react";

function ArchiveView() {
  const [viewData, setViewData] = useState(null);
  const [prevIdx, setPrevIdx] = useState(null);
  const [nextIdx, setNextIdx] = useState(null);
  const navigate = useNavigate();
  const { idx } = useParams();
  const viewIdx = Number(idx);
  const [isRight, setIsRight] = useState(false);

  useEffect(() => {
    const getView = async () => {
      try {
        // 현재 게시글 가져오기
        const q = query(
          collection(firestore, 'archiveBoard'),
          where('idx', '==', viewIdx)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          alert('존재하지 않는 게시글입니다.');
          navigate('/archive/list');
          return;
        }

        const currentPost = snapshot.docs[0].data();

        // ✅ writeDate: "YYYY.MM.DD/HH:mi/SS:mil" → "YYYY.MM.DD HH:mi"
        const wdate = currentPost.writeDate?.split('/');

        currentPost.writeDate = `${wdate[0]} ${wdate[1]}`;

        setViewData(currentPost);

        // 다음글
        const nextQuery = query(
          collection(firestore, 'archiveBoard'),
          where('idx', '>', viewIdx),
          orderBy('idx'),
          limit(1)
        );
        const nextSnap = await getDocs(nextQuery);
        setNextIdx(!nextSnap.empty ? nextSnap.docs[0].data().idx : null);

        // 이전글
        const prevQuery = query(
          collection(firestore, 'archiveBoard'),
          where('idx', '<', viewIdx),
          orderBy('idx', 'desc'),
          limit(1)
        );
        const prevSnap = await getDocs(prevQuery);
        setPrevIdx(!prevSnap.empty ? prevSnap.docs[0].data().idx : null);

      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      }
    };

    getView();
  }, [viewIdx, navigate]);

  useEffect(() => {
    if (!viewData || !viewData.writer) return;

    const islogined = sessionStorage.getItem('islogined');
    if (islogined) {
      const compareId = JSON.parse(islogined).id;
      setIsRight(viewData.writer === compareId);
    }
  }, [viewData]);

  // ➕ 게시글에 연결된 모든 스토리지 파일 삭제 함수
  const deleteFilesFromStorage = async (files) => {
    for (const file of files) {
      try {
        const fileRef = ref(storage, file.path); // ✏️ 파일 경로를 정확히 지정
        await deleteObject(fileRef);
        console.log(`파일 삭제 성공: ${file.name}`);
      } catch (error) {
        console.error(`파일 삭제 실패: ${file.name}`, error);
        // 실패해도 계속 진행하도록 처리 가능
      }
    }
  };

  // 게시글 및 파일 삭제 함수 수정
  const deleteData = async () => {
    try {
      const q = query(collection(firestore, 'archiveBoard'), where('idx', '==', viewIdx));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert('삭제할 게시글이 없습니다.');
        return;
      }

      // Firestore 문서 ID 가져오기
      const docId = snapshot.docs[0].id;
      const docData = snapshot.docs[0].data();

      // 1️⃣ 파일이 있다면 스토리지에서 삭제
      if (docData.files && docData.files.length > 0) {
        await deleteFilesFromStorage(docData.files);
      }

      // 2️⃣ Firestore 문서 삭제
      await deleteDoc(doc(firestore, 'archiveBoard', docId));

      alert('게시글과 첨부파일이 모두 삭제되었습니다.');
      navigate('/archive/list');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  if (!viewData) return <p>로딩 중...</p>;

  return (
    <>
      <header>
        <h2>자료실게시판-읽기</h2>
      </header>
      <nav>
        <Link to="/archive/list">목록</Link>&nbsp;
        {isRight && (
          <>
            <Link to={`/archive/edit/${viewIdx}`}>수정</Link>&nbsp;
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                if (window.confirm("정말 삭제하시겠습니까?")) deleteData();
              }}
            >
              삭제
            </Link>
          </>
        )}
      </nav>
      <article>
        <table id="boardTable">
          <colgroup>
            <col width="30%" />
            <col width="*" />
          </colgroup>
          <tbody>
            <tr>
              <th>작성자</th>
              <td>{viewData.writer}</td>
            </tr>
            <tr>
              <th>제목</th>
              <td>{viewData.title}</td>
            </tr>
            <tr>
              <th>날짜</th>
              <td>{viewData.writeDate}</td>
            </tr>
            <tr>
              <th>내용</th>
              <td>{viewData.contents}</td>
            </tr>
          </tbody>
        </table>
        {viewData.files && viewData.files.map((file) => {
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
            </div>
          );
        })}
      </article>
      <footer>
        <button
          onClick={() => navigate(`/archive/view/${prevIdx}`)}
          disabled={prevIdx === null}
        >
          이전글
        </button>
        <button
          onClick={() => navigate(`/archive/view/${nextIdx}`)}
          disabled={nextIdx === null}
        >
          다음글
        </button>
      </footer>
    </>
  );
}

export default ArchiveView;
