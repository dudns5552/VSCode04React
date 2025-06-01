import { addDoc, collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { firestore } from "../../../../firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

function ComWrite(props) {
  const navigate = useNavigate();
  const params = useParams();

  // 댓글 인덱스 함수
  const getNewComIdx = async () => {
    const idxRef = collection(props.docRef, 'comments');
    const q = query(idxRef, orderBy('cIdx', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const maxIdx = querySnapshot.docs[0].data().cIdx;
      return maxIdx + 1;
    } else {
      return 1;
    }
  };

  const writeCom = async (newCom)  => {
    await addDoc(collection(props.docRef, 'comments'), newCom);
    console.log('댓글 쓰기 성공');
    props.setIsComState(!props.isComState);
  }

  return (<>
    {/* 댓글 작성 Modal */}
    <div className="modal fade" id="commentModal" tabIndex="-1" aria-labelledby="commentModalLabel" aria-hidden="true" >
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={ async (e) => {
            // 제출되는 것을 차단
            e.preventDefault();

            let cWriter = JSON.parse(sessionStorage.getItem('islogined')).id
            let cContents = e.target.cContents.value;

            let dateObj = new Date();
            var year = dateObj.getFullYear();
            var month = ("0" + (1 + dateObj.getMonth())).slice(-2);
            var day = ("0" + dateObj.getDate()).slice(-2);
            var hour = ("0" + dateObj.getHours()).slice(-2);
            var mi = ("0" + dateObj.getMinutes()).slice(-2);

            let nowDate = year + "-" + month + "-" + day + "/" + hour + ":" + mi;

            const newCom = {
              cIdx: await getNewComIdx() , cWriter, cDate: nowDate, cContents
            };

            e.target.cContents.value = '';

            writeCom(newCom);
            navigate(params);
          }}>

            <div className="modal-header">
              <h5 className="modal-title" id="commentModalLabel">댓글 작성</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {/*  작성자명 입력 상자 삭제  */}
              {/*  댓글 입력 상자  */}
              <label htmlFor="commentContent" className="form-label">댓글 내용</label>
              <textarea className="form-control" id="commentContent" rows="3" placeholder="댓글을 입력하세요"
                name="cContents"></textarea>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
              <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" >작성</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>);
}
export default ComWrite;