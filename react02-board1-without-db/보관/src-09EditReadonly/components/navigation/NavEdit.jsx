// 수정페이지의 네비게이션
function NavEdit(props) {
  
  return (<>
     <nav>
      {/* 수정은 '열람'에서 진입하므로 뒤로는 열람으로 전환한다. */}
      <a href="#" onClick={function(event) {
        event.preventDefault();
        props.onBack();
      }}>뒤로</a>
      {" "}
      {/* 수정에서 목록으로 바로 전환한다. */}
      <a href="#" onClick={function(event) {
        event.preventDefault();
        props.onChangeMode();
      }}>목록</a>
    </nav>
  </>); 
}
export default NavEdit;