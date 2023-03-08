
import song from "./song_list.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

var currenIndex = 0;

function render() {
    renderAudio();

    const html = song.map(function (a, index) {
        return ` 
            <div class="song active__hover ${index == 0 ? 'active' : ''}">
                <div class="thumb" style="background-image: url('${a.image}')"></div>
                <div class="body">
                    <h3 class="title">${a.name}</h3>
                    <p class="author">${a.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div> 
            `
    })

    $('.playlist').innerHTML = html.join('')
    clickSong();
}

// hiển thị bài hát cbi phát
function renderAudio() {
    $(".name__song").innerText = song[currenIndex].name;
    $("#audio").src = song[currenIndex].path;
    $(".cd-thumb").style.backgroundImage = "url('" + song[currenIndex].image + "')";
}

// xử lý khi vuốt đanh sách bài hát (thu nhỏ hình ảnh (class="cd"))
function handlenEvents() {
    const cd = $('.cd')
    const cdWidth = cd.offsetWidth // offsetWidth: chiều rộng của class="cd

    document.onscroll = function () {
        const onscrollTop = window.scrollY;
        // kích thước mới = kích thước của hình ảnh - tỉ lẹ kéo thả
        const newCdWidth = cdWidth - onscrollTop

        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
        // opacity = kích thức mới chia kích thước cũ
        cd.style.opacity = newCdWidth / cdWidth
    }
}

// phát nhạc 
function cdPlaying() {
    $(".btn-toggle-play").onclick = () => {
        // Check audio play 
        if ($("#audio").paused) {
            playSong();
            $(".cd-thumb").classList.add('spin');
        } else {
            pauseSong();
            $(".cd-thumb").classList.remove('spin');
        }
    }
}

// phát nhạc
function playSong() {
    playBtn();

    $("#audio").play()

    // Thời gian tổng bài hát .duration || thời gian đã phát .currentTime
    $("#audio").addEventListener("timeupdate", () => {
        const currentTime = $("#audio").currentTime;
        const totalTime = $("#audio").duration;

        const newPercentWidth = currentTime / totalTime * 100;
        $(".progress-value").style.width = newPercentWidth + "%";

        //  Cd-thumb xoay 360
        // const style = window.getComputedStyle($(".cd-thumb"));
        // const matrix = new DOMMatrixReadOnly(style.transform);
        // const angle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
        // $(".cd-thumb").style.transform = `rotate(${angle}deg)`;

        cdAutoNext(newPercentWidth);
    });
}

// dừng phát nhạc
function pauseSong() {
    stopBtn()
    $("#audio").pause();
}

// phát lại
function cdReplay() {
    $(".btn-repeat").onclick = () => {
        $("#audio").currentTime = 0;
    }
}

// tùy chọn thời gian phát
function clickProgress() {
    $(".progress").onclick = (e) => {
        const rect = $(".progress").getBoundingClientRect();
        const widthClick = e.clientX - rect.left;
        const widthProgress = widthClick / rect.width * 100;

        // Hiển thị thời lượng đã phát
        $(".progress-value").style.width = widthProgress + "%";

        // tùy chọn thời gian phát
        $("#audio").currentTime = $("#audio").duration * widthProgress / 100;
        console.log(widthProgress);
        if (widthProgress >= 99.64285578046527) {
            stopBtn();
        }
    }
}

function clickSong() {
    $$(".song").forEach((e, index) => {
        e.onclick = () => {
            currenIndex = index;

            $$(".song").forEach((item) => {
                item.classList.add("active__hover")
                item.classList.remove("active");
            })

            e.classList.add("active");
            e.classList.remove("active__hover");

            stopBtn();
            renderAudio();
        }
    });
}

function playBtn() {
    $(".icon-play").classList.add('d-none');
    $(".icon-pause").classList.remove('d-none');
}

function stopBtn() {
    $(".icon-play").classList.remove('d-none');
    $(".icon-pause").classList.add('d-none');
}


function cdAutoNext(newPercentWidth) {
    if (newPercentWidth == 100) {
        if ($(".btn-random .active")) {

            currenIndex > song.length - 1 ? currenIndex = 0 : currenIndex++;

            renderAudio();
            $("#audio").play();
            console.log(true);
        } else {
            stopBtn();
        }
    }
}

function prevSong() {
    $(".btn-prev").onclick = () => {
        currenIndex--;

        if (currenIndex < 0) {
            currenIndex = song.length - 1;
        }

        $("#audio").currentTime = 0;
        $(".progress-value").style.width = 0;

        renderAudio();
        playSong();

        $$(".song").forEach((e, index) => {
            e.classList.add("active__hover");
            e.classList.remove("active");
        });

        $$(".song")[currenIndex].classList.remove("active__hover");
        $$(".song")[currenIndex].classList.add("active");
    }
}

function nextSong() {
    $(".btn-next").onclick = () => {
        currenIndex++;

        if (currenIndex == song.length - 1) {
            currenIndex = 0;
        }
        $("#audio").currentTime = 0;
        $(".progress-value").style.width = 0;

        renderAudio();
        playSong();

        $$(".song").forEach((e, index) => {
            e.classList.add("active__hover");
            e.classList.remove("active");
        });

        $$(".song")[currenIndex].classList.remove("active__hover");
        $$(".song")[currenIndex].classList.add("active");

    }
}

handlenEvents()
render();
cdPlaying();
clickProgress();
cdReplay();
prevSong();
nextSong();