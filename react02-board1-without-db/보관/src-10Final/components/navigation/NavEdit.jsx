// 수정페이지의 네비게이션
function NavEdit(props) {
  
  return (<>
     <nav>
      <a href="#" onClick={function(event) {
        event.preventDefault();
        props.onBack();
      }}>뒤로</a>
      {" "}
      <a href="#" onClick={function(event) {
        event.preventDefault();
        props.onChangeMode();
      }}>목록</a>
    </nav>
  </>); 
}
export default NavEdit;