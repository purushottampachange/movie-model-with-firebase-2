

const cl = console.log;

const movieForm = document.getElementById("movieForm");
const movieName = document.getElementById("movieName");
const movieImg = document.getElementById("movieImg");
const movieDesc = document.getElementById("movieDesc");
const movieRating = document.getElementById("movieRating");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const movieModel = document.getElementById("movieModel");
const backDrop = document.getElementById("backDrop");
const nfxBtn = document.getElementById("nfxBtn");
const closeBtns = document.querySelectorAll(".closeBtns");
const movieContainer = document.getElementById("movieContainer");



const BaseURL = "https://post-task-xhr-default-rtdb.firebaseio.com/";

const postURL = "https://post-task-xhr-default-rtdb.firebaseio.com/movies.json";

const ConvertArr = (obj) => {

    let res = [];

    for (const key in obj) {

        res.unshift({ ...obj[key], id: key });
    }
    return res;
}

const SnackBar = (icon, msg) => {

    Swal.fire({

        title: msg,
        icon: icon,
        timer: 1500
    })
}

const RatingClass = (rating) => {

    if (rating > 8) {

        return "badge-success";
    }
    else if (rating > 6 && rating <= 8) {

        return "badge-warning";
    }
    else {

        return "badge-danger"
    }
}

const onHideShow = () => {

    backDrop.classList.toggle("active");
    movieModel.classList.toggle("active");
}

const MakeAPICall = async (apiURL, method, body) => {

    body = body ? JSON.stringify(body) : null;

    let configObj = {

        method: method,
        body: body,
        header: {

            "content-type": "application/json",
            "auth": "token form local storage"
        }
    }

    try {

        let res = await fetch(apiURL, configObj);

        return res.json();
    }
    catch (err) {

        SnackBar("error", err);
    }
}

const Templating = (arr) => {

    let res = arr.map(m => {

        return `
           
              <div class="col-md-3">
                <div class="card movieCard text-white mb-4">
                    <div class="card-header p-0">
                        <div class="row">
                            <div class="col-10">
                                <h5>${m.title}</h5>
                            </div>
                            <div class="col-2">
                               <h6><span class="badge ${RatingClass(m.rating)}">${m.rating}</span></h6>
                            </div>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <figure>
                            <img src=${m.imgPath}
                                alt="${m.title}">
                            <figcaption>
                                
                                <h6>${m.title}</h6>
                                <p>
                                  ${m.content}
                                </p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between p-0">
                        <button class="btn btn-sm btn-success">Edit</button>
                        <button class="btn btn-sm btn-danger">Remove</button>
                    </div>
                </div>
            </div>
         
        `;
    }).join("")

    movieContainer.innerHTML = res;

}

const FetchMovies = async () => {

    let res = await MakeAPICall(postURL, "GET", null);

    let data = ConvertArr(res);

    Templating(data);
}

FetchMovies();

closeBtns.forEach(b => b.addEventListener("click", onHideShow));
nfxBtn.addEventListener("click", onHideShow);