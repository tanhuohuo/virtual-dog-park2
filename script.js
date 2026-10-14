/* Virtual Dog Park - vanilla JavaScript
 *
 * Main functions, in plain words:
 *   adoptDog()      - reads the form, checks the name, creates the dog object
 *   feedDog()       - adds 10 happiness (never above 100)
 *   playWithDog()   - adds 10 happiness (never above 100)
 *   nextDay()       - adds 1 day, takes away 5 happiness (never below 0)
 *   stageFor(day)   - the single place that decides Puppy / Young Dog / Adult Dog
 *   renderDog()     - paints the dog's current state onto the page
 *   saveDog()       - writes the dog into localStorage
 *   loadDog()       - reads the dog back from localStorage
 *   startOver()     - asks for confirmation, then deletes saved progress
 */

(function () {
    "use strict";

    var STORAGE_KEY = "virtualDogParkPetV1";

    /* Illustration path for each breed. */
    var BREED_IMAGES = {
        "Beagle": "assets/beagle.svg",
        "Golden Retriever": "assets/golden-retriever.svg",
        "Poodle": "assets/poodle.svg"
    };

    /* ---------- Element references ---------- */
    var adoptionForm = document.getElementById("adoption-form");
    var breedSelect = document.getElementById("breed-select");
    var nameInput = document.getElementById("dog-name");
    var adoptBtn = document.getElementById("adopt-btn");
    var formMessage = document.getElementById("form-message");

    var dogPanel = document.getElementById("dog-panel");
    var dogImage = document.getElementById("dog-image");
    var statName = document.getElementById("stat-name");
    var statBreed = document.getElementById("stat-breed");
    var statDay = document.getElementById("stat-day");
    var statStage = document.getElementById("stat-stage");
    var statHappiness = document.getElementById("stat-happiness");

    var growthBar = document.getElementById("growth-bar");
    var growthText = document.getElementById("growth-text");

    var feedBtn = document.getElementById("feed-btn");
    var playBtn = document.getElementById("play-btn");
    var nextDayBtn = document.getElementById("next-day-btn");
    var startOverBtn = document.getElementById("start-over-btn");
    var actionMessage = document.getElementById("action-message");

    /* The one dog we are looking after, or null when nobody is adopted. */
    var currentDog = null;

    /* ---------- Rules ---------- */

    /* Growth stage is decided in exactly one place, so the bar and the text agree. */
    function stageFor(day) {
        if (day <= 1) {
            return "Puppy";
        }
        if (day <= 3) {
            return "Young Dog";
        }
        return "Adult Dog";
    }

    function clamp(value, low, high) {
        return Math.max(low, Math.min(high, value));
    }

    /* ---------- Storage ---------- */

    function saveDog(dog) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dog));
        } catch (err) {
            /* Storage can be blocked in private mode; the page still works without it. */
            actionMessage.textContent = "Note: this browser blocked saving, so progress will not survive a refresh.";
        }
    }

    function loadDog() {
        var raw;
        try {
            raw = localStorage.getItem(STORAGE_KEY);
        } catch (err) {
            return null;
        }
        if (!raw) {
            return null;
        }
        try {
            var parsed = JSON.parse(raw);
            /* Only trust a record that has the fields we expect. */
            if (parsed && typeof parsed.name === "string" && BREED_IMAGES[parsed.breed]) {
                return {
                    name: parsed.name,
                    breed: parsed.breed,
                    day: Number(parsed.day) || 1,
                    happiness: Number(parsed.happiness)
                };
            }
        } catch (err) {
            /* Corrupt data: treat it as no saved dog. */
        }
        return null;
    }

    function clearSavedDog() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (err) {
            /* Nothing useful to do if storage is unavailable. */
        }
    }

    /* ---------- Drawing ---------- */

    function renderDog() {
        if (!currentDog) {
            adoptionForm.hidden = false;
            dogPanel.hidden = true;
            return;
        }

        adoptionForm.hidden = true;
        dogPanel.hidden = false;

        var stage = stageFor(currentDog.day);
        var imagePath = BREED_IMAGES[currentDog.breed];

        /* Use textContent for the name so characters like < and > are shown as text. */
        statName.textContent = currentDog.name;
        statBreed.textContent = currentDog.breed;
        statDay.textContent = String(currentDog.day);
        statStage.textContent = stage;
        statHappiness.textContent = String(currentDog.happiness);

        dogImage.src = imagePath;
        dogImage.alt = "Illustration of the adopted " + currentDog.breed;

        /* Growth bar: three clearly different widths, one per stage. */
        var widthPercent;
        growthBar.className = "growth-fill";
        if (stage === "Puppy") {
            widthPercent = 30;
        } else if (stage === "Young Dog") {
            widthPercent = 65;
            growthBar.classList.add("stage-young");
        } else {
            widthPercent = 100;
            growthBar.classList.add("stage-adult");
        }
        growthBar.style.width = widthPercent + "%";
        growthText.textContent = stage;

        /* The dog illustration also changes size with the stage. */
        dogImage.width = stage === "Puppy" ? 120 : (stage === "Young Dog" ? 150 : 180);
        dogImage.height = dogImage.width;
    }

    /* ---------- Actions ---------- */

    function adoptDog() {
        var breed = breedSelect.value;
        var name = nameInput.value.trim();   /* trim leading and trailing whitespace */

        if (name === "") {
            formMessage.textContent = "Please enter a name before adopting. Spaces inside the name are fine.";
            formMessage.className = "message error";
            return;
        }
        if (name.length > 20) {
            name = name.slice(0, 20);
        }

        currentDog = {
            name: name,
            breed: breed,
            day: 1,
            happiness: 50
        };

        saveDog(currentDog);
        renderDog();

        formMessage.textContent = "";
        formMessage.className = "message";
        actionMessage.textContent = "Welcome, " + currentDog.name + "!";
        actionMessage.className = "message success";
    }

    function addHappiness(amount) {
        if (!currentDog) {
            return;
        }
        currentDog.happiness = clamp(currentDog.happiness + amount, 0, 100);
        saveDog(currentDog);
        renderDog();
    }

    function nextDay() {
        if (!currentDog) {
            return;
        }
        currentDog.day = currentDog.day + 1;
        currentDog.happiness = clamp(currentDog.happiness - 5, 0, 100);
        saveDog(currentDog);
        renderDog();

        var stage = stageFor(currentDog.day);
        actionMessage.textContent = "Day " + currentDog.day + ": " + currentDog.name + " is now a " + stage + ".";
        actionMessage.className = "message";
    }

    function startOver() {
        var confirmed = window.confirm("Start over? This will delete your saved dog and return to the adoption form.");
        if (!confirmed) {
            /* Cancel keeps the dog exactly as it is. */
            return;
        }
        clearSavedDog();
        currentDog = null;
        nameInput.value = "";
        formMessage.textContent = "Your saved dog was cleared. You can adopt a new one.";
        formMessage.className = "message success";
        actionMessage.textContent = "";
        renderDog();
    }

    /* ---------- Wiring ---------- */

    adoptBtn.addEventListener("click", adoptDog);
    feedBtn.addEventListener("click", function () { addHappiness(10); });
    playBtn.addEventListener("click", function () { addHappiness(10); });
    nextDayBtn.addEventListener("click", nextDay);
    startOverBtn.addEventListener("click", startOver);

    /* Pressing Enter in the name box adopts, which is friendlier on a laptop. */
    nameInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            adoptDog();
        }
    });

    /* ---------- Start up ---------- */

    var restored = loadDog();
    if (restored) {
        currentDog = restored;
        actionMessage.textContent = "Welcome back! " + currentDog.name + " was restored from this browser.";
        actionMessage.className = "message success";
    }
    renderDog();
})();
