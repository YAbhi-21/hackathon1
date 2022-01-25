const base_url = "https://api.jikan.moe/v3/search/anime?q=";


function searchAnime(event){

    event.preventDefault();

    const form = new FormData(this);
    const query = form.get("search");

    fetch(`${base_url}${query}&page=1`)
    .then(res=>res.json())
    .then(updateDom)
    .catch(err=>console.warn(err.message));
}

function updateDom(data){

    const searchResults = document.getElementById('search-results');

    const animeByCategories = data.results
        .reduce((acc, anime)=>{

            const {type} = anime;
            if(acc[type] === undefined) acc[type] = [];
            acc[type].push(anime);
            return acc;

        }, {});

        searchResults.innerHTML = Object.keys(animeByCategories).map(key=>{

            const animesHTML = animeByCategories[key]
            .sort((a,b)=>a.episodes-b.episodes)
            .map(anime=>{
                return `
                    <div class="card">
                        <div class="anime-image">
                            <img src="${anime.image_url}">
                        </div>
                        <div class="anime-info">
                            <p>Title - ${anime.title}</p>
                            <p>Start date - ${anime.start_date}</p>
                            <p>End date - ${anime.end_date}</p>
                            <p>Type - ${anime.type}</p>
                            <p>IMDB rating - ${anime.score}</p>
                        </div>
                        
                    </div>
                `
            }).join("");


            return `
                <section>
                    <h3>${key.toUpperCase()}</h3>
                    <div class="this-row">${animesHTML}</div>
                </section>
            `
        }).join("");
}

function pageLoaded(){
    const form = document.getElementById('search_form');
    form.addEventListener("submit", searchAnime);
}


window.addEventListener("load", pageLoaded);