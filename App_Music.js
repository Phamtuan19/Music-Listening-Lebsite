
import song from "./song_list.js";



const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const app = {

    currenIndex: 0,
    isPlaying: false,


    // add bài hát vào danh sách phát nhạc
    render: function () {
        this.renderAudio();

        const html = song.map(function (a) {
            return ` 
            <div class="song active__hover">
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
        this.clickSong();
    },

    renderAudio: function () {
        $(".name__song").innerText = song[this.currenIndex].name;
        $("#audio").src = song[this.currenIndex].path;
        $(".cd-thumb").style.backgroundImage = "url('" + song[this.currenIndex].image + "')";
    },

    // xử lý khi vuốt đanh sách bài hát (thu nhỏ hình ảnh (class="cd"))
    handlenEvents: function () {
        const cd = $('.cd')
        const cdWidth = cd.offsetWidth // offsetWidth: chiều rộng của class="cd

        this.render();
        this.cdPlaying();
        this.clickProgress();
        this.cdReplay();
        this.prevSong();
        this.nextSong();

        // console.log(cdWidth);
        document.onscroll = function () {
            const onscrollTop = window.scrollY;
            // kích thước mới = kích thước của hình ảnh - tỉ lẹ kéo thả
            const newCdWidth = cdWidth - onscrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            // opacity = kích thức mới chia kích thước cũ
            cd.style.opacity = newCdWidth / cdWidth

        }
    },

    cdPlaying: function () {
        $(".btn-toggle-play").onclick = () => {
            // Check audio play 
            if ($("#audio").paused) {
                this.playSong();
                console.log($("#audio").duration);
            } else {
                this.pauseSong();
            }
        }
    },

    playSong: function () {
        this.playBtn();

        $("#audio").play()

        // Thời gian tổng bài hát .duration || thời gian đã phát .currentTime
        $("#audio").addEventListener("timeupdate", () => {
            const newPercentWidth = $("#audio").currentTime / $("#audio").duration * 100;
            $(".progress-value").style.width = newPercentWidth + "%";
            // console.log(newPercentWidth);

            this.cdAutoNext(newPercentWidth);
        });

    },

    cdReplay: function () {
        $(".btn-repeat").onclick = () => {
            $("#audio").currentTime = 0;
        }
    },

    pauseSong: function () {
        this.stopBtn()

        $("#audio").pause();

        // this.cdThumbAnimate().stop();
    },

    // tùy chọn thời gian phát
    clickProgress: function () {
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
                this.stopBtn();
            }
        }
    },

    clickSong: function () {
        $$(".song").forEach((e, index) => {
            e.onclick = () => {
                $$(".song").forEach((item) => {
                    item.classList.add("active__hover")
                    item.classList.remove("active");
                })

                e.classList.add("active");
                e.classList.remove("active__hover")
                this.currenIndex = index;
                this.stopBtn();
                this.renderAudio();
            }
        });
    },

    // animation speed cd-thumb
    // cdThumbAnimate: function () {
    //     const cdThumbAnimate = $(".cd-thumb").animate([
    //         { transform: 'rotate(360deg)' }
    //     ], {
    //         duration: 10000,
    //         iterations: Infinity,
    //     })

    //     const act = {
    //         play() {
    //             cdThumbAnimate.play();
    //         },

    //         stop() {
    //             cdThumbAnimate.pause();
    //         },
    //     }

    //     return act;
    // },

    prevSong: function () {
        $(".btn-prev").onclick = () => {

            this.currenIndex--;

            if (this.currenIndex < 0) {
                this.currenIndex = song.length - 1;
            }

            $("#audio").currentTime = 0;
            $(".progress-value").style.width = 0;

            this.stopBtn();
            this.renderAudio();
        }
    },

    nextSong: function () {
        $(".btn-next").onclick = () => {
            this.currenIndex++;

            if (this.currenIndex == song.length - 1) {
                this.currenIndex = 0;
            }
            $("#audio").currentTime = 0;
            $(".progress-value").style.width = 0;

            this.stopBtn();
            this.renderAudio();
        }
    },

    playBtn: function () {
        $(".icon-play").classList.add('d-none');
        $(".icon-pause").classList.remove('d-none');
    },

    stopBtn: function () {
        $(".icon-play").classList.remove('d-none');
        $(".icon-pause").classList.add('d-none');
    },


    cdAutoNext: function (newPercentWidth) {
        if (newPercentWidth == 100) {
            if ($(".btn-random .active")) {
                this.currenIndex++;
                this.renderAudio();
                $("#audio").play();
                console.log(true);
            } else {
                this.stopBtn();
            }
        }
    },

    start: function () {
        this.handlenEvents();
    },
}
app.start();

$(".btn-random").onclick = () => {
    $(".fa-random").classList.toggle("active");
}