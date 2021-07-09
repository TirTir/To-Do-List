// import $ from 'jquery';
// window.$ = $;

const $ = window.$;

const DAYS = ["월요일", "화요일", "수요일", "목요일", "금요일"];
const PERIODS = ["09", "10", "11", "12", "01", "02", "03", "04", "05", "06"];

// 더미 데이터
const schedule_data = [{
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

const DB = JSON.parse(localStorage.getItem("ScheduleData"));
alert(Boolean(DB) ? "기존 데이터를 불러옵니다." : "기존 데이터가 없어서 더미데이터를 가져옵니다.")
const data = DB || {
    schedule_data: schedule_data
};
    
    window.onload = function(){
        Time();
        
        setTimeout(() => {
            Time();        
        }, 1000);

        loadData();
        loadEvent();
    }

    // 함수 정의
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


    function loadData(){
        let schedule_html = '';
        
        for(let i = 0; i < data.schedule_data.length; i++){
            const sDate = data.schedule_data[i].startDate.split(":");
            const sH = Number(sDate[0])- 9;
            const sM = Number(sDate[1]);
            const s = (sH * 60) + sM;

            const eDate = data.schedule_data[i].endDate.split(":")
            const eH = Number(eDate[0]) - 9;
            const eM = Number(eDate[1]);
            const e = (eH * 60) + eM;
            
            //  top    :  s * 100;
            //  height :  s - e  * 100;
            //  left   : 요일 하나당  200px;
            schedule_html += `<div
                class="schedule-data"
                data-sDate="${data.schedule_data[i].startDate}"
                data-eDate="${data.schedule_data[i].endDate}"
                data-day="${data.schedule_data[i].day}"
                data-index="${i}"
                style="
                    z-index: ${s};
                    background-color: ${data.schedule_data[i].color};
                    left: ${(data.schedule_data[i].day + 1) * 200}px;
                    top: ${s / 60 * 100 + 50}px;
                    height: ${(e - s) / 60 * 100}px;
                ">${data.schedule_data[i].subject}</div>`;
        };

        $('#schedule').html(schedule_html);
    }

    function loadEvent(){
        // popup 관련 이벤트
        $("#popup-open").on('click', function(e){
            $("#popup").attr('class', 'on');
        });

        $("#popup-close").on('click', function(e){    
            $("#popup").attr('class', 'off');
        });

        // 시간표 추가 이벤트
        $("#add").on('click', function(e){    
            if(window.confirm("정말 등록하시겠습니까?") === true){
                const subject = $("#add-input-subject").val();
                const sDate = $("#add-input-sDate").val();
                const eDate = $("#add-input-eDate").val();
                const day = $("#add-input-day option:selected").val();
                const score = $('#add-input-score').val();
                const homework = $('#add-input-homework').val();

                
                const newData = {
                    score: score,
                    homework: homework,
                    startDate: sDate,
                    endDate: eDate,
                    color: '#'+Math.floor(Math.random()*16777215).toString(16),
                    day: Number(day),
                    subject: subject,
                };

                console.log(newData);

                data.schedule_data = [...data.schedule_data, newData];
                saveData(data);
                loadData();
                loadEvent();

                $("#popup").attr('class', 'off');
            }
        });
        

        // 시간표 삭제 이벤트
        $("#schedule > .schedule-data").on('click', function(e){    
            if(window.confirm("정말 삭제하시겠습니끼?") === true){
                data.schedule_data = data.schedule_data.filter((d, i) => i !== Number($(e.target).data('index')));
                saveData(data);
                loadData();
                loadEvent();
            }
        });

    }

    function saveData (data){
        // JSON.stringify = 객체를 문자열로 바꿈
        localStorage.setItem("ScheduleData", JSON.stringify(data));
    }