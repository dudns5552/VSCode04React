// FreeView.js
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
import { Link, useNavigate, useParams } from "react-router-dom";
import { firestore } from "../../../firebaseConfig";
import { useEffect, useState } from "react";

function FreeView() {
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
          collection(firestore, 'freeBoard'),
          where('idx', '==', viewIdx)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          alert('존재하지 않는 게시글입니다.');
          navigate('/free/list');
          return;
        }

        const currentPost = snapshot.docs[0].data();

        // ✅ writeDate: "YYYY.MM.DD/HH:mi/SS:mil" → "YYYY.MM.DD HH:mi"
        const wdate = currentPost.writeDate?.split('/');

        currentPost.writeDate = `${wdate[0]} ${wdate[1]}`;


        setViewData(currentPost);

        // 다음글
        const nextQuery = query(
          collection(firestore, 'freeBoard'),
          where('idx', '>', viewIdx),
          orderBy('idx'),
          limit(1)
        );
        const nextSnap = await getDocs(nextQuery);
        setNextIdx(!nextSnap.empty ? nextSnap.docs[0].data().idx : null);

        // 이전글
        const prevQuery = query(
          collection(firestore, 'freeBoard'),
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

  const deleteData = async () => {
    try {
      const q = query(collection(firestore, 'freeBoard'), where('idx', '==', viewIdx));
      const snapshot = await getDocs(q);
      snapshot.forEach(async (docu) => {
        await deleteDoc(doc(firestore, 'freeBoard', docu.id));
      });
      navigate('/free/list');
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  if (!viewData) return <p>로딩 중...</p>;

  return (
    <>
      <header>
        <h2>게시판-읽기</h2>
      </header>
      <nav>
        <Link to="/free/list">목록</Link>&nbsp;
        {isRight && (
          <>
            <Link to={`/free/edit/${viewIdx}`}>수정</Link>&nbsp;
            <Link to="#" onClick={(e) => {
              e.preventDefault();
              if (confirm("정말 삭제하시겠습니까?")) deleteData();
            }}>
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
              <td>{viewData.writeDate}</td>{/* ✅ 포맷된 날짜 사용 */}
            </tr>
            <tr>
              <th>내용</th>
              <td>{viewData.contents}</td>
            </tr>
          </tbody>
        </table>
      </article>
      <footer>
        <button
          onClick={() => navigate(`/free/view/${prevIdx}`)}
          disabled={prevIdx === null}
        >
          이전글
        </button>
        <button
          onClick={() => navigate(`/free/view/${nextIdx}`)}
          disabled={nextIdx === null}
        >
          다음글
        </button>
      </footer>
    </>
  );
}

export default FreeView;
