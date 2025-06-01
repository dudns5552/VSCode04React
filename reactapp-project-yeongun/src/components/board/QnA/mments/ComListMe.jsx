import { collection, deleteDoc, getDocs, orderBy, query, updateDoc } from "firebase/firestore"; // ✅ deleteDoc 추가
import { useEffect, useState } from "react";
import { firestore } from "../../../../firebaseConfig";


function ComList(props) {

  const [comData, setComData] = useState([]);        // ✅ 전체 댓글 데이터
  const [currPage, setCurrPage] = useState(1);       // ✅ 현재 페이지
  const [rows, setRows] = useState([]);              // ✅ 페이지 나눠진 댓글들
  const [showModal, setShowModal] = useState(false); // ✅ 수정 모달 표시 여부
  const [selectedComment, setSelectedComment] = useState(null); // ✅ 수정할 댓글 데이터

  const editCom = async () => {
    try {
      if (!docId) {
        alert("댓글 참조가 없습니다.")
        return;
      }

      await updateDoc(docId, {
        c_contents: e_contents
      });
    }
    catch (error) {
      console.log('수정 실패', error);
    }
  }

  const deleteCom = async () => {
    try {
      if (!docId) {
        alert("댓글 참조가 없습니다.")
        return;
      }
      await deleteDoc(docId);
      setRendering(!rendering);
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };



  useEffect(() => {
    const getCom = async () => {
      try {
        // 현재 게시글의 댓글 읽어오기
        const q = query(collection(
          firestore, 'qnaBoard', props?.docRef, 'comments'),
          orderBy('idx', 'desc'));
        const querySnapshot = await getDocs(q);

        const coms = querySnapshot.docs.map((doc) => {

          const comm = doc.data();
          setDocId(doc.ref());
          setE_contents(comm.c_contents);

          const dateObj = new Date();
          const year = dateObj.getFullYear();
          const month = ("0" + (1 + dateObj.getMonth())).slice(-2);
          const day = ("0" + dateObj.getDate()).slice(-2);
          const todayStr = `${year}.${month}.${day}`

          const [date, hours] = comm.c_Date.split('/');

          // 여기까진 파이어베이스에 맞게 커스텀 완료

          return (
            <li className="list-group-item" key={comm.idx}>
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  {/* 글쓴이 날짜 */}
                  <strong>{comm.c_writer}</strong>
                  <small className="ms-2">{date === todayStr ? hours : date}</small>
                </div>
                <div>
                  {/* 좋아요 시작 */}
                  {/* <button className="btn btn-outline-success btn-sm" onClick={() => {
                const likesArr = [];
                for (let i = 0; i < props.bData.length; i++) {

                  if (curr.no !== props.bData[i].no) {
                    likesArr.push(props.bData[i]);
                  }
                  else if (curr.no == props.bData[i].no) {
                    curr.likes += 1;
                    likesArr.push(curr);
                  }
                }
                props.setBData(likesArr);
              }
              }>좋아요 ({curr.likes})</button> */}
                  {/* 좋아요 끝 */}
                  {/* 수정부분 시작 */}
                  <button className="btn btn-outline-warning btn-sm" data-bs-target="#commentModal"
                    onClick={() => {

                      return (
                        <div className="modal fade" id="commentModal" tabIndex="-1" aria-labelledby="commentModalLabel" aria-hidden="true" >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <form onSubmit={(e) => {
                                // 제출되는 것을 차단
                                e.preventDefault()
                                editCom();
                              }}>
                                <div className="modal-header">
                                  <h5 className="modal-title" id="commentModalLabel">댓글 수정</h5>
                                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                  {/* 작성자명 수정부분 삭제 */}
                                  {/*  댓글 입력 상자  */}
                                  <label htmlFor="commentContent" className="form-label">댓글 내용</label>
                                  <textarea className="form-control" id="commentContent" rows="3"
                                    name="text" value={e_contents}
                                    onChange={(e) => {
                                      setE_contents(e.target.value);
                                    }} ></textarea>
                                </div>
                                <div className="modal-footer">
                                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
                                  <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" >작성</button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>);
                    }}
                  >수정</button>
                  {/* 수정부분 끝 */}
                  {/* 삭제부분 시작 */}
                  <button className="btn btn-outline-danger btn-sm" onClick={() => {
                    if (window.confirm("정말삭제하시겠습니까?")) {
                      deleteCom();
                    }
                  }}>삭제</button>
                  {/* 삭제부분 끝 */}
                </div>
              </div >
              <p className="mt-2 mb-0">
                {comm.c_contents}
              </p>
            </li >
          );

        });

      }
      catch (error) {
        console.log('댓글 불러오기 실패', error);
      }


      const compaged = [];
      for (let i = 0; i < coms.length; i += 20) {
        compaged.push(coms.slice(i, i + 20));
      }
      setComData(compaged); // 최종 페이징 데이터 저장

    };

    getCom();
  }, [])




  return (<>
    {/* 댓글 목록 출력 */}
    <ul className="list-group mt-3" >
      {comData}
    </ul>
<footer>
  {[1, 2, 3, 4, 5].map(p => (
    <button
      key={p}
      onClick={() => setCumPage(p)}
      style={{
        margin: '0 5px',
        textDecoration: p === currPage ? 'underline' : 'none',
        fontWeight: p === currPage ? 'bold' : 'normal',
        border: 'none',
        background: 'none',
        cursor: 'pointer'
      }}
    >
      {p}
    </button>
  ))}
</footer>
  </>);
}
export default ComList;