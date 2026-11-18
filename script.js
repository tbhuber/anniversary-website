
const startDate = new Date("2021-11-17T23:00:00");
const musicToggle = document.getElementById("music-toggle");
const musicNext = document.getElementById("music-next");
const loveSong = document.getElementById("love-song");

if (musicToggle && loveSong) {
    const playlist = [
        {title: "Zaalima", src: "audio/lost-frequencies.mp3" },
        {title: "World Away", src: "audio/world-away.mp3" },
        {title: "I Need Your Love", src: "audio/need-your-love.mp3" },
        {title: "Zaalima", src: "audio/zaalima.mp3" },
        {title: "Follow You", src: "audio/dragons.mp3" },
        {title: "Need Your Love", src: "audio/gryffin.mp3" },
        {title: "In My Arms", src: "audio/illenium.mp3" }

    ];
    let currentTrack = 0;
    const musicLabel = musicToggle.querySelector(".music-label");

    function setPlayingState(isPlaying) {
        musicToggle.classList.toggle("is-playing", isPlaying);
        musicToggle.setAttribute(
            "aria-label",
            isPlaying ? "Pause anniversary music" : "Play anniversary music"
        );
        if (musicLabel) {
            musicLabel.textContent = isPlaying ? "Pause music" : "Play music";
        }
    }

    function loadTrack(index) {
        currentTrack = (index + playlist.length) % playlist.length;
        loveSong.src = playlist[currentTrack].src;
        loveSong.load();
    }

    loadTrack(currentTrack);

    musicToggle.addEventListener("click", async () => {
        if (loveSong.paused) {
            try {
                loveSong.volume = 0.7;
                await loveSong.play();
                setPlayingState(true);
            } catch (error) {
                if (musicLabel) {
                    musicLabel.textContent = "Tap to play";
                }
                setPlayingState(false);
            }
        } else {
            loveSong.pause();
            setPlayingState(false);
        }
    });

    if (musicNext) {
        musicNext.addEventListener("click", async () => {
            loadTrack(currentTrack + 1);
            try {
                loveSong.volume = 0.7;
                await loveSong.play();
                setPlayingState(true);
            } catch (error) {
                setPlayingState(false);
                if (musicLabel) {
                    musicLabel.textContent = "Tap to play";
                }
            }
        });
    }

    loveSong.addEventListener("ended", async () => {
        loadTrack(currentTrack + 1);
        try {
            await loveSong.play();
            setPlayingState(true);
        } catch (error) {
            setPlayingState(false);
        }
    });

    loveSong.addEventListener("error", () => {
        if (musicLabel) {
            musicLabel.textContent = "Music unavailable";
        }
        setPlayingState(false);
    });
}

function addMonths(date, count) {
    const result = new Date(date);
    const originalDay = result.getDate();

    result.setDate(1);
    result.setMonth(result.getMonth() + count);

    const lastDay = new Date(
        result.getFullYear(),
        result.getMonth() + 1,
        0
    ).getDate();

    result.setDate(Math.min(originalDay, lastDay));

    return result;
}

function updateCounter() {
    const now = new Date();

    if (now < startDate) {
        return;
    }

    // Calculate complete years.
    let years = now.getFullYear() - startDate.getFullYear();

    while (addMonths(startDate, years * 12) > now) {
        years--;
    }

    let remainder = addMonths(startDate, years * 12);

    // Calculate complete months after the years.
    let months = 0;

    while (months < 11 && addMonths(remainder, 1) <= now) {
        remainder = addMonths(remainder, 1);
        months++;
    }

    // Calculate remaining days, hours, minutes, and seconds.
    let remaining = now - remainder;

    const days = Math.floor(remaining / 86400000);
    remaining %= 86400000;

    const hours = Math.floor(remaining / 3600000);
    remaining %= 3600000;

    const minutes = Math.floor(remaining / 60000);
    remaining %= 60000;

    const seconds = Math.floor(remaining / 1000);

    document.getElementById("years").textContent = years;
    document.getElementById("months").textContent = months;
    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
}

updateCounter();
setInterval(updateCounter, 1000);

const letterToggle = document.getElementById("letter-toggle");
const loveLetter = document.getElementById("love-letter");

if (letterToggle && loveLetter) {
    letterToggle.addEventListener("click", () => {
        const isOpening = loveLetter.hidden;

        loveLetter.hidden = !isOpening;
        letterToggle.classList.toggle("is-open", isOpening);
        letterToggle.setAttribute("aria-expanded", String(isOpening));

        const label = letterToggle.querySelector(".letter-button-label");
        if (label) {
            label.textContent = isOpening ? "Close your letter" : "Open your letter";
        }
    });
}

const memoryQuiz = document.getElementById("memory-quiz");
const quizResult = document.getElementById("quiz-result");

if (memoryQuiz && quizResult) {
    const answers = {
        q1: "11/17",
        q2: "takin",
        q3: "bdubs",
        q4: "bathtub",
        q5: "walrus"
    };

    memoryQuiz.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(memoryQuiz);
        let score = 0;

        Object.entries(answers).forEach(([question, answer]) => {
            const fieldset = memoryQuiz.querySelector(`[name="${question}"]`)?.closest("fieldset");
            const selectedAnswer = formData.get(question);
            const isCorrect = selectedAnswer === answer;

            if (isCorrect) {
                score++;
            }

            if (fieldset) {
                fieldset.classList.toggle("is-correct", isCorrect);
                fieldset.classList.toggle("is-incorrect", !isCorrect);
            }
        });

        const totalQuestions = Object.keys(answers).length;
        const message = score === totalQuestions
            ? "A perfect score! Bravo, babe!"
            : score === 0
                ? "-_- You got none correct..."
                : "You got " + score + " out of " + totalQuestions + "! Tsk, tsk, tsk. You can do better than that.";

        quizResult.textContent = message;
        quizResult.hidden = false;
    });
}

const revealElements = document.querySelectorAll(
    "header, .couple-photo, .anniversary-section, main > section, footer"
);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => {
        element.classList.add("reveal");
        revealObserver.observe(element);
    });
}

const travelMapElement = document.getElementById("travel-map");

if (travelMapElement) {
    if (!window.L) {
        console.error("The travel map could not load because Leaflet is unavailable.");
    } else {
        const travelMap = L.map(travelMapElement).setView([39.5, -98.35], 4);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(travelMap);

        const visitedPlaces = [
            {
                name: "La Tourette",
                coordinates: [41.9295, -88.7504],
                photo: "images/la-tourette.jpg",
                caption: "Where our story began."
            },

            {
                name: "Eldorado Springs, Colorado",
                coordinates: [39.9417, -105.2528],
                photo: "images/colorado.jpeg"
            },

            {
                name: "Treasure Island, Florida",
                coordinates: [27.7692, -82.7690],
                photo: "images/florida.jpeg"
            },

            {
                name: "Chicago, Illinois",
                coordinates: [41.8919, -87.6041],
                photo: "images/chicago.png"
            },  
            
            {
                name: "Saint Louis, Missouri",
                coordinates: [38.6247, -90.1848],
                photo: "images/stl.png"
            },

            {
                name: "Medicine Park, Oklahoma",
                coordinates: [34.7292, -98.5026],
                photo: "images/medicine-park.png",
            },

            {
                name: "Town of Brigham, Wisconsin",
                coordinates: [43.0086, -89.9011],
                photo: "images/brigham.png",
            },

            {
                name: "Cincinnati, Ohio",
                coordinates: [39.1031, -84.5120],
                photo: "images/cinci.png",
            },

            {
                name: "Loves Park, Illinois",
                coordinates: [42.3111, -89.05790],
                photo: "images/loves-park.png",
            },

            {
                name: "Matthiessen State Park, Illinois",
                coordinates: [41.2956, -89.0253],
                photo: "images/matthiessen.png",
            },

            {
                name: "Town of Merrimac, Wisconsin",
                coordinates: [43.3867, -89.6722],
                photo: "images/merrimac.png",
            },

            {
                name: "Minneapolis, Minnesota",
                coordinates: [44.9778, -93.2650],
                photo: "images/minneapolis.png",
            },

            {
                name: "Peoria, Illinois",
                coordinates: [40.6936, -89.5890],
                photo: "images/peoria.png",
            },

            {
                name: "Robinson Park, Illinois",
                coordinates: [40.8229, -89.5948],
                photo: "images/robinson-park.png",
            },

            {
                name: "Thunderbird State Park, Oklahoma",
                coordinates: [35.2111, -97.2417],
                photo: "images/thunderbird.png",
            },

            {
                name: "Salt Lick Point, Illinois",
                coordinates: [38.3095, -90.2829],
                photo: "images/salt-lick.png",
            },

            {
                name: "Indiana Dunes State Park, Indiana",
                coordinates: [41.6333, -87.0538],
                photo: "images/indiana-dunes.png",
            },

            {
                name: "Ha Ha Tonka, Missouri",
                coordinates: [37.9742, -92.7631],
                photo: "images/ha-ha-tonka.png",
            },

            {
                name: "Taum Sauk Mountain, Missouri",
                coordinates: [37.5713, -90.7292],
                photo: "images/taum-sauk.png",
            },

            {
                name: "Starved Rock, IL",
                coordinates: [41.3186, -88.9934],
                photo: "images/starved-rock.png",
            },

            {
                name: "Wildwood, Missouri",
                coordinates: [38.5828, -90.6629],
                photo: "images/wildwood.png",
            }

        ];

        visitedPlaces.forEach((place) => {
            const popupContent = document.createElement("div");
            popupContent.className = "travel-popup";

            const photo = document.createElement("img");
            photo.src = place.photo;
            photo.alt = `Photo from ${place.name}`;

            const title = document.createElement("h3");
            title.textContent = place.name;

            const caption = document.createElement("p");
            caption.textContent = place.caption;

            popupContent.append(photo, title, caption);

            L.marker(place.coordinates)
                .addTo(travelMap)
                .bindPopup(popupContent);
        });
    }
}
