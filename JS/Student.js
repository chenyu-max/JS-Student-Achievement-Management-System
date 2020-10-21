// studentId        学号      String
// studentName      姓名      String
// studentSex       性别      String
// studentAge       年龄      Number
// studentPhone     电话      String
// studentCourse    课程      Array

function Student(studentId, studentName, studentSex, studentAge, studentPhone, studentCourse) {
    this.studentId = studentId;
    this.studentName = studentName;
    this.studentSex = studentSex;
    this.studentAge = studentAge;
    this.studentPhone = studentPhone;
    this.studentCourse = studentCourse;
    this.courseNum = 0;
}

// 添加课程
function insertStudentCourse(course) {
    var len = this.studentCourse.length;
    var insertFlag = true;
    for (var i = 0; i < len; i++) {
        if (this.studentCourse[i]['courseName'] == course['courseName']) {
            alert(this.studentName + ' 学生已学课程内 已经含有 ' + course['courseName'] + ' 这门课程');
            insertFlag = false;
            return;
        }
    }

    if (insertFlag) {
        this.studentCourse.push({
            courseName: course['courseName'],
            courseGrades: course['courseGrades'],
            courseIndex: this.courseNum
        });
        this.courseNum++;
        setLocal('allClass', classList.allClass);
    }
}

// 删除课程
function delStudentCourse(course) {
    var isDel = confirm('确认删除课程名称为' + course['courseName'] + ' 的课程信息 以及 其成绩吗？');
    if (isDel) {
        var len = this.studentCourse.length;
        for (var i = 0; i < len; i++) {
            if (this.studentCourse[i]['courseName'] == course['courseName']) {
                this.studentCourse.splice(i, 1);
                break;
            }
        }
        this.courseNum = this.studentCourse.length;
        alert('删除成功');
        for (var i = 0; i < this.courseNum; i++) {
            this.studentCourse[i].courseIndex = i;
        }
        setLocal('allClass', classList.allClass);
    } else {
        return;
    }
}

// 渲染 课程页面
function renderStudentCourse() {
    console.log(this);
    var str = ''
    var tBody = document.getElementById('course-tbody');
    for (var i = 0; i < this.studentCourse.length; i++) {
        str += `
        <tr>
        <td>${this.studentCourse[i]['courseName']}</td>
        <td>${this.studentCourse[i]['courseGrades']}</td>
        <td><button class="btn edit" data-id="${this.studentCourse[i]['courseIndex']}">编辑</button></td>
        <td><button class="btn remove" data-id="${this.studentCourse[i]['courseIndex']}">删除</button></td>
    </tr>`
    }
    tBody.innerHTML = str;
}