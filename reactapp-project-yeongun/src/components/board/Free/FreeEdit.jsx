import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { firestore } from "../../../firebaseConfig";

function FreeEdit() {
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const { idx } = useParams();
  const viewIdx = Number(idx);

  const [snapshot, setSnapshot] = useState(null); // 💡 updateDoc에서 사용할 문서 참조 저장
  const navigate = useNavigate();

  useEffect(() => {
    const getView = async () => {
      try {
        const q = query(
          collection(firestore, 'freeBoard'),
          where('idx', '==', viewIdx)
        );

        const querySnapshot = await getDocs(q); // ✅ getDocs의 결과를 지역 변수에 저장

        if (querySnapshot.empty) { // ✅ .empty를 사용해 게시글 존재 여부 확인
          alert('존재하지 않는 게시글입니다.');
          navigate('/free/list');
          return;
        }

        const doc = querySnapshot.docs[0]; // ✅ 첫 번째 문서 선택
        const data = doc.data();

        setSnapshot(doc.ref); // ✅ 문서 참조(doc.ref)를 상태로 저장하여 updateDoc에 사용
        setTitle(data.title); // ✅ 상태 직접 설정 (currentPost 생략 가능)
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
      }); // ✅ 문서 참조를 이용해 updateDoc 수행

      console.log('입력 성공');
      navigate('/free/list');
    } catch (err) {
      console.error("수정 실패:", err);
    }
  };

  return (
    <>
      <header>
        <h2>게시판 - 수정</h2>
      </header>
      <nav>
        <Link to="/free/list">목록</Link>
      </nav>
      <article>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            Edit();
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

export default FreeEdit;
