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

    const islogined = sessionStorage.getItem('islogined');
    if (islogined) {
      const compareId = JSON.parse(islogined).id;
      setComId(compareId);
      setIsRight(viewData.writer === compareId);
    }
  }, [viewData]);

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

  const comCheck = async () => {
    if (!comId) {
      alert('댓글 작성은 로그인 가능합니다.')
      return;
    }

  }

  if (!viewData) return <p>로딩 중...</p>;

  return (
    <>
      <header>
        <h2>Q&A게시판-읽기</h2>
      </header>
      <nav>
        <Link to="/qna/list">목록</Link>&nbsp;
        {isRight && (
          <>
            <Link to={`/qna/edit/${viewIdx}`}>수정</Link>&nbsp;
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
              <td>{viewData.writeDate}</td>
            </tr>
            <tr>
              <th>내용</th>
              <td>{viewData.contents}</td>
            </tr>
            {/* 댓글 기능 구현 */}
          </tbody>
        </table>
        <div className="container mt-4">
          <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#commentModal"
            onClick={comCheck}>
            댓글 작성
          </button>
          <ComWrite viewIdx={viewIdx} docRef={docRef} 
            isComState={isComState} setIsComState={setIsComState} />
          <ComList viewIdx={viewIdx} docRef={docRef}
            isComState={isComState} setIsComState={setIsComState} />
        </div>
      </article>
      <footer>
        <button
          onClick={() => navigate(`/qna/view/${prevIdx}`)}
          disabled={prevIdx === null}
        >
          이전글
        </button>
        <button
          onClick={() => navigate(`/qna/view/${nextIdx}`)}
          disabled={nextIdx === null}
        >
          다음글
        </button>
      </footer>
    </>
  );
}

export default QnAView;