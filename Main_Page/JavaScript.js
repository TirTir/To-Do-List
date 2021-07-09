// import $ from 'jquery';
// window.$ = $;

const $ = window.$;

// 더미 데이터
const _schedule_data = [{
    score: 3,
    homework: "예제 4-5 풀어서 lms 제출",
    startDate: "15:15",
    endDate: "17:45",
    color : "red",
    day : 2,
    subject :"자료 구조 및 실습",
},{
    score: 3,
    homework: "연습문제 풀어서 lms 제출",
    startDate: "10:30",
    endDate: "11:15",
    day : 2,
    color : "yellow",
    subject :"컴퓨터 아키텍처",
}, {
    score: 3,
    homework: "기말프로젝트",
    startDate: "15:00",
    endDate: "17:00",
    day : 4,
    color : "green",
    subject :"웹클라이언트",
}];

// 1번 박스 더미 데이터
const schedule_data = [{
    color: "red",
    subject :"웹클라이언트기말",
    homework : "프로젝트 (deadline : 6/19)",
    time :"10 : 00 ~ 10 : 30",
},{
    color: "yellow",
    subject :"4차 산업혁명",
    homework : "기말 프로젝트 (deadline : 6/19)",
    time :"10 : 00 ~ 10 : 30",
}];
// 2번 박스 더미 데이터
const user_info = {
    score: "19",
    subject_count: "7",
    schedule: ["웹클라이언트", "자바 프로그래밍", "World English"]
}

// 3번 박스 더미 데이터
const board_data = [{
    subject : "웹클라이언트",
    todolist : [{ check: true, todo:"기말 프로젝트"}, { check: false, todo:"PROJECT1 제출"}, { check: false, todo:"PROJECT2 제출"}]
}, {
    subject : "자바 프로그래밍",
    todolist : [{ check: true, todo:"기말 프로젝트"}, { check: false, todo:"GUI 구현하기"}, { check: false, todo:"상속 복습하기"}]
}, {
    subject : "World English",
    todolist : [{ check: true, todo:"단어 암기"}, { check: false, todo:"교재 정리"}, { check: false, todo:"기말 퀴즈 준비"}]
}]

const DB = JSON.parse(localStorage.getItem("ScheduleData"));
alert(Boolean(DB) ? "기존 데이터를 불러옵니다." : "기존 데이터가 없어서 더미데이터를 가져옵니다.")
const DBdata = DB || {
    schedule_data: _schedule_data
};


// test 원하는 요일로 변경
//const scheduleData = DBdata.schedule_data.filter(d => d.day == 2).map(d => ({
 const scheduleData = DBdata.schedule_data.filter(d => d.day == (new Date()).getDay() - 1).map(d => ({
    color: d.color,
    subject : d.subject,
    homework : d.homework || "없음",
    time : `${d.startDate} ~ ${d.endDate}`,
}));

const scheduleList = [...new Set(DBdata.schedule_data.map(d => d.subject))]
const score = scheduleList.map(s => DBdata.schedule_data.find(d => d.subject === s)?.score || 0)
    .reduce((partial_sum, a) => partial_sum + a,0); 

const data = {
    schedule_data: scheduleData,
    user_info: {
        score: score,
        subject_count: scheduleList.length,
        schedule: scheduleList  
    },
    board_data: JSON.parse(localStorage.getItem("TodolistData")) || []
};
    window.onload = function(){
        Time();
        
        setTimeout(() => {
            Time();        
        }, 1000);

        loadData();
        loadEvent();
    }

    // 정상 작동 함
    function Time(){
        const monthEl = document.getElementById('month');
        const daysEl = document.getElementById('day');
        const weekEl = document.getElementById('week');
        const hoursEl = document.getElementById('time_h');
        const minutesEl = document.getElementById('time_m');

        
        const date = new Date();
        const month = (date.getMonth() + 1);
        const day = date.getDate();
        let week = date.getDay(); 
        let time_h = date.getHours();
        let time_m = date.getMinutes();

        switch(week) {
            case 1: 
                week = '월';
                break;
            case 2:
                week = '화';
                break;
            case 3:
                week = '수';
                break;
            case 4:
                week = '목';
                break;
            case 5:
                week = '금';
                break;
            case 6:
                week = '토';
                break;
        default:
                week = '일';
                break;
        }

        time_h = 23 - time_h;
        time_m = 60 - time_m;
        
        monthEl.innerHTML = month;
        daysEl.innerHTML = day;
        weekEl.innerHTML = week;
        hoursEl.innerHTML = time_h;
        minutesEl.innerHTML = time_m;
    }

    // 정상 작동 함
    function loadData() {
        // 1번 박스
        let schedule_html = '';
        for(let i = 0; i < data.schedule_data.length; i++){
            schedule_html += `
            <li>
                <div class="color" style="background-color: ${data.schedule_data[i].color}"/>
                <div class="time">${data.schedule_data[i].time}</div>
                <div class="info">
                    <div class="subject">${data.schedule_data[i].subject}</div>
                    <div class="homework">${data.schedule_data[i].homework}</div>
                </div>
            </li>
            `;
        }
        $('#Schedule').html(schedule_html);


        // 2번 박스
        let score_html = `학점 : ${data.user_info.score}`;
        let subject_count_html = `과목 : ${data.user_info.subject_count}`;
        let subject_html = '';
        for(let i = 0; i < data.user_info.schedule.length; i++){
            subject_html += `
            <li>
                <div class="subject-item">${data.user_info.schedule[i]}</div>
            </li>
            `;
        }
        
        $('#score').html(score_html);
        $('#subject_count').html(subject_count_html);
        $('#subject').html(subject_html);


        // 3번 박스
        let board_html = '';
        let check_box_html = '';
        for(let i = 0; i < data.board_data.length; i++){
            check_box_html = '';
            for(let j = 0; j < data.board_data[i].todolist.length; j++){
                check_box_html += `
                <li>
                    <div class="delete-btn" data-index="${j}" data-subject_index="${i}">X</div>
                    <div class="check-box" data-index="${j}" data-subject_index="${i}">
                    ${data.board_data[i].todolist[j].check ? "V" : " "}</div>
                    <input data-index="${j}" data-subject_index="${i}" value="${data.board_data[i].todolist[j].todo}" />
                </li>` 
            };

            board_html += `
            <li>
                <div class="subject-item not-pointer">${data.board_data[i].subject}</div>
                <ul class="todolist">${check_box_html}</ul>
            </li>
            `;
        }

        $('#board').html(board_html);
    }

    function loadEvent(){
        // (id가 board인 태그 아래 있는 input이) (키가 눌리면) (엔터라면 블러시키기)
        $("#board input").on('keypress', function(e){
            if(e.key == 'Enter'){
                e.target.blur();
            }
        })
        // (id가 board인 태그 아래 있는 input이) (blur 되면) (저장하기)
        $("#board input").on('blur', function(e){
            //$(e.target) = input 안에있는 속성 이름이 data-subject 인 값을 가져오기
            const subject_index = $(e.target).data('subject_index');
            const index = $(e.target).data('index');
            
            data.board_data[subject_index].todolist[index].todo = e.target.value;
            
            saveData(data);
            // loadData();
            // loadEvent();
        });

        // 2번째 박스에서 과목 클릭했을 경우 아래 todolist 에 추가하기
        $("#subject div").on('click', function(e){
            const subject = $(e.target).text();
            const currentDataIndex = data.board_data.findIndex(d => d.subject === subject);

            if(currentDataIndex !== -1){
                data.board_data[currentDataIndex].todolist = [...data.board_data[currentDataIndex].todolist, { check: false, todo:""}];
            }else{
                data.board_data = [...data.board_data, {
                    subject : subject,
                    todolist : [{ check: false, todo:""}]
                }]
            }

            saveData(data);
            loadData();
            loadEvent();
        });

        // todolist 에서 x 클릭시 삭제
        $("#board .delete-btn").on('click', function(e){
            const subject_index = $(e.target).data('subject_index');
            const index = $(e.target).data('index');


            console.log("click", data.board_data, subject_index, data.board_data[subject_index].todolist);
            if(data.board_data[subject_index].todolist.length === 1){
                data.board_data = data.board_data.filter((b, i) => i !== subject_index);
            }else{
                data.board_data[subject_index].todolist = data.board_data[subject_index].todolist.filter((t, i) => i !== index);
            }

            saveData(data);
            loadData();
            loadEvent();
        });

        // check-box 클릭 시 체크 바뀜
        $("#board .check-box").on('click', function(e){
            console.log("check-box click")
            const subject_index = $(e.target).data('subject_index');
            const index = $(e.target).data('index');

            data.board_data[subject_index].todolist[index].check = !data.board_data[subject_index].todolist[index].check;

            saveData(data);
            loadData();
            loadEvent();
        });
    }

    function saveData (data){
        
        // JSON.stringify = 객체를 문자열로 바꿈
        localStorage.setItem("TodolistData", JSON.stringify(data.board_data));
    } 