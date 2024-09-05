// Jquery Ajax
// $('.search-button').on('click', function () {
//     $.ajax({
//         url: 'http://www.omdbapi.com/?apikey=3ff74d7&s=' + $('.input-keyword').val(),
//         success: results => {
//             const movies = results.Search;
//             let cardMovies = '';
    
//             movies.forEach(m => {
//                 cardMovies += showCards(m);
//             });
//             $('.movie-container').html(cardMovies);
    
//             // ketika tombol di klik
//             $('.modal-detail-button').on('click', function () {
//                 $.ajax({
//                     url: 'http://www.omdbapi.com/?apikey=3ff74d7&i=' + $(this).data('imdbid'),
//                     success: results => {
//                         const modalMovies = showMovieDetail(results);
//                         $('#movieDetailModal').html(modalMovies)
//                     },
//                     error: e => {
//                         console.log(e.responseText);
//                     }
//                 })
//             })
//         },
//         error: e => {
//             console.log(e.responseText);
//         }
//     })
// })


// Fetch Vanilla Javascript
// const searchButton = document.querySelector('.search-button');
// searchButton.addEventListener('click', function () {

//     const inputKeyword = document.querySelector('.input-keyword');
//     const card = document.querySelector('.movie-container');
//     fetch('http://www.omdbapi.com/?apikey=3ff74d7&s=' + inputKeyword.value)
//         .then(response => response.json())
//         .then(response => {
//             const movies = response.Search;
//             let cardMovies = '';
//             movies.forEach(m => {
//                 cardMovies += showCards(m);
//             });
//             card.innerHTML = cardMovies;

//             //ketika tombol di klik
//             const detailMovie = document.querySelectorAll('.modal-detail-button');
//             const modalMovie = document.querySelector('#movieDetailModal');
//             detailMovie.forEach(function (m) {
//                 m.addEventListener('click', function() {
//                     fetch('http://www.omdbapi.com/?apikey=3ff74d7&i=' + m.getAttribute('data-imdbid'))
//                         .then(response => response.json())
//                         .then(response => {
//                             const modalMovies = showMovieDetail(response);
//                             modalMovie.innerHTML = modalMovies;
//                         })
//                         .catch(response => console.log(response));
//                 })
//             })
//         })
//         .catch(response => console.log(response));
// });


// Abstraksi Fetch Vanilla Javascript(refactor)
const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', async function () {
    try {
        const inputKeyword = document.querySelector('.input-keyword');
        const movies = await getMovies(inputKeyword.value);
        updateUI(movies);
    } catch (err) {
        alert(err);
    }
});

// event binding
document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('modal-detail-button')) {
        const detailMovie = await getMovieDetail(e.target.getAttribute('data-imdbid'));
        updateUIDetail(detailMovie);
    };
});

function getMovies(keyword) {
    return fetch('http://www.omdbapi.com/?apikey=3ff74d7&s=' + keyword)
        .then(response => {
            if (!response.ok) {
                throw new Error('Something Went Wrong!');
            };
            return response.json();
        })
        .then(response => {
            if (response.Response === 'False') {
                throw new Error(response.Error);
            };
            return response.Search;
        })
};

function updateUI (movies) {
    const card = document.querySelector('.movie-container');
    let cardMovies = '';
    movies.forEach(m => {
        cardMovies += showCards(m);
    });
    card.innerHTML = cardMovies;
};

function getMovieDetail(imdbid) {
    return fetch('http://www.omdbapi.com/?apikey=3ff74d7&i=' + imdbid)
        .then(response => response.json())
        .then(response => response)
};

function updateUIDetail(response) {
    const modalMovie = document.querySelector('#movieDetailModal');
    const modalMovies = showMovieDetail(response);
    modalMovie.innerHTML = modalMovies;
};






function showCards(m) {
    return `<div class="col-md-3 my-3">
            <div class="card">
                <img src="${m.Poster}" class="card-img-top" alt="">
                <div class="card-body">
                    <h5 class="card-title">${m.Title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
                    <a href="#" class="btn btn-primary modal-detail-button" data-bs-toggle="modal" data-bs-target="#movieDetailModal" data-imdbid="${m.imdbID}">Show Details</a>
                </div>
            </div>
        </div>`
}

function showMovieDetail(results) {
    return `<div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="movieDetailModalLabel">Details Movie</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="container-fluid">
                                    <div class="row">
                                        <div class="col-md-3">
                                            <img src="${results.Poster}" alt="" class="img-fluid">
                                        </div>
                                        <div class="col-md">
                                            <ul class="list-group">
                                                <li class="list-group-item"><h4>${results.Title} (${results.Year})</h4></li>
                                                <li class="list-group-item"><strong>Director : </strong>${results.Director}</li>
                                                <li class="list-group-item"><strong>Actors : </strong> ${results.Actors}</li>
                                                <li class="list-group-item"><strong>Writer : </strong> ${results.Writer}</li>
                                                <li class="list-group-item"><strong>Plot : </strong> ${results.Plot}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>`
}