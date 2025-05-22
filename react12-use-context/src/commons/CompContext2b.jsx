import { useContext } from "react"
import { SimpleContext } from "../context/SimpleContext"

const CompContext2b = () => {
  const contextData = useContext(SimpleContext);
  return (
    <div>
      <h4>Context2b 컴포넌트</h4>
      {/* 컨텍스트 프로바이더로 랩핑할때 value 속성을 통해 전달된
      데이터를 공유받게된다. 이 데이터는 JSON객체이므로 키를 통해
      파싱해서 사용하면 된다. */}
      {contextData.str} <br />
      myNumber : {contextData.num}
    </div>
  );
}

export default CompContext2b;