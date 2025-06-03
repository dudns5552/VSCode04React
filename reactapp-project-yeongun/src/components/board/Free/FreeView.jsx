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

  // 게시글 데이터 저장
  const [viewData, setViewData] = useState(null);

  // 이전 다음글 인덱스 저장
  const [prevIdx, setPrevIdx] = useState(null);
  const [nextIdx, setNextIdx] = useState(null);

  // 화면이동을 위한 내비게이트
  const navigate = useNavigate();

  // 인덱스 저장
  const { idx } = useParams();
  const viewIdx = Number(idx);

  // 게시글의 글쓴이인지 확인하기
  const [isRight, setIsRight] = useState(false);

  useEffect(() => {
    const getView = async () => {
      try {
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
        const wdate = currentPost.writeDate?.split('/');
        currentPost.writeDate = `${wdate[0]} ${wdate[1]}`;
        setViewData(currentPost);

        const nextQuery = query(
          collection(firestore, 'freeBoard'),
          where('idx', '>', viewIdx),
          orderBy('idx'),
          limit(1)
        );
        const nextSnap = await getDocs(nextQuery);
        setNextIdx(!nextSnap.empty ? nextSnap.docs[0].data().idx : null);

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
    <div className="freeview-container">
      <header className="freeview-header">자유게시판</header>

      <nav className="freeview-nav">
        <Link to="/free/list" className="btn">목록</Link>
        {isRight && (
          <>
            <Link to={`/free/edit/${viewIdx}`} className="btn">수정</Link>
            <button onClick={() => {
              if (confirm("정말 삭제하시겠습니까?")) deleteData();
            }} className="btn">삭제</button>
          </>
        )}
      </nav>

      <article className="freeview-article">
        <h2 className="freeview-title">{viewData.title}</h2>
        <div className="freeview-info">
          <span>작성자: <strong>{viewData.writer}</strong></span>
          <span className="indent-right">작성일: {viewData.writeDate}</span>
        </div>


        <div className="freeview-content">{viewData.contents}</div>
      </article>

      <footer className="freeview-footer">
        {prevIdx ? (
          <Link to={`/free/view/${prevIdx}`} className="nav-link">이전글</Link>
        ) : <div></div>}

        {nextIdx ? (
          <Link to={`/free/view/${nextIdx}`} className="nav-link">다음글</Link>
        ) : <div></div>}
      </footer>
    </div>
  );
}

export default FreeView;
