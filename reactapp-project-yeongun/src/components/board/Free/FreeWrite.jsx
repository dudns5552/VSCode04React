import { collection, getDocs, limit, orderBy, query, addDoc } from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { firestore } from "../../../firebaseConfig";

function FreeWrite() {
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const navigate = useNavigate();

  // 로그인된 사용자 ID 가져오기
  const id = JSON.parse(sessionStorage.getItem('islogined')).id;

  // 현재 날짜 문자열 반환
  const nowDate = () => {
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = ("0" + (1 + dateObj.getMonth())).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const hour = ("0" + dateObj.getHours()).slice(-2);
    const mi = ("0" + dateObj.getMinutes()).slice(-2);
    return `${year}.${month}.${day}/${hour}:${mi}`;
  };

  // 인덱스 자동 증가
  const getNewIdx = async () => {
    const idxRef = collection(firestore, 'freeBoard');
    const q = query(idxRef, orderBy('idx', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const maxIdx = querySnapshot.docs[0].data().idx;
      return maxIdx + 1;
    } else {
      return 1;
    }
  };

  // Firestore에 문서 추가
  const write = async (collectionName, data) => {
    await addDoc(collection(firestore, collectionName), data);
    console.log('입력 성공');
    navigate('/free/list');
  };

  return (
    <div className="free-board-container">
      <header className="freeview-header">
        <h2 className="board-title">자유게시판</h2>
      </header>
      <nav>
        <Link to="/free/list" className="nav-link tar">목록</Link>
      </nav>
      <article className="write-article">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (title.trim() === '') {
              alert('제목을 입력해주세요.');
              return;
            }
            if (contents.trim() === '') {
              alert('내용을 입력해주세요.');
              return;
            }
            const newIdx = await getNewIdx();
            const writeDate = nowDate();
            const collectionName = e.target.collection.value;
            const newData = {
              idx: newIdx,
              title: title,
              writer: id,
              writeDate: writeDate,
              contents: contents,
            };
            await write(collectionName, newData);
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
                    rows="10"
                    value={contents}
                    onChange={(e) => setContents(e.target.value)}
                    className="input-contents"
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="btn-area">
            <input type="submit" value="글쓰기" className="submit-btn" />
          </div>
        </form>
      </article>
    </div>
  );
}

export default FreeWrite;
