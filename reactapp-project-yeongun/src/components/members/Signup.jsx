import { useState } from 'react';
import { firestore } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom'; // ✅ 수정
import { setDoc, doc } from 'firebase/firestore';

function Signup(props) {
  const navigate = useNavigate(); // ✅ 수정
  const [collName, setCollName] = useState('members');
  const [username, setUserName] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [sDomain, setSDomain] = useState('');
  const [str1, setStr1] = useState('');
  const [str2, setStr2] = useState('');
  const [domainLock, setDomainLock] = useState(false);

  const nowDate = () => {
    let dateObj = new Date();
    var year = dateObj.getFullYear();
    var month = ("0" + (1 + dateObj.getMonth())).slice(-2);
    var day = ("0" + dateObj.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
  };

  const memberWrite = async (p_collection, p_id, p_pass, p_name, f_email, f_phone, f_add) => {
    await setDoc(doc(firestore, p_collection, p_id), {
      id: p_id,
      pass: p_pass,
      name: p_name,
      email: f_email,
      phone: f_phone,
      add: f_add,
      regdate: nowDate(),
    });
    console.log('입력성공');
  };

  function idCheck() {
    if (!username) {
      alert("아이디를 입력후 중복확인을 누르삼");
      return;
    }
    window.open(`./idCheck?id=${username}`, "idover", "width=400, height=400");
  }

  const searchAdd = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        document.getElementById("zipcode").value = data.zonecode;
        document.getElementById("address").value = data.address;
      },
    }).open();
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">회원가입</h2>
      <form className="signup-form" onSubmit={async (event) => {
        event.preventDefault();

        let collection = event.target.collection.value;
        let username = event.target.username.value;
        let pass = event.target.password.value;
        let confirmPassword = event.target.confirmPassword.value;
        let name = event.target.name.value;
        let emailId = event.target.emailId.value;
        let emailDomain = event.target.emailDomain.value;
        let p1 = event.target.p1.value;
        let p2 = event.target.p2.value;
        let p3 = event.target.p3.value;
        let zipcode = event.target.zipcode.value;
        let address1 = event.target.address.value;
        let address2 = event.target.addressDetail.value;

        if (username === '') { alert('아이디를 입력하세요'); return; }
        if (pass === '') { alert('비밀번호를 입력하세요'); return; }
        if (pass !== confirmPassword) { alert('비밀번호가 같지 않습니다.'); return; }
        if (name === '') { alert('이름을 입력하세요'); return; }
        if (emailId === '') { alert('이메일을 입력하세요'); return; }
        if (emailDomain === '') { alert('도메인을 입력하세요'); return; }
        if (p1 === '') { alert('전화번호를 입력하세요'); return; }
        if (p2 === '') { alert('전화번호를 입력하세요'); return; }
        if (p3 === '') { alert('전화번호를 입력하세요'); return; }
        if (zipcode === '') { alert('주소를 입력하세요'); return; }
        if (address1 === '') { alert('주소를 입력하세요'); return; }
        if (address2 === '') { alert('주소를 입력하세요'); return; }

        let fullEmail = emailId + '@' + emailDomain;
        let fullPhone = p1 + '-' + p2 + '-' + p3;
        let fullAddress = `(${zipcode}) ${address1} ${address2}`;

        await memberWrite(collection, username, pass, name, fullEmail, fullPhone, fullAddress);
        navigate("/"); // ✅ 수정
      }}>
        <input type="hidden" name='collection'
          value={collName} onChange={(e) => setCollName(e.target.value)} />

        <table className="signup-table">
          <tbody>
            <tr>
              <th><label htmlFor="username">아이디</label></th>
              <td>
                <div className="signup-inline">
                  <input type="text" id="username" name="username" required
                    onChange={(e) => { setUserName(e.target.value) }} readOnly={isLocked} />
                  <button type="button" className="signup-inline-button"
                    onClick={() => { idCheck() }}>중복확인</button>
                </div>
              </td>
            </tr>

            <tr>
              <th><label htmlFor="password">패스워드</label></th>
              <td>
                <input type="password" id="password" name="password" required className="signup-input" />
              </td>
            </tr>

            <tr>
              <th><label htmlFor="confirmPassword">패스워드 확인</label></th>
              <td>
                <input type="password" id="confirmPassword" name="confirmPassword" required className="signup-input" />
              </td>
            </tr>

            <tr>
              <th><label htmlFor="name">이름</label></th>
              <td>
                <input type="text" id="name" name="name" required className="signup-input" />
              </td>
            </tr>

            <tr>
              <th><label htmlFor="email">이메일</label></th>
              <td>
                <div className="signup-email-row">
                  <input type="text" name="emailId" required />
                  <span>@</span>
                  <input type="text" name="emailDomain" required value={sDomain} onChange={
                    (e) => { setSDomain(e.target.value) }} readOnly={domainLock} />
                  <select className="signup-email-select" onChange={(e) => {
                    setSDomain(e.target.value);
                    setDomainLock(!!e.target.value);
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
              <th><label htmlFor="phone">휴대전화번호</label></th>
              <td>
                <div className="signup-phone-row">
                  <input type="text" maxLength="3" required name='p1' id='p1' value={str1}
                    onChange={(e) => {
                      setStr1(e.target.value)
                      if (e.target.value.length === 3) {
                        document.getElementById('p2').focus()
                      }
                    }} />
                    -
                  <input type="text" maxLength="4" required name='p2' id='p2' value={str2}
                    onChange={(e) => {
                      setStr2(e.target.value)
                      if (e.target.value.length === 4) {
                        document.getElementById('p3').focus()
                      }
                    }} />
                    -
                  <input type="text" maxLength="4" required name='p3' id='p3' />
                </div>
              </td>
            </tr>

            <tr>
              <th><label htmlFor="zipcode">주소</label></th>
              <td>
                <div className="signup-inline">
                  <input type="text" id="zipcode" name="zipcode" className="signup-zipcode" readOnly required />
                  <button type="button" className="signup-inline-button" onClick={searchAdd}>주소찾기</button>
                </div>
                <input type="text" id='address' name="address" placeholder="기본주소" readOnly className="signup-mt8" />
                <input type="text" id='addressDetail' name="addressDetail" placeholder="상세주소" className="signup-mt8" />
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
