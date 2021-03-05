let userArr = getLocal('User') === null ? [] : getLocal('User');

/**
 * 生成随机验证码
 */
function createCode() {
    let code = '';
    const codeLength = 6;
    const randomArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
        'L', 'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ]; //随机数
    randomArr.sort(() => {
        return Math.random() - 0.5;
    });
    for (let i = 0; i < codeLength; i++) {
        code += randomArr[i];
    }
    return code;
}

/**
 * 判断账号密码是否合法
 */
function checkIsTrue() {
    const login_username = document.getElementsByClassName('login_username')[0];
    const login_password = document.getElementsByClassName('login_password')[0];

    const username = login_username.value;
    const password = login_password.value;
    const length = userArr.length;

    for (let i = 0; i < length; i++) {
        if (username === userArr[i].username) {
            if (userArr[i].password === password) {
                return true;
            } else {
                alert('密码不正确');
                return false;
            }
        }
    }
    alert('该账号不存在');
    return false;
}

function goToIndex() {

    const login_username = document.getElementsByClassName('login_username')[0];
    const username = login_username.value;
    setLocal('nowUser', username);
    let aDom = document.createElement('a');
    aDom.href = './index.html';
    aDom.click();


}

function bindEvent() {

    let login_flag = true;

    const checkCode = document.getElementById('login_code');
    const login_Captcha = document.getElementsByClassName('login_Captcha')[0];
    const login_submit = document.getElementsByClassName('login_submit')[0];
    // 点击生成随机验证码
    checkCode.onclick = () => {
        checkCode.value = createCode();
    }

    checkCode.value = createCode();


    login_submit.onclick = () => {
        login_flag = checkIsTrue();
        if (!checkIsTrue) {
            return;
        }

        if (login_Captcha.value !== checkCode.value) {
            alert('请输入正确的验证码');
            checkCode.value = createCode();
            login_flag = false;
            return;
        }

        if (login_flag) {
            goToIndex();
        }
    }

}

bindEvent();