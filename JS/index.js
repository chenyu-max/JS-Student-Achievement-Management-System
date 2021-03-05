// ClassList  班级链表类
let classList = {
    allClass: getLocal('allClass') ? getLocal('allClass') : [],
    insertClass: function(tempObj) {
        // insertFlag 表示 能否添加这个班级
        var insertFlag = true;
        var classObj = new ClassStructure(tempObj.classId, tempObj.studentsNum, tempObj.nowStudentsNum, tempObj.studentsList, tempObj.classIndex);

        this.allClass.forEach(function(value) {
            if (value['classId'] == classObj['classId']) {
                alert(classObj['classId'] + ' 这个班级已经存在，添加失败');
                insertFlag = false;
            }
        })

        if (insertFlag) {
            this.allClass.push(classObj);
            setLocal('allClass', this.allClass);
            return true;
        } else {
            return false;
        }
    },
    delClass: function(calssObj) {
        // 弹窗判断是否删除
        var isDel = confirm('确认删除' + calssObj.classId + '这个班级吗？');
        if (isDel) {
            // 删除相应索引位的班级
            this.allClass.splice(calssObj.classIndex, 1);
        }
        var len = this.allClass.length;
        classNum = len;
        for (var i = 0; i < len; i++) {
            this.allClass[i]['classIndex'] = i;
        }

        setLocal('allClass', this.allClass);
        setLocal('classNum', classNum);
    }
};

// classNum 为 班级数量
let classNum = getLocal('classNum') ? Number(getLocal('classNum')) : 0;

// 事件绑定函数
function bindEvent() {
    let class_index;
    let student_index;
    let course_index;

    let login_flag = false;

    const login = document.getElementsByClassName('login')[0];
    const registered = document.getElementsByClassName('registered')[0];

    login.onclick = () => {
        if (login_flag = true) {
            login.innerHTML = `<a href="./login.html">登录</a>`;
            registered.innerHTML = `<a href="./registered.html">注册</a>`;
            login_flag = false;
        }
    }

    if (getLocal('nowUser')) {
        login_flag = true;
        login.innerHTML = '退出登录';
        registered.innerHTML = getLocal('nowUser');
    }


    const student_list_content = document.getElementsByClassName('right-content')[0];
    const class_list_content = document.getElementsByClassName('right-content')[1];
    const course_list_content = document.getElementsByClassName('right-content')[2];

    // 班级菜单列表点击按钮操作
    const classMenuDl = document.querySelector('.left-menu > #class-menu ');
    changeLeftMenu(classMenuDl);

    // 学生菜单列表点击按钮操作
    const studentMenuDl = document.querySelector('.left-menu > #student-menu');
    changeLeftMenu(studentMenuDl);

    // 成绩菜单列表点击按钮操作
    const courseMenuDl = document.querySelector('.left-menu > #course-menu');
    changeLeftMenu(courseMenuDl);

    // 班级信息 添加按钮 点击操作
    const classAddBtn = document.getElementById('addClass-form-btn');
    const classAddForm = document.getElementById('class-add-form');
    classAddBtn.onclick = function(e) {
        // 取消点击提交按钮的默认事件
        e.preventDefault();
        // 获取提交表单的数据
        var tempObj = getClassFormData(classAddForm);
        if (tempObj.classId == '') {
            alert('请输入班级名称');
            return;
        }
        if (!Number(tempObj.studentsNum)) {
            alert('请输入正确的班级人数（数字）');
            return;
        }
        if (classList.insertClass({
                classId: tempObj.classId,
                studentsNum: Number(tempObj.studentsNum),
                nowStudentsNum: 0,
                studentsList: [],
                classIndex: classNum
            })) {
            // 更新班级数目
            classNum++;
            setLocal('classNum', classNum);

            // 改变 左侧菜单栏样式 以及 右侧 content 内容 以及清除 add表单 中的内容
            switchPagesByAddBtn('class', classMenuDl, classAddForm);

            renderClassListContent();
        }
    }

    //  点击 班级管理 视图页面 的 按钮 (编辑 + 删除)
    const classTableBody = document.getElementById('class-tbody');
    classTableBody.onclick = function(e) {
        if (!e.target.classList.contains('btn')) {
            return false;
        }
        // 点击的是 编辑 按钮
        if (e.target.classList.contains('edit')) {
            class_index = e.target.dataset.index;
            var siblings = getSiblings(studentMenuDl);
            changeStyle(siblings, 'show', studentMenuDl);
            student_list_content.classList.add('show');
            class_list_content.classList.remove('show');
            renderStudentHeadLog(class_index);
            renderStudentsList.call(classList.allClass[class_index]);
        } else {
            // 点击的是删除按钮
            var index = e.target.dataset.index;
            classList.delClass(classList.allClass[index]);
            renderClassListContent();
        }
    }


    // 学生表单 提交按钮 点击事件
    const studentAddForm = document.getElementById('student-add-form');
    const addStudentFormBtn = document.getElementById('addStudent-form-btn');
    addStudentFormBtn.onclick = function(e) {
        e.preventDefault();
        var tempObj = getStudentFormData(studentAddForm);
        if (isValidStudentForm(tempObj)) {
            var student = new Student(tempObj.studentId, tempObj.studentName, tempObj.studentSex, tempObj.studentAge, tempObj.studentPhone, []);
            insertStudent.call(classList.allClass[class_index], student);
            studentsSort.call(classList.allClass[class_index]);
            renderStudentsList.call(classList.allClass[class_index]);

            // 改变 左侧菜单栏样式 以及 右侧 content 内容 以及清除 add表单 中的内容
            switchPagesByAddBtn('student', studentMenuDl, studentAddForm);

        }
    }

    const student_edit_dialog = document.getElementById('student-edit-dialog');
    const course_edit_dialog = document.getElementById('course-edit-dialog');
    // 学生表单 按钮点击事件
    var studentTableBody = document.getElementById('student-tbody');
    studentTableBody.onclick = function(e) {
        if (!e.target.classList.contains('btn')) {
            return false;
        }
        // 点击的是编辑按钮
        if (e.target.classList.contains('edit')) {
            student_index = e.target.dataset.id;
            studentDataReset(classList.allClass[class_index].studentsList[student_index]);
            student_edit_dialog.classList.add('show');
        } else if (e.target.classList.contains('remove')) {
            // 点击的是 删除 按钮
            student_index = e.target.dataset.id;
            delStudent.call(classList.allClass[class_index], classList.allClass[class_index].studentsList[student_index]);
            renderStudentsList.call(classList.allClass[class_index]);
        } else {
            // 点击的是 查看成绩 按钮
            student_index = e.target.dataset.id;
            // console.log(classList.allClass[class_index].studentsList[student_index]);

            renderCourseHeadLog(class_index, student_index);

            var siblings = getSiblings(courseMenuDl);
            changeStyle(siblings, 'show', courseMenuDl);

            course_list_content.classList.add('show');
            student_list_content.classList.remove('show');

            renderStudentCourse.call(classList.allClass[class_index].studentsList[student_index]);
        }
    }

    // 当编辑区域展示出来的时候，我们点击编辑区域以外的内容，编辑区域消失 以及 编辑弹窗的点击按钮事件
    student_edit_dialog.onclick = function(e) {
        if (e.target === this) {
            student_edit_dialog.classList.remove('show');
            return;
        }
        // 编辑弹窗的 点击 按钮
        if (e.target.classList.contains('btn')) {
            e.preventDefault();
            var form = document.getElementById('student-edit-form');
            var editStudent = classList.allClass[class_index].studentsList[student_index];
            console.log(editStudent);
            editStudent.studentName = form['studentName'].value;
            editStudent.studentAge = form['studentAge'].value;
            editStudent.studentSex = form['studentSex'].value == '0' ? '男' : '女';
            editStudent.studentPhone = form['studentPhone'].value;
            renderStudentsList.call(classList.allClass[class_index]);
            student_edit_dialog.classList.remove('show');
            setLocal('allClass', classList.allClass);
        }
    }

    // 课程表单提交按钮 点击事件
    var addCourseFormBtn = document.getElementById('addCourse-form-btn');
    var courseAddForm = document.getElementById('course-add-form');
    addCourseFormBtn.onclick = function(e) {
        // 阻止点击 submit 按钮 页面刷新
        e.preventDefault();
        if (!courseAddForm['courseGrades']) {
            alert('请输入课程名称');
            return;
        }

        if (courseAddForm['courseGrades'] == '' || !Number(courseAddForm['courseGrades'].value)) {
            alert('请正确输入成绩');
            return;
        }

        if (Number(courseAddForm['courseGrades'].value) < 0 || Number(courseAddForm['courseGrades'].value) > 100) {
            alert('请输入 0 ~ 100 分的成绩');
            return;
        }

        var tempObj = {
            courseName: courseAddForm['courseName'].value,
            courseGrades: Number(courseAddForm['courseGrades'].value)
        };

        insertStudentCourse.call(classList.allClass[class_index].studentsList[student_index], tempObj);

        // 改变 左侧菜单栏样式 以及 右侧 content 内容 以及清除 add表单 中的内容
        switchPagesByAddBtn('course', courseMenuDl, courseAddForm);

        renderStudentCourse.call(classList.allClass[class_index].studentsList[student_index]);

    }

    // 成绩 列表 按钮点击事件
    var courseTbody = document.getElementById('course-tbody');
    courseTbody.onclick = function(e) {
        if (!e.target.classList.contains('btn')) {
            return;
        }

        if (e.target.classList.contains('edit')) {
            // 编辑按钮 点击
            course_index = e.target.dataset.id;
            var course_edit_form = document.getElementById('course-edit-form');

            // 弹窗中的 表单回填
            course_edit_form['courseName'].value = classList.allClass[class_index].studentsList[student_index].studentCourse[course_index].courseName;
            course_edit_form['courseGrades'].value = classList.allClass[class_index].studentsList[student_index].studentCourse[course_index].courseGrades;
            course_edit_dialog.classList.add('show');
        } else {
            // 删除按钮的点击
            course_index = e.target.dataset.id;
            delStudentCourse.call(classList.allClass[class_index].studentsList[student_index], classList.allClass[class_index].studentsList[student_index].studentCourse[course_index]);
            renderStudentCourse.call(classList.allClass[class_index].studentsList[student_index]);
        }
    }

    // 成绩 编辑表单 点击事件
    course_edit_dialog.onclick = function(e) {

        if (e.target === this) {
            course_edit_dialog.classList.remove('show');
            return;
        }

        if (e.target.classList.contains('btn')) {
            e.preventDefault();

            var course_edit_form = document.getElementById('course-edit-form');

            if (course_edit_form['courseGrades'].value > 100 || course_edit_form['courseGrades'].value < 0) {
                alert('请输入 0 ~ 100 分的成绩');
                return;
            }

            // 将编辑成绩弹窗中的 成绩 赋值给 数组中
            var editCourse = classList.allClass[class_index].studentsList[student_index].studentCourse[course_index];
            editCourse.courseGrades = course_edit_form['courseGrades'].value;

            // 重新渲染页面
            renderStudentCourse.call(classList.allClass[class_index].studentsList[student_index]);
            course_edit_dialog.classList.remove('show');
            setLocal('allClass', classList.allClass);
        }
    }

    //  点击 header 上 的 log 返回  上一级
    var log = document.getElementsByClassName('log')[0].getElementsByTagName('span')[0];
    log.onclick = function() {
        var data_id = this.dataset.id;
        if (!data_id) {
            return;
        }

        if (data_id == 'student') {
            // 当前是 学生管理 页面

            // 左侧菜单切换
            classMenuDl.classList.add('show');
            studentMenuDl.classList.remove('show');

            // 右侧菜单切换
            student_list_content.classList.remove('show');
            class_list_content.classList.add('show');

            log.innerHTML = '班级管理系统';
            log.removeAttribute('data-id');
            renderClassListContent();
        } else {
            // 当前是 课程成绩管理 页面
            // 左侧菜单切换
            studentMenuDl.classList.add('show');
            courseMenuDl.classList.remove('show');

            // 右侧菜单切换
            student_list_content.classList.add('show');
            course_list_content.classList.remove('show');

            renderStudentHeadLog(class_index);
        }
    }

}

// 切换样式效果
function changeStyle(siblings, className, target) {
    for (var i = 0; i < siblings.length; i++) {
        siblings[i].classList.remove(className);
    }
    target.classList.add(className);
}

// 查找兄弟元素节点
function getSiblings(node) {
    var children = node.parentNode.children;
    var result = [];
    for (var i = 0; i < children.length; i++) {
        if (children[i] != node) {
            result.push(children[i]);
        }
    }
    return result;
}

// 三个添加页面内 提交按钮 点击事件
function switchPagesByAddBtn(target, menuDom, addForm) {
    // traget 传入的参数是 字符串 可以为 'class' 'student' 'course'
    // menu 为 左侧 菜单的父级
    // addForm 为 表单
    // 左侧menu 更改
    var list_menu = menuDom.getElementsByTagName('dd')[0];
    var siblings = getSiblings(list_menu);
    changeStyle(siblings, 'active', list_menu);

    // 右侧content 更改
    var list_content = document.getElementById(target + '-list');
    siblings = getSiblings(list_content);
    changeStyle(siblings, 'show-content', list_content);
    addForm.getElementsByClassName('btn')[1].click();
}

// 改变左侧菜单样式 以及 右侧对应内容相应的样式
function changeLeftMenu(dom) {
    dom.onclick = function(e) {
        if (e.target.tagName === 'DD') {
            var siblings = getSiblings(e.target);
            changeStyle(siblings, 'active', e.target);
            var id = e.target.dataset.id;
            var content = document.getElementById(id);
            var contentSiblings = getSiblings(content);
            changeStyle(contentSiblings, 'show-content', content);
        }
    }
}

// 获取班级表单信息
function getClassFormData(form) {
    return {
        classId: form['classId'].value,
        studentsNum: form['studentsNum'].value
    }
}

// 渲染班级列表的内容区域
function renderClassListContent() {
    var tBody = document.getElementById('class-tbody');
    var str = '';
    for (var i = 0; i < classNum; i++) {
        str += `<tr>
    <td>${classList.allClass[i]['classId']}</td>
    <td>${classList.allClass[i]['maxStudentsNum']}</td>
    <td>${classList.allClass[i]['nowStudentsNum']}</td>
    <td><button class="btn edit" data-index=${classList.allClass[i]['classIndex']}>编辑</button></td>
    <td><button class="btn remove" data-index=${classList.allClass[i]['classIndex']}>删除</button></td>
</tr>`;
    }
    tBody.innerHTML = str;
}

// 获取学生表单信息
function getStudentFormData(form) {
    return {
        studentId: form['sId'].value,
        studentName: form['name'].value,
        studentSex: form['sex'].value == '0' ? '男' : '女',
        studentAge: Number(form['age'].value),
        studentPhone: form['phone'].value,
    }
}

// 学生添加表单的规则校验
function isValidStudentForm(data) {
    var errorObj = {
        studentName: ["请填写学生姓名"],
        studentId: ["请填写学生学号", "学号由4-16位的数字组成"],
        studentAge: ["请填写年龄"],
        studentPhone: ["请填写手机号", "手机号格式不正确"],
    };

    for (var prop in data) {
        if (data.hasOwnProperty(prop)) {
            // 判断当前属性是否有值， 如果没有则报出异常
            if (!data[prop]) {
                alert(errorObj[prop][0]);
                return false;
            }
        }
    }

    // 4 - 16 位的 数字，以数字开头，以数字结尾
    var regSId = /^\d{4,16}$/;
    if (!regSId.test(data.studentId)) {
        alert(errorObj.studentId[1]);
        return false;
    }
    return true;
}

// 学生编辑表单的数据回填
function studentDataReset(data) {
    var form = document.getElementById('student-edit-form');
    // 循环学生信息，判断在表单当中是否含有输入的位置，如果有的话，修改其值
    // form[name] 表示 form 结构中， name 属性的 属性 值 是 name 的 dom 结构
    for (var prop in data) {
        if (form[prop]) {
            if (prop == 'studentSex') {
                form[prop].value = data[prop] == '男' ? 0 : 1;
            } else {
                form[prop].value = data[prop];
            }
        }
    }
}

// 渲染学生页面 head 视图
function renderStudentHeadLog(index) {
    var log = document.getElementsByClassName('log')[0].getElementsByTagName('span')[0];
    log.innerHTML = classList.allClass[index]['classId'] + '  学生管理系统 (点击返回上一页面)';
    log.setAttribute('data-id', 'student');
}

// 渲染成绩管理 head 视图
function renderCourseHeadLog(class_index, student_index) {
    var log = document.getElementsByClassName('log')[0].getElementsByTagName('span')[0];
    log.innerHTML = classList.allClass[class_index].studentsList[student_index]['studentName'] + ' 学生成绩管理系统 (点击返回上一页面)';
    log.setAttribute('data-id', 'course');
}

bindEvent();
renderClassListContent();