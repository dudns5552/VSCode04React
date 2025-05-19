function Delete(props) {
  
  const boardData= props.boardData;
  const setBoardData= props.setBoardData;
  const navigate = props.navigate;
  let newBoardData = [];

  if(window.confirm('삭제할까요?')){
    for(let i = 0 ; i < boardData.length ; i ++) {
      if(no !== boardData[i].no){
        newBoardData.push(boardData[i]);
      }
    }
    return(
      navigate('list'),
    setBoardData(newBoardData)
    );
  } 
  else{
    return navigate('list');
  }
  
}
export default Delete;