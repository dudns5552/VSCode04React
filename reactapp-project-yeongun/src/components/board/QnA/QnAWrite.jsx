import { collection, getDocs, limit, orderBy, query, addDoc } from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { firestore } from "../../../firebaseConfig";

function QnAWrite() {
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
    // const sec = ("0" + dateObj.getSeconds()).slice(-2);
    // const milSec = dateObj.getMilliseconds();

    return `${year}.${month}.${day}/${hour}:${mi}` // ${sec}:${milSec};
  };

  // 인덱스 자동 증가
  const getNewIdx = async () => {
    const idxRef = collection(firestore, 'qnaBoard');
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
    navigate('/qna/list'); // 작성 후 목록으로 이동
  };

  return (
    <>
      <header>
        <h2>Q&A게시판 - 작성</h2>
      </header>
      <nav>
        <Link to="/qna/list">목록</Link>
      </nav>
      <article>
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
          <input type="hidden" name="collection" value="qnaBoard" />

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

export default QnAWrite;
