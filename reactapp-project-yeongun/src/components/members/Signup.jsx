import { useContext, useState } from 'react';
import { firestore } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc, collection, query, where, getDocs } from 'firebase/firestore'; // 추가됨

function Signup(props) {
  const navigate = useNavigate();

  const [collName] = useState('members');
  const [isLocked, setIsLocked] = useState(false);
  const [domainLock, setDomainLock] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ idChecked, setIdChecked ] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    pass: '',
    name: '',
    emailId: '',
    sDomain: '',
    p1: '',
    p2: '',
    p3: '',
    zipcode: '',
    address1: '',
    address2: ''
  });

  const nowDate = () => {
    let dateObj = new Date();
    let year = dateObj.getFullYear();
    let month = ("0" + (1 + dateObj.getMonth())).slice(-2);
    let day = ("0" + dateObj.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const memberWrite = async (
    p_collection, p_id, p_pass, p_name,
    emailId, emailDomain,
    p1, p2, p3,
    zipcode, address1, address2
  ) => {
    await setDoc(doc(firestore, p_collection, p_id), {
      id: p_id,
      pass: p_pass,
      name: p_name,
      email: { id: emailId, domain: emailDomain },
      phone: { p1, p2, p3 },
      add: { zipcode, address: address1, detail: address2 },
      regdate: nowDate(),
    });
    console.log('입력성공');
  };

  // 중복확인 함수 (Firebase에서 직접 검사) // 추가됨
  const idCheck = async () => {
    if (!formData.id) {
      alert("아이디를 입력 후 중복확인을 눌러주세요");
      return;
    }

    try {
      const q = query(collection(firestore, collName), where("id", "==", formData.id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("중복된 아이디입니다.");
        setIdChecked(false);
        setIsLocked(false);
      } else {
        alert("사용 가능한 아이디입니다.");
        setIdChecked(true);
        setIsLocked(true);
      }
    }
    catch (error) {
      console.error("아이디 중복확인 중 오류 발생:", error);
      alert("중복확인 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIdChecked(false);
      setIsLocked(false);
    }
  };

  const searchAdd = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setFormData(prev => ({ ...prev, zipcode: data.zonecode, address1: data.address }));
      },
    }).open();
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">회원가입</h2>
      <form className="signup-form" onSubmit={async (event) => {
        event.preventDefault();

        const {
          id, pass, name,
          emailId, sDomain, p1, p2, p3,
          zipcode, address1, address2
        } = formData;

        if (id === '') { alert('아이디를 입력하세요'); return; }
        if (pass === '') { alert('비밀번호를 입력하세요'); return; }
        if (pass !== confirmPassword) { alert('비밀번호가 같지 않습니다.'); return; }
        if (name === '') { alert('이름을 입력하세요'); return; }
        if (emailId === '') { alert('이메일을 입력하세요'); return; }
        if (sDomain === '') { alert('도메인을 입력하세요'); return; }
        if (p1 === '' || p2 === '' || p3 === '') { alert('전화번호를 입력하세요'); return; }
        if (zipcode === '' || address1 === '' || address2 === '') { alert('주소를 입력하세요'); return; }
        if (!idChecked) { alert('중복확인을 해주세요'); return; }

        await memberWrite(collName, id, pass, name, emailId, sDomain, p1, p2, p3, zipcode, address1, address2);
        setIdChecked(false); // 다음 회원가입 시 중복확인을 위해 상태 초기화
        setIsLocked(false);  // 잠금 해제
        alert("회원가입이 완료되었습니다.");
        navigate("/");
      }}>
        <input type="hidden" name='collection' value={collName} />

        <table className="signup-table">
          <tbody>
            <tr>
              <th><label htmlFor="id">아이디</label></th>
              <td>
                <div className="id-check-group">
                  <input type="text" id="id" name="id" required
                    value={formData.id}
                    onChange={(e) => {
                      setFormData({ ...formData, id: e.target.value });
                      setIdChecked(false);      // 아이디 입력 변경 시 중복확인 다시 해야 하므로 false로 변경 // 추가됨
                      setIsLocked(false);       // 입력 변경되면 잠금 해제 // 추가됨
                    }}
                    readOnly={isLocked} />
                  <button type="button" className="signup-inline-button" 
                    onClick={idCheck}>중복확인</button>
                </div>
              </td>
            </tr>

            <tr>
              <th><label htmlFor="password">패스워드</label></th>
              <td><input type="password" id="password" name="password" required className="signup-input"
                value={formData.pass}
                onChange={(e) => setFormData({ ...formData, pass: e.target.value })} /></td>
            </tr>

            <tr>
              <th><label htmlFor="confirmPassword">패스워드 확인</label></th>
              <td><input type="password" id="confirmPassword" name="confirmPassword" required className="signup-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} /></td>
            </tr>

            <tr>
              <th><label htmlFor="name">이름</label></th>
              <td><input type="text" id="name" name="name" required className="signup-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></td>
            </tr>

            <tr>
              <th><label htmlFor="email">이메일</label></th>
              <td>
                <div className="email-inputs">
                  <input type="text" name="emailId" required
                    value={formData.emailId}
                    onChange={(e) => setFormData({ ...formData, emailId: e.target.value })} />
                  <span>@</span>
                  <input type="text" name="emailDomain" required value={formData.sDomain}
                    onChange={(e) => setFormData({ ...formData, sDomain: e.target.value })}
                     readOnly={domainLock} />
                  <select className="signup-email-select" onChange={(e) => {
                    setFormData({ ...formData, sDomain: e.target.value });
                    setDomainLock(!e.target.value);
                  }}>
                    <option value="">직접입력</option>
                    <option value="naver.com">naver.com</option>
                    <option value="gmail.com">gmail.com</option>
                    <option value="daum.net">daum.net</option>
                    <option value="nate.com">nate.com</option>
                  </select>
                </div>
              </td>
            </tr>

            <tr>
              <th><label htmlFor="phone">휴대전화</label></th>
              <td>
                <div className="phone-inputs">
                  <input type="text" maxLength="3" required name='p1' id='p1' value={formData.p1}
                    onChange={(e) => {
                      setFormData({ ...formData, p1: e.target.value });
                      if (e.target.value.length === 3) {
                        document.getElementById('p2').focus();
                      }
                    }} />
                  -
                  <input type="text" maxLength="4" required name='p2' id='p2' value={formData.p2}
                    onChange={(e) => {
                      setFormData({ ...formData, p2: e.target.value });
                      if (e.target.value.length === 4) {
                        document.getElementById('p3').focus();
                      }
                    }} />
                  -
                  <input type="text" maxLength="4" required name='p3' id='p3' value={formData.p3}
                    onChange={(e) => setFormData({ ...formData, p3: e.target.value })} />
                </div>
              </td>
            </tr>

            <tr>
              <th><label htmlFor="zipcode">주소</label></th>
              <td>
                <div className="address-group">
                  <input type="text" id="zipcode" name="zipcode" className="signup-zipcode" readOnly required
                    value={formData.zipcode} />
                  <button type="button" className="signup-inline-button" onClick={searchAdd}>주소찾기</button>
                </div>
                <div className="address-detail" >
                <input type="text" id='address' name="address" placeholder="기본주소" readOnly className="signup-mt8"
                  value={formData.address1} />
                <input type="text" id='addressDetail' name="addressDetail" placeholder="상세주소" className="signup-mt8"
                  value={formData.address2}
                  onChange={(e) => setFormData({ ...formData, address2: e.target.value })} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="signup-button-wrapper">
          <button type="submit" className="signup-button">회원가입</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
