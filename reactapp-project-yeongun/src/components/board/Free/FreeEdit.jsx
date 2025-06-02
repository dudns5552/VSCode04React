// 자유게시판 수정 페이지
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { firestore } from "../../../firebaseConfig";

function FreeEdit() {
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const { idx } = useParams();
  const viewIdx = Number(idx);

  const [snapshot, setSnapshot] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getView = async () => {
      try {
        const q = query(
          collection(firestore, 'freeBoard'),
          where('idx', '==', viewIdx)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          alert('존재하지 않는 게시글입니다.');
          navigate('/free/list');
          return;
        }

        const doc = querySnapshot.docs[0];
        const data = doc.data();

        setSnapshot(doc.ref);
        setTitle(data.title);
        setContents(data.contents);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      }
    };

    getView();
  }, [viewIdx, navigate]);

  const Edit = async () => {
    try {
      if (!snapshot) {
        alert("문서 참조가 없습니다.");
        return;
      }

      await updateDoc(snapshot, {
        title: title,
        contents: contents
      });

      console.log('입력 성공');
      navigate('/free/list');
    } catch (err) {
      console.error("수정 실패:", err);
    }
  };

  return (
    <>
      <header>
        <h2>자유게시판 - 수정</h2>
      </header>

      <nav>
        <Link to="/free/list" className="nav-link tar">목록</Link>
      </nav>

      <article className="write-article">
        <form onSubmit={(e) => {
            e.preventDefault();
            Edit();
          }}
        >
          <input type="hidden" name="collection" value="freeBoard" />

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
                    name="title"
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
                    name="contents"
                    rows="8"
                    value={contents}
                    onChange={(e) => setContents(e.target.value)}
                    className="input-contents"
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="btn-area">
            <input type="submit" value="전송" className="submit-btn" />
          </div>
        </form>
      </article>
    </>
  );
}

export default FreeEdit;
