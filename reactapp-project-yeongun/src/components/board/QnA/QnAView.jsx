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
import ComWrite from "./mments/ComWrite";
import ComList from "./mments/ComList";

function QnAView() {
  const [viewData, setViewData] = useState(null);
  const [prevIdx, setPrevIdx] = useState(null);
  const [nextIdx, setNextIdx] = useState(null);
  const navigate = useNavigate();
  const { idx } = useParams();
  const viewIdx = Number(idx);
  const [isRight, setIsRight] = useState(false);
  const [docRef, setDocRef] = useState();
  const [comId, setComId] = useState('');
  const [isComState, setIsComState] = useState(false);
  const [islogined, setIslogined] = useState();


  useEffect(() => {
    const getView = async () => {
      try {
        // 현재 게시글 가져오기
        const q = query(
          collection(firestore, 'qnaBoard'),
          where('idx', '==', viewIdx)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          alert('존재하지 않는 게시글입니다.');
          navigate('/qna/list');
          return;
        }

        // 댓글로 넘겨줄 게시판 문서Id
        setDocRef(snapshot.docs[0].ref)


        const currentPost = snapshot.docs[0].data();
        const wdate = currentPost.writeDate?.split('/');

        currentPost.writeDate = `${wdate[0]} ${wdate[1]}`;


        setViewData(currentPost);

        // 다음글
        const nextQuery = query(
          collection(firestore, 'qnaBoard'),
          where('idx', '>', viewIdx),
          orderBy('idx'),
          limit(1)
        );
        const nextSnap = await getDocs(nextQuery);
        setNextIdx(!nextSnap.empty ? nextSnap.docs[0].data().idx : null);

        // 이전글
        const prevQuery = query(
          collection(firestore, 'qnaBoard'),
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

    setIslogined(sessionStorage.getItem('islogined'));
    if (islogined) {
      const compareId = JSON.parse(islogined).id;
      setComId(compareId);
      setIsRight(viewData.writer === compareId);
    }
  }, [viewData, islogined]);

  const deleteData = async () => {
    try {
      const q = query(collection(firestore, 'qnaBoard'), where('idx', '==', viewIdx));
      const snapshot = await getDocs(q);
      snapshot.forEach(async (docu) => {
        await deleteDoc(doc(firestore, 'qnaBoard', docu.id));
      });
      navigate('/qna/list');
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };


  if (!viewData) return <p>로딩 중...</p>;

  return (
    <div className="freeview-container">
      <header className="freeview-header">Q&A게시판</header>
      <nav className="freeview-nav">
        <Link to="/qna/list" className="btn">목록</Link>&nbsp;
        {isRight && (
          <>
            <Link to={`/qna/edit/${viewIdx}`} className="btn">수정</Link>&nbsp;
            <Link to="#" onClick={(e) => {
              e.preventDefault();
              if (confirm("정말 삭제하시겠습니까?")) deleteData();
            }} className="btn">삭제</Link>
          </>
        )}
      </nav>
      <article className="freeview-article">
        <h2 className="freeview-title">{viewData.title}</h2>
        <div className="freeview-info">
          <span>작성자: <strong>{viewData.writer}</strong></span>
          <span className="indent-right">작성일: {viewData.writeDate}</span>
        </div>

        <div className="qna-content">{viewData.contents}</div>
        <div className="container mt-4">
          <button className="btn btn-primary" data-bs-toggle="modal"
            data-bs-target={comId ?"#commentModal" :false}
            onClick={(e) => {
              if (!islogined) {
                alert('댓글 작성은 로그인 후 가능합니다.')
              }
            }}>
            댓글 작성
          </button>
          <ComWrite viewIdx={viewIdx} docRef={docRef}
            isComState={isComState} setIsComState={setIsComState} />
          <ComList viewIdx={viewIdx} docRef={docRef}
            isComState={isComState} setIsComState={setIsComState} />
        </div>
      </article>
      <footer className="freeview-footer">
        {prevIdx ? (
          <Link to={`/free/view/${prevIdx}`} className="nav-link">이전글</Link>
        ) : <div></div>}

        {nextIdx ? (
          <Link to={`/free/view/${nextIdx}`} className="nav-link">다음글</Link>
        ) : <div></div>}
      </footer>
    </div >
  );
}

export default QnAView;