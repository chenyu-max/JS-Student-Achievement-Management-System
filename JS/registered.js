let userArr = getLocal('User') === null ? [] : getLocal('User');

/**
 * 判断用户名是否存在
 * @param {string} username
 */
function checkUsername(username) {
    let length = userArr.length;
    for (let i = 0; i < length; i++) {
        if (userArr[i].username === username) {
            return false;
        }
    }
    return true;
}

/**
 * 判断用户名是否合法
 */
function checkUsernameIsTure() {
    const registered_username = document.getElementsByClassName('registered_username')[0];

    if (!registered_username.value) {
        registered_username.setAttribute('placeholder', '请填写用户名');
        return false;
    } else if (!checkUsername(registered_username.value)) {
        registered_username.value = '用户名已存在';
        return false;
    } else {
        return true;
    }
}

/**
 * 判断密码是否合法
 */
function checkPasswordIsTrue() {
    const registered_password = document.getElementsByClassName('registered_password')[0];
    const registered_confirm_password = document.getElementsByClassName('registered_confirm_password')[0];
    if (!registered_password.value) {
        registered_password.setAttribute('placeholder', '请填写密码');
        return false;
    } else if (registered_password.value.length < 6) {
        alert('密码长度必须大于6位');
        return false;
    } else if (registered_confirm_password.value !== registered_password.value) {
        alert('两次输入的密码必须相同');
        return false;
    } else {
        return true;
    }
}

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
 * 前往登录页面
 */
function goToLogin() {
    let aDom = document.createElement('a');
    aDom.href = './login.html';
    aDom.click();
}

function bindEvent() {

    let registered_flag = true; // 用于判断表单是否正确

    const registered_username = document.getElementsByClassName('registered_username')[0];
    const registered_password = document.getElementsByClassName('registered_password')[0];
    const registered_submit = document.getElementsByClassName('registered_submit')[0];
    const checkCode = document.getElementById('registered_code');
    const registered_Captcha = document.getElementsByClassName('registered_Captcha')[0];

    // 点击生成随机验证码
    checkCode.onclick = () => {
        checkCode.value = createCode();
    }

    checkCode.value = createCode();

    // 注册按钮点击提交事件
    registered_submit.onclick = () => {
        registered_flag = checkUsernameIsTure();
        if (!checkUsernameIsTure()) {
            return;
        }

        registered_flag = checkPasswordIsTrue();
        if (!checkPasswordIsTrue()) {
            return;
        }

        if (registered_Captcha.value !== checkCode.value) {
            alert('请输入正确的验证码');
            checkCode.value = createCode();
            registered_flag = false;
            return;
        }

        if (registered_flag) {
            userArr.push({
                username: registered_username.value,
                password: registered_password.value
            })
            setLocal('User', userArr);
            alert('注册成功');
            goToLogin();
        }

    }
}

bindEvent();