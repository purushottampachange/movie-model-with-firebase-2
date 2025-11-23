

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

    movieForm.reset();
    submitBtn.classList.remove("d-none");
    updateBtn.classList.add("d-none");
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
           
              <div class="col-md-3" id="${m.id}">
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
                        <button class="btn btn-sm btn-success" onclick = "onEdit(this)">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick = "onRemove(this)">Remove</button>
                    </div>
                </div>
            </div>
         
        `;
    }).join("")

    movieContainer.innerHTML = res;

}

const CreateMovie = (m, id) => {

    let div = document.createElement("div");

    div.className = "col-md-3";

    div.id = id;

    div.innerHTML = `
         
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
                        <button class="btn btn-sm btn-success" onclick = "onEdit(this)">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick = "onRemove(this)">Remove</button>
                    </div>
                </div>
     
    `;

    movieContainer.prepend(div);
}

const PatchData = (obj) => {

    movieName.value = obj.title;
    movieImg.value = obj.imgPath;
    movieDesc.value = obj.content;
    movieRating.value = obj.rating;

    submitBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");
}

const UIUpdata = (m) => {

    let card = document.getElementById(m.id);

    card.innerHTML = `
    
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
                        <button class="btn btn-sm btn-success" onclick = "onEdit(this)">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick = "onRemove(this)">Remove</button>
                    </div>
                </div>
     
    
    `;

    onHideShow();

    
}

const FetchMovies = async () => {

    let res = await MakeAPICall(postURL, "GET", null);

    let data = ConvertArr(res);

    Templating(data);
}

FetchMovies();

const onEdit = async (ele) => {

    let EDIT_ID = ele.closest(".col-md-3").id;

    localStorage.setItem("EDIT_ID", EDIT_ID);

    let EDIT_URL = `${BaseURL}/movies/${EDIT_ID}.json`;

    let res = await MakeAPICall(EDIT_URL, "GET", null);

    onHideShow();

    PatchData(res);
}

const onUpdate = async () => {

    let UPDATE_ID = localStorage.getItem("EDIT_ID");

    let UPDATE_URL = `${BaseURL}/movies/${UPDATE_ID}.json`;

    let UPDATE_OBJ = {

        title: movieName.value,
        content: movieDesc.value,
        imgPath: movieImg.value,
        rating: movieRating.value,
        id: UPDATE_ID
    }

    let res = await MakeAPICall(UPDATE_URL, "PATCH", UPDATE_OBJ);

    UIUpdata(res);
}

const onSubmit = async (eve) => {

    eve.preventDefault();

    let movieObj = {

        title: movieName.value,
        content: movieDesc.value,
        imgPath: movieImg.value,
        rating: movieRating.value
    }

    let res = await MakeAPICall(postURL, "POST", movieObj);

    CreateMovie(movieObj, res.name);

    onHideShow();

}

closeBtns.forEach(b => b.addEventListener("click", onHideShow));
nfxBtn.addEventListener("click", onHideShow);
movieForm.addEventListener("submit", onSubmit);
updateBtn.addEventListener("click", onUpdate);
