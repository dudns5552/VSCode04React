import CompContext2a from './CompContext2a';

// 프롭스 없이 컴포넌트 삽입
const CompContext1a = () => {
  return (
    <div>
      <h4>Context1a 컴포넌트</h4>
      <CompContext2a />
    </div>
  );
}
export default CompContext1a;