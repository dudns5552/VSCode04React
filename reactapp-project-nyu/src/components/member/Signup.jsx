function Signup(props) {

  return (<>
    <form>
      <table id="in">
        <tbody>
          <tr>
            <th style={{ width: '120px' }}>아이디</th>
            <td>
              <input type="text" size="10" />
              <input type="button" className="button" value="중복확인" />
              <span style={{ padding: '20px' }}>
                + 4~15자, 첫 영문자, 영문자와 숫자 조합
              </span>
            </td>
          </tr>
          <tr>
            <th>비밀번호</th>
            <td>
              <input type="text" size="8" />
            </td>
          </tr>
          <tr>
            <th>비밀번호 확인</th>
            <td>
              <input type="text" size="8" />
              <span style={{ padding: '5px' }}>
                (확인을 위해 다시 입력해 주세요.)
              </span>
            </td>
          </tr>
          <tr>
            <th>이름</th>
            <td>
              <input type="text" size="10" />
            </td>
          </tr>
          <tr>
            <th style={{ paddingLeft: '15px' }}>생년월일</th>
            <td>
              <input type="radio" name="gender" value="남자" defaultChecked />남자&nbsp;&nbsp;
              <input type="radio" name="gender" value="여자" />여자&nbsp;&nbsp;&nbsp;&nbsp;
              <input type="text" size="4" />년&nbsp;
              <input type="text" size="1" />월&nbsp;
              <input type="text" size="1" />일
              <span style={{ padding: '15px' }}>
                (예, 2000년 1월 31일)
              </span>
            </td>
          </tr>
          <tr>
            <th>이메일</th>
            <td>
              <input type="text" size="8" /> @
              <input type="text" size="8" list="email" />
              <select id="email">
                <option value="" >직접입력</option>
                <option value="gamil.com" >구글</option>
                <option value="naver.com" >네이버</option>
                <option value="hanmail.net" >한메일</option>
              </select>
            </td>
          </tr>
          <tr>
            <th rowSpan="3" >주소</th>
            <td>
              <input type="text" size="5" />
              &nbsp;
              <input type="button" className="button" value="주소찾기" />
              &nbsp;
              <span>(우편번호)</span>
            </td>
          </tr>
          <tr>
            <td style={{ backgroundColor: 'white' }}>
              <input type="text" size="85" readOnly/>
            </td>
          </tr>
          <tr>
            <td style={{ backgroundColor: 'white' }}>
              <input type="text" size="70" />
              <span style={{paddingLeft: '10px' }}>
                + 나머지 주소
              </span>
            </td>
          </tr>
          <tr>
            <th>휴대전화</th>
            <td>
              <input type="text" size="1" maxLength="3"/> - <input type="text" size="2" /> - <input type="text" size="2" />
              <input type="radio" name="sms" value="수신허용" defaultChecked />
              <span>SMS 수신허용</span>
              <input type="radio" name="sms" value="수신거부" />
              <span>SMS 수신거부</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{
        textAlign: 'center',
        paddingTop: '20px',
        wordSpacing: '15px'
      }}>
        <input type="submit" value="가입하기" id="regBtn" />
      </div>
    </form>
  </>);
}
export default Signup;