import {
  collection,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../../../../firebaseConfig";

function ComList(props) {
  const [comData, setComData] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  


  //  댓글 수정
  const editCom = async () => {
    try {
      if (!selectedComment) {
        alert("수정할 댓글이 없습니다.");
        return;
      }

      await updateDoc(selectedComment.ref, {
        cContents: selectedComment.cContents,
      });

      setShowModal(false);
      props.setIsComState(!props.isComState);
    } catch (error) {
      console.log("수정 실패", error);
    }
  };

  //  댓글 삭제
  const deleteCom = async (ref) => {
    try {
      await deleteDoc(ref);
      props.setIsComState(!props.isComState);
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  //  댓글 불러오기
  const loadComments = async () => {
    try {
      const q = query(
        collection(props?.docRef, "comments"),
        orderBy("cIdx", "desc")
      );
      const querySnapshot = await getDocs(q);

      const dateObj = new Date();
      const year = dateObj.getFullYear();
      const month = ("0" + (1 + dateObj.getMonth())).slice(-2);
      const day = ("0" + dateObj.getDate()).slice(-2);
      const todayStr = `${year}-${month}-${day}`;

      const comments = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const [date, hours] = data.cDate?.split("/") || ["", ""];

        return {
          cIdx: data.cIdx,
          cWriter: data.cWriter,
          cContents: data.cContents,
          displayDate: date === todayStr ? hours : date,
          ref: doc.ref, //  댓글 문서 참조 추가
        };
      });

      //  페이지 분할 (20개씩)
      const chunked = [];
      for (let i = 0; i < comments.length; i += 20) {
        chunked.push(comments.slice(i, i + 20));
      }

      setComData(comments);
      setRows(chunked);
    } catch (error) {
      console.log("댓글 불러오기 실패", error);
    }
  };

  useEffect(() => {
    loadComments();
  }, [props.isComState]);

  return (
    <>
      {/*  댓글 목록 */}
      <ul className="list-group mt-3">
        {rows.length === 0 ? (
          <div className="text-muted mt-3">댓글이 없습니다.</div>
        ) : (
          rows[currPage - 1]?.map((comm) => (
            <li className="list-group-item" key={comm.cIdx}>
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <strong>{comm.cWriter}</strong>
                  <small className="ms-2">{comm.displayDate}</small>
                </div>
                <div>
                  <button
                    className="btn btn-outline-warning btn-sm me-1"
                    onClick={() => {
                      setSelectedComment({ ...comm });
                      setShowModal(true);
                    }}
                  >
                    수정
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      if (window.confirm("정말 삭제하시겠습니까?")) {
                        deleteCom(comm.ref);
                      }
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
              <p className="mt-2 mb-0">{comm.cContents}</p>
            </li>
          ))
        )}
      </ul>

      {/*  페이지네이션 */}
      <footer className="mt-3">
        {rows.map((_, idx) => (
          <button
            key={idx}
            className="btn btn-sm btn-outline-primary mx-1"
            style={{
              fontWeight: currPage === idx + 1 ? "bold" : "normal",
              textDecoration: currPage === idx + 1 ? "underline" : "none",
            }}
            onClick={() => setCurrPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </footer>

      {/*  수정 모달 */}
      {showModal && selectedComment && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  editCom();
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title">댓글 수정</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <label htmlFor="commentContent" className="form-label">
                    댓글 내용
                  </label>
                  <textarea
                    className="form-control"
                    id="commentContent"
                    rows="3"
                    value={selectedComment.cContents}
                    onChange={(e) =>
                      setSelectedComment({
                        ...selectedComment,
                        cContents: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    닫기
                  </button>
                  <button type="submit" className="btn btn-primary">
                    저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ComList;
