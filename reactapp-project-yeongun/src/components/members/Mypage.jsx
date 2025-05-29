import { useState, useEffect } from 'react';
import { firestore } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { updateDoc, doc, getDoc } from 'firebase/firestore'; // setDoc → updateDoc로 변경

function Mypage() {
  const navigate = useNavigate();
  const [collName] = useState('members');

  const [showData, setShowData] = useState({
    id: '',
    pass: '',
    name: '',
    email: { id: '', domain: '' },
    phone: { p1: '', p2: '', p3: '' },
    add: { zipcode: '', address: '', detail: '' },
    regdate: '',
  });

  useEffect(() => {
    const Dataload = async () => {
      const id = await JSON.parse(sessionStorage.getItem('islogined')).id;
      console.log(id);
      const docRef = doc(firestore, collName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setShowData(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    Dataload();
  }, [collName]);

  console.log(showData);

  // 회원정보 수정 함수 (regdate 유지)
  const memberWrite = async (
    p_collection, p_id, p_pass, p_name,
    emailId, emailDomain,
    p1, p2, p3,
    zipcode, address1, address2
  ) => {
    try {
      // 문서 참조
      const userRef = doc(firestore, p_collection, p_id);

      // updateDoc 사용 → regdate는 수정하지 않고 기존값 유지
      await updateDoc(userRef, {
        pass: p_pass,
        name: p_name,
        email: { id: emailId, domain: emailDomain },
        phone: { p1, p2, p3 },
        add: { zipcode, address: address1, detail: address2 }
        // regdate 필드는 아예 안 넣음 → 기존 값 유지됨
      });

      console.log('수정성공');
    } catch (error) {
      console.error('회원정보 수정 중 오류:', error);
      throw error;
    }
  };

  // 주소찾기 버튼 클릭 시 실행되는 함수
  const searchAdd = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setShowData(prev => ({
          ...prev,
          add: {
            ...prev?.add,
            zipcode: data.zonecode,
            address: data.address,
          }
        }));
      },
    }).open();
  };

  if (!showData) {
    return <div>로딩중...</div>;
  }

  return (
    <div className="signup-container">
      <h2 className="signup-title">회원 정보 수정</h2>

      <form className="signup-form" onSubmit={async (event) => {
        event.preventDefault();

        const {
          username, password, confirmPassword, name,
          emailId, emailDomain,
          p1, p2, p3,
          zipcode, address, addressDetail
        } = event.target.elements;

        if (password.value === '') { alert('비밀번호를 입력하세요'); return; }
        if (password.value !== confirmPassword.value) { alert('비밀번호가 같지 않습니다.'); return; }
        if (name.value === '') { alert('이름을 입력하세요'); return; }
        if (emailId.value === '') { alert('이메일을 입력하세요'); return; }
        if (emailDomain.value === '') { alert('도메인을 입력하세요'); return; }
        if (p1.value === '' || p2.value === '' || p3.value === '') { alert('전화번호를 입력하세요'); return; }
        if (zipcode.value === '' || address.value === '' || addressDetail.value === '') { alert('주소를 입력하세요'); return; }

        try {
          await memberWrite(
            collName,
            username.value,
            password.value,
            name.value,
            emailId.value,
            emailDomain.value,
            p1.value,
            p2.value,
            p3.value,
            zipcode.value,
            address.value,
            addressDetail.value
          );
          alert('회원정보가 수정되었습니다.');
          navigate('/');
        } catch {
          alert('회원정보 수정에 실패했습니다.');
        }
      }}>

        <input type="hidden" name="collection" value={collName} />

        <table className="signup-table">
          <tbody>
            <tr>
              <th><label htmlFor="username">아이디</label></th>
              <td>
                <input type="text" id="username" name="username" value={showData.id} readOnly />
              </td>
            </tr>
            <tr>
              <th><label htmlFor="password">패스워드</label></th>
              <td>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={showData.pass}
                  onChange={(e) => setShowData({ ...showData, pass: e.target.value })}
                />
              </td>
            </tr>
            <tr>
              <th><label htmlFor="confirmPassword">패스워드 확인</label></th>
              <td>
                <input type="password" id="confirmPassword" name="confirmPassword" required />
              </td>
            </tr>
            <tr>
              <th><label htmlFor="name">이름</label></th>
              <td>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={showData.name}
                  onChange={(e) => setShowData({ ...showData, name: e.target.value })}
                />
              </td>
            </tr>
            <tr>
              <th><label htmlFor="emailId">이메일</label></th>
              <td>
                <input
                  type="text"
                  id="emailId"
                  name="emailId"
                  required
                  value={showData.email?.id || ''}
                  onChange={(e) =>
                    setShowData({
                      ...showData,
                      email: { ...showData.email, id: e.target.value },
                    })
                  }
                />
                @
                <input
                  type="text"
                  id="emailDomain"
                  name="emailDomain"
                  required
                  value={showData.email?.domain || ''}
                  onChange={(e) =>
                    setShowData({
                      ...showData,
                      email: { ...showData.email, domain: e.target.value },
                    })
                  }
                />
              </td>
            </tr>
            <tr>
              <th><label htmlFor="phone">전화번호</label></th>
              <td>
                <input
                  type="text"
                  id="p1"
                  name="p1"
                  maxLength={3}
                  required
                  value={showData.phone?.p1 || ''}
                  onChange={(e) =>
                    setShowData({
                      ...showData,
                      phone: { ...showData.phone, p1: e.target.value },
                    })
                  }
                />{' '}
                -{' '}
                <input
                  type="text"
                  id="p2"
                  name="p2"
                  maxLength={4}
                  required
                  value={showData.phone?.p2 || ''}
                  onChange={(e) =>
                    setShowData({
                      ...showData,
                      phone: { ...showData.phone, p2: e.target.value },
                    })
                  }
                />{' '}
                -{' '}
                <input
                  type="text"
                  id="p3"
                  name="p3"
                  maxLength={4}
                  required
                  value={showData.phone?.p3 || ''}
                  onChange={(e) =>
                    setShowData({
                      ...showData,
                      phone: { ...showData.phone, p3: e.target.value },
                    })
                  }
                />
              </td>
            </tr>
            <tr>
              <th><label htmlFor="address">주소</label></th>
              <td>
                <input type="text" id="zipcode" name="zipcode" readOnly value={showData.add?.zipcode || ''} />
                <button type="button" onClick={searchAdd}>주소찾기</button>
                <br />
                <input type="text" id="address" name="address" readOnly value={showData.add?.address || ''} />
                <br />
                <input
                  type="text"
                  id="addressDetail"
                  name="addressDetail"
                  required
                  value={showData.add?.detail || ''}
                  onChange={(e) =>
                    setShowData({
                      ...showData,
                      add: { ...showData.add, detail: e.target.value },
                    })
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>

        <button type="submit">회원정보 수정</button>
      </form>
    </div>
  );
}

export default Mypage;
