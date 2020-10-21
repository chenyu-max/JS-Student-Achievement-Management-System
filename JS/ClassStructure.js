// 班级List 构造函数
// classID      班级名称         String
// studentsNum  班级学生上限      Number
// studentsList 班级学生信息      Array
// classIndex   班级的索引       Number
function ClassStructure(classId, maxStudentsNum, nowStudentsNum, studentsList, classIndex) {
    this.classId = classId;
    this.maxStudentsNum = maxStudentsNum;
    this.nowStudentsNum = nowStudentsNum;
    this.studentsList = studentsList ? studentsList : [];
    this.classIndex = classIndex;
}

// 添加学生
function insertStudent(student) {
    var insertFlag = true;
    if (this.maxStudentsNum == this.studentsList.length) {
        alert('该班人数已达上限,请勿添加学生');
        return;
        // return 防止产生 关系户
    }
    this.studentsList.forEach(function (value) {
        if (value.studentId == student.studentId) {
            alert('学号为' + student.studentId + '的学生已存在');
            insertFlag = false;
        }
    })

    if (insertFlag) {
        this.studentsList.push(student);
        this.nowStudentsNum = this.studentsList.length;
    }
}

// 删除学生
function delStudent(student) {
    // 弹窗判断是否删除
    var isDel = confirm('确认删除学号为' + student.studentId + '的这个学生吗？');
    if (isDel) {
        var len = this.studentsList.length;
        for (var i = 0; i < len; i++) {
            if (this.studentsList[i].studentId == student.studentId) {
                this.studentsList.splice(i, 1);
                break;
            }
        }
        this.nowStudentsNum = this.studentsList.length;
        alert('删除成功');
        studentsSort.call(this);
    } else {
        return;
    }

}

// 班级成员排序（按照学号排序）
function studentsSort() {
    this.studentsList.sort(function (a, b) {
        return a.studentId - b.studentId;
    });
    for (var i = 0; i < this.nowStudentsNum; i++) {
        this.studentsList[i].studentIndex = i;
    }
    setLocal('allClass', classList.allClass);
}

// 渲染班级成员列表
function renderStudentsList() {
    var str = ''
    var tBody = document.getElementById('student-tbody');
    for (var i = 0; i < this.studentsList.length; i++) {
        str += `
        <tr>
        <td>${this.studentsList[i]['studentId']}</td>
        <td>${this.studentsList[i]['studentName']}</td>
        <td>${this.studentsList[i]['studentSex']}</td>
        <td>${this.studentsList[i]['studentAge']}</td>
        <td>${this.studentsList[i]['studentPhone']}</td>
        <td><button class="btn edit" data-id="${this.studentsList[i].studentIndex}">编辑</button></td>
        <td><button class="btn score" data-id="${this.studentsList[i].studentIndex}">查看成绩</button></td>
        <td><button class="btn remove" data-id="${this.studentsList[i].studentIndex}">删除</button></td>
    </tr>`
    }
    tBody.innerHTML = str;
}