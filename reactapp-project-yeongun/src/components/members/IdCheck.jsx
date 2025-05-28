import { useEffect, useState } from "react";
import { firestore } from '../../firebaseConfig';
import { collection, getDocs } from "firebase/firestore";

const IdCheck = () => {
  const [userId, setUserId] = useState("");
  const [retypeId, setRetypeId] = useState("");
  const [check, setCheck] = useState("");
  const [submitOk, setSubmitOk] = useState(true);
  const [showData, setShowData] = useState([]);
  const [trArray, setTrArray] = useState([]);

  // 처음에 전체 회원 ID를 불러오기
  const getCollection = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "members"));
      const newarr = [];
      querySnapshot.docs.map((doc) => {
        const memberInfo = doc.data();
        newarr.push({ id: memberInfo.id })
      });
      setTrArray(newarr);
      setShowData(newarr);
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
    }
  };

  // 페이지 처음 로드 시: URL에서 ID 가져오기 + 전체 데이터 로딩
  useEffect(() => {
    const url = new URL(window.location.href);
    const idParam = url.searchParams.get("id");
    if (idParam) {
      setUserId(idParam);
      setRetypeId(idParam);
    }

    getCollection(); //  이거 반드시 호출해야 데이터가 들어옴
  }, []);

  // 입력 ID가 변경될 때마다 중복 검사
  useEffect(() => {
    const checkDuplicate = () => {
      let isDuplicate = false;
      for (let i = 0; i < showData.length; i++) {
        if (retypeId === showData[i].id) {
          isDuplicate = true;
          break;
        }
      }

      if (isDuplicate) {
        setCheck(" 중복된 아이디입니다.");
        setSubmitOk(false);
      } else {
        setCheck(" 사용 가능한 아이디입니다.");
        setSubmitOk(true);
      }

    };

    if (retypeId !== "") checkDuplicate();
  }, [retypeId, showData]); // 입력값이나 DB값이 바뀌면 검사함

  // 부모창으로 값 전달
  const idUse = () => {
    if (window.opener && window.opener.document && submitOk) {
      try {
        const input = window.opener.document.getElementById("username");
        input.value = retypeId;
        input.readOnly = true;
        window.close();
      } catch (e) {
        alert("부모창과의 통신 중 오류가 발생했습니다.");
      }
    } else {
      alert("사용할 수 없는 아이디입니다.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>아이디 중복 확인</h2>
      <p>사용하려는 아이디: <strong>{userId}</strong></p>
      <form name="overlapFrm" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="retype_id"
          value={retypeId}
          onChange={(e) => setRetypeId(e.target.value)}
          size="20"
          style={{ padding: "6px", fontSize: "1rem", marginRight: "10px" }}
        />
        <p style={{ color: submitOk ? "green" : "red" }}>{check}</p>
        <button type="button" onClick={idUse} style={{ padding: "6px 12px" }}>
          사용하기
        </button>
      </form>
    </div>
  );
};

export default IdCheck;
