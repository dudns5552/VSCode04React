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
      <>
    <header className="freeview-header">자유게시판 - 읽기</header>

    <nav className="freeview-nav">
      <Link to="/free/list" className="btn">목록</Link>
      {isRight && (
        <>
          <Link to={`/free/edit/${viewIdx}`} className="btn btn-blue">수정</Link>
          <button onClick={() => {
            if (confirm("정말 삭제하시겠습니까?")) deleteData();
          }} className="btn btn-red">삭제</button>
        </>
      )}
    </nav>

    <article className="freeview-article">
      <h2 className="freeview-title">{viewData.title}</h2>
      <div className="freeview-info">
        <span>작성자: <strong>{viewData.writer}</strong></span>
        <span>작성일: {viewData.writeDate}</span>
      </div>


      <div className="freeview-content">{viewData.contents}</div>
    </article>

    <footer className="freeview-footer">
      {prevIdx ? (
        <Link to={`/free/view/${prevIdx}`} className="nav-link">&lt; 이전글</Link>
      ) : <div></div>}

      {nextIdx ? (
        <Link to={`/free/view/${nextIdx}`} className="nav-link">다음글 &gt;</Link>
      ) : <div></div>}
    </footer>
  </>
  );
}

export default FreeView;
