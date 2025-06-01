import { useState } from "react";

function BoardView(props) {
  return (<>
    {/* 게시판 열람 */}
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">댓글 작성 구현하기</h5>
        <p className="card-text">
          구현할 기능은 댓글작성, 좋아요, 수정, 삭제입니다. <br />
          기능 구현은 아래 댓글 작성부터 하면 됩니다.
        </p>
      </div>
    </div>
  </>);
}

const CommentBtn = () => {
  return (<>
    {/* 댓글 작성 버튼 */}
    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#commentModal">
      댓글 작성
    </button>
  </>)
}

function ModalWindow(props) {
  let newC = [...props.bData];
  return (<>
    {/* 댓글 작성 Modal */}
    <div className="modal fade" id="commentModal" tabIndex="-1" aria-labelledby="commentModalLabel" aria-hidden="true" >
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={(event) => {
            // 제출되는 것을 차단
            event.preventDefault();

            let writer = event.target.writer.value;
            let text = event.target.text.value;

            let dateObj = new Date();
            var year = dateObj.getFullYear();
            var month = ("0" + (1 + dateObj.getMonth())).slice(-2);
            var day = ("0" + dateObj.getDate()).slice(-2);
            var hour = ("0" + dateObj.getHours()).slice(-2);
            var mi = ("0" + dateObj.getMinutes()).slice(-2);

            let nowDate = year + "-" + month + "-" + day + " " + hour + ":" + mi;

            newC.push({
              no: props.sN, writer, date: nowDate, text, likes: 0
            })
            props.setBData(newC);
            props.setSN(props.sN + 1);

            event.target.writer.value = '';
            event.target.text.value = '';
          }}>

            <div className="modal-header">
              <h5 className="modal-title" id="commentModalLabel">댓글 작성</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {/*  작성자명 입력 상자 추가  */}
              <div className="mb-3">
                <label htmlFor="commentAuthor" className="form-label">작성자명</label>
                <input type="text" className="form-control" id="commentAuthor" placeholder="이름을 입력하세요"
                  name="writer" />
              </div>
              {/*  댓글 입력 상자  */}
              <label htmlFor="commentContent" className="form-label">댓글 내용</label>
              <textarea className="form-control" id="commentContent" rows="3" placeholder="댓글을 입력하세요"
                name="text"></textarea>
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

function CommentList(props) {

  const lists = props.bData.map(
    (curr) => {
      console.log('전달확인', curr)
      return (
        <li className="list-group-item" key={curr.no}>
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <strong>{curr.writer}</strong> <small className="ms-2">{curr.date}</small>
            </div>
            <div>
              <button className="btn btn-outline-success btn-sm" onClick={() => {
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
              }>좋아요 ({curr.likes})</button>
              <button className="btn btn-outline-warning btn-sm" data-bs-target="#commentModal"
                onClick={() => {

                  return (
                    <div className="modal fade" id="commentModal" tabIndex="-1" aria-labelledby="commentModalLabel" aria-hidden="true" >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <form onSubmit={(event) => {
                            // 제출되는 것을 차단
                            event.preventDefault()
                            let newArr = [];
                            for (let i = 0; i < props.bData.length; i++) {
                              if (curr.no !== props.bData.no) {
                                newArr.push(props.bData[i]);
                              }
                              else (newArr.push({ no: curr.no, writer: props.writer, date: curr.date, text: props.text }))
                            }
                            props.setBData(newArr);
                          }}>
                            <div className="modal-header">
                              <h5 className="modal-title" id="commentModalLabel">댓글 작성</h5>
                              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                              {/*  작성자명 입력 상자 추가  */}
                              <div className="mb-3">
                                <label htmlFor="commentAuthor" className="form-label">작성자명</label>
                                <input type="text" className="form-control" id="commentAuthor"
                                  name="writer" value={curr.writer}
                                  onChange={(event) => {
                                    // 스테이트 변경을 위한 함수를 호출한다.
                                    props.setWriter(event.target.value);
                                  }} />
                              </div>
                              {/*  댓글 입력 상자  */}
                              <label htmlFor="commentContent" className="form-label">댓글 내용</label>
                              <textarea className="form-control" id="commentContent" rows="3"
                                name="text" value={curr.text}
                                onChange={(event) => {
                                  props.setText(event.target.value);
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
              <button className="btn btn-outline-danger btn-sm" onClick={() => {
                if (window.confirm("정말삭제하시겠습니까?")) {
                  const newarr = [];
                  for (let i = 0; i < props.bData.length; i++) {
                    if (curr.no !== props.bData[i].no) {
                      newarr.push(props.bData[i]);
                    }
                  }
                  props.setBData(newarr);
                }
              }}>삭제</button>
            </div>
          </div >
          <p className="mt-2 mb-0">
            {curr.text}
          </p>
        </li >
      );
    }
  );



  return (<>
    {/* 댓글 목록 출력 */}
    <ul className="list-group mt-3" >
      {lists}
    </ul>
  </>);
}

function App() {

  const [bData, setBData] = useState
    ([
      {
        no: 1, writer: '작성자명', date: '2025-03-22 14:30',
        text: '댓글은 여기에 출력됩니다. 줄바꿈 처리도 해주세요.'
          + '<br> 댓글 작성과 수정은 모달창을 이용하면 됩니다.',
        likes: 10
      },
    ]);
  const [sN, setSN] = useState(2);
  const [writer, setWriter] = useState();
  const [text, setText] = useState();

  return (<>
    <div className="container mt-4">
      <BoardView />
      <CommentBtn />
      <ModalWindow bData={bData} setBData={setBData} sN={sN} setSN={setSN} />

      <CommentList bData={bData} setBData={setBData} writer={writer} setWriter={setWriter}
        text={text} setText={setText} />
    </div>
  </>);
}
export default App;