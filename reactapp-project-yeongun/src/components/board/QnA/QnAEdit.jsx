import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { firestore } from "../../../firebaseConfig";

function QnAEdit() {
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
          collection(firestore, 'qnaBoard'),
          where('idx', '==', viewIdx)
        );

        const querySnapshot = await getDocs(q); //

        if (querySnapshot.empty) { 
          alert('존재하지 않는 게시글입니다.');
          navigate('/qna/list');
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

  const edit = async () => {
    try {
      if (!snapshot) {
        alert("문서 참조가 없습니다.");
        return;
      }

      await updateDoc(snapshot, {
        title: title,
        contents: contents
      }); // ✅ 문서 참조를 이용해 updateDoc 수행

      console.log('입력 성공');
      navigate('/qna/list');
    } catch (err) {
      console.error("수정 실패:", err);
    }
  };

  return (
    <>
      <header>
        <h2>Q&A게시판 - 수정</h2>
      </header>
      <nav>
        <Link to="/qna/list">목록</Link>
      </nav>
      <article>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            edit();
          }}
        >
          <input type="hidden" name="collection" value="freeBoard" />
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
          <input type="submit" value="전송" />
        </form>
      </article>
    </>
  );
}

export default QnAEdit;
