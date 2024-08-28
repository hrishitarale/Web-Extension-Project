isLocation();

const wrapper = document.querySelector(".wrapper"),
    searchInput = wrapper.querySelector("input"),
    volume = wrapper.querySelector(".word i"),
    infoText = wrapper.querySelector(".info-text"),
    synonyms = wrapper.querySelector(".synonyms .list"),
    removeIcon = wrapper.querySelector(".search span");
let audio;

function data(result, word) {
    // console.log(result);
    if (result?.title !== undefined && result?.title !== '') {
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    } else {
        wrapper.classList.add("active");
        let definitions = result[0].meanings[0].definitions[0];
        phontetics = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phontetics;
        document.querySelector(".meaning span").innerText = definitions?.definition;
        document.querySelector(".example span").innerText = definitions?.example;
        audio = new Audio(result[0].phonetics[0].audio);

        if (definitions.synonyms[0] == undefined) {
            synonyms.parentElement.style.display = "none";
        } else {
            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML = "";
            for (let i = 0; i < 5; i++) {
                let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;
                tag = i == 4 ? tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>` : tag;
                synonyms.insertAdjacentHTML("beforeend", tag);
            }
        }
    }
}

function search(word) {
    fetchApi(word);
    searchInput.value = word;
}

// function fetchApi(word) {
//     wrapper.classList.remove("active");
//     infoText.style.color = "#000";
//     infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
//     let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
//     fetch(url).then(response => response.json()).then(result => data(result, word)).catch(() => {
//         infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
//     });
// }

searchInput.addEventListener("keyup", e => {
    let word = e.target.value.replace(/\s+/g, ' ');
    if (e.key == "Enter" && word) {
        // fetchApi(word);
        saveWordHistory(word);
    }
});

volume.addEventListener("click", () => {
    volume.style.color = "#4D59FB";
    audio.play();
    setTimeout(() => {
        volume.style.color = "#999";
    }, 800);
});

removeIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#9A9A9A";
    infoText.innerHTML = "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});

function saveWordHistory(word) {
    // console.log(word);
    const Url = `http://localhost:1107/user/search/${word}`; // user/search/meaning
    methodGET(Url).then(res => {
        // Process the response res here 
        // Example: Logging the res to the console 
        if (res?.status === 'SUCCESS') {
            // console.log('user/search/meaning', res);
            data(res?.data, word)
        }
    }).catch(error => {
        // Handle any errors here 
        console.error(error); // Example: Logging the error to the console 
        if (error?.status !== 'SUCCESS') {
            infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
        }
    });
}