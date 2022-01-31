// ============================================================================
// ************************* login page script start **************************
// ============================================================================

// ***************************** login start *****************************
var page_check = document.querySelector("body > div");

if(localStorage.getItem("user") == null){
    var userData = {
            "user":[
            {"email":"allwyns@axioned.com",
            "password":"Abcd@123",
            "id":101,
            "favorite": [],
            "rating": []
            },
            {"email":"pvaishnavi@axioned.com",
            "password":"Abcd@xyz",
            "id":102,
            "favorite": [],
            "rating": []
            }
            ]
        };
    localStorage.setItem('user',JSON.stringify(userData));

    var value = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem("user",JSON.stringify(value));
}

if(page_check.className == "container login_page"){

    var email = document.querySelector(".login_page .email");
    var password = document.querySelector(".login_page .password");
    var confirm_password = document.querySelector(".login_page .confirm_password");
    var login = document.querySelector('.login_page a[title="Login"]');
    var login_display = document.querySelector(".login_page .login_display");
    
    var email_display = document.querySelector(".login_page .email_display");
    var password_display = document.querySelector(".login_page .password_display");
    var confirm_password_display = document.querySelector(".login_page .confirm_password_display");
    
    var user_obj = JSON.parse(localStorage.getItem("user"));
    
    login.addEventListener('click', function(){
        if(email.value != "" && password.value != ""){
            email_display.innerHTML = "";
            password_display.innerHTML = "";
            for(var i=0; i < user_obj.user.length; i++){
                if(email.value == user_obj.user[i].email && password.value == user_obj.user[i].password)
                {
                    email.innerHTML = "";
                    password.innerHTML = "";
                    login_display.innerHTML = "";
                    var loginData = {"id":user_obj.user[i].id, "email":user_obj.user[i].email};

                    sessionStorage.setItem("login", JSON.stringify(loginData));
                    window.location.replace("index.html");
                    break;
                }
                else{
                    login_display.innerHTML = "Login Email and Password are not match";
                }
            }
        }
        else{
            if(email.value == ""){
                email_display.innerHTML = "Enter Your Email";
            }
            else{
                email_display.innerHTML = "";
            }
    
            if(password.value == ""){
                password_display.innerHTML = "Enter Your Password";
            }
            else{
                password_display.innerHTML = "";
            }
        }
    });
}

// ***************************** login end *****************************

// ============================================================================
// ************************** login page script end ***************************
// ============================================================================


// ============================================================================
// *********************** home/index page script start ***********************
// ============================================================================
page_check = document.querySelector("body > div");

if(page_check.className != "container login_page"){

    var sessionObj = JSON.parse(sessionStorage.getItem("login"));
    var user_obj = JSON.parse(localStorage.getItem("user"));
    if(sessionObj == null){
        window.location.replace("login.html");
    }
    else{
        for(var i = 0; i < user_obj.user.length; i++){
            var sessionCreated = false;
            if(sessionObj.email == user_obj.user[i].email && sessionObj.id == user_obj.user[i].id){
                sessionCreated = true;
                break;
            }
            else{
                sessionCreated = false;
            }
        }

        if(sessionCreated == false){
            window.location.replace("login.html");
        }
    }

    var logout_btn = document.querySelector('a[title="Logout"]');

    logout_btn.addEventListener("click", function(){
        sessionStorage.removeItem("login");
        window.location.replace("login.html");
    });

    // ***************************** mobile menu view start *****************************
    var search_icon = document.querySelector(".search_icon");
    var close_icon = document.querySelector(".close_icon");
    var menu_icon = document.querySelector(".menu_icon");
    var search_panel = document.querySelector(".search_panel");
    var nav = document.querySelector(".home_mod nav");

    search_icon.addEventListener("click", function(){
        search_panel.classList.add("display");
        close_icon.classList.add("inline_block");
        search_icon.classList.add("hide");
    });

    close_icon.addEventListener("click", function(){
        search_panel.classList.remove("display");
        close_icon.classList.remove("inline_block");
        search_icon.classList.remove("hide");
    });

    menu_icon.addEventListener("click", function(){
        nav.classList.toggle("display");
        var body = document.querySelector("body");
        body.classList.toggle("stop_scroll");
    });
    // ***************************** mobile menu view end *****************************
    
    // ***************************** search with api request start *****************************
    
    var search_input = document.querySelector(".home_mod .search_box input");
    var close_btn = document.querySelector('.home_mod .search_box a[title="Close"]');
    var search_panel_li = document.querySelectorAll(".home_mod .search_panel ul li");
    var search_panel_ul = document.querySelector(".home_mod .search_panel ul");
    close_btn.addEventListener("click", function(){
        search_input.value = "";
        search_panel_ul.classList.remove("display");
        clear_search_query();
        close_btn.classList.remove("display");
    });
    
    search_input.addEventListener('keyup', function(){
        if(search_input.value != ""){
            close_btn.classList.add("display");
            search_panel_ul.classList.add("display");
            search_box_load();
        }
        else{
            close_btn.classList.remove("display");
            search_panel_ul.classList.remove("display");
        }
        search_panel_li = document.querySelectorAll(".home_mod .search_panel ul li");
        if(search_panel_li[1] == undefined){
            search_panel_ul.classList.remove("display");
        }
    });
    
    function search_box_load(){
        var xhttp = new XMLHttpRequest();
    
        xhttp.open('GET', "https://api.themoviedb.org/3/search/movie?api_key=22ea51bd991e53490cba480db454673a&query="+search_input.value, true);
        
        xhttp.onload = function(){
            if(this.status == 200){
                var search_obj = JSON.parse(this.responseText);
                clear_search_query();
                for(var i = 0; i < 5; i++){
                    var li_element = document.createElement("li");
                    var a_element = document.createElement("a");
    
                    a_element.href = "detail.html?movie&"+search_obj.results[i].id;
                    a_element.innerHTML = search_obj.results[i].title;
                    li_element.appendChild(a_element);
                    search_panel_ul.appendChild(li_element);
                }
            }
            else{
                console.error("error");
            }
        }
        
        xhttp.send();
    }
    
    function clear_search_query(){
        var clear_list = document.querySelectorAll(".home_mod .search_panel ul li")
        clear_list.forEach(function(element){
            element.remove();
        });
    }
    // ***************************** search with api request end *****************************
    
    // ***************************** top rated movies api request start *****************************
    
    var top_rated_lists_img = document.querySelectorAll(".home_mod .top_rated_movies .slider li img");
    var top_rated_lists_title = document.querySelectorAll(".home_mod .top_rated_movies .slider li .movie_name");
    var top_rated_lists_img_link = document.querySelectorAll(".home_mod .top_rated_movies .movie_image");
    
    top_rated_load();
    function top_rated_load(){
        var xhttp = new XMLHttpRequest();
    
        xhttp.open('GET', "https://api.themoviedb.org/3/movie/top_rated?api_key=22ea51bd991e53490cba480db454673a", true);
        
        xhttp.onload = function(){
            if(this.status == 200){
                var obj = JSON.parse(this.responseText);
                for(var i = 0; i < top_rated_lists_img.length; i++){
                    top_rated_lists_img[i].src = "https://image.tmdb.org/t/p/w154/"+obj.results[i].poster_path;
                    top_rated_lists_title[i].innerHTML = obj.results[i].title;
                    top_rated_lists_img[i].title = obj.results[i].title;
                    top_rated_lists_title[i].title = obj.results[i].title;
                    top_rated_lists_img_link[i].href = "detail.html?movie&"+obj.results[i].id;
                    top_rated_lists_title[i].href = "detail.html?movie&"+obj.results[i].id;
                }
            }
            else{
                console.error("error");
            }
        }
        
        xhttp.send();
    }
    
    // ***************************** top rated movies api request end *****************************
    
    // ***************************** most popular movies api request start *****************************
    
    var pop_list_img = document.querySelectorAll(".home_mod .most_popular_movies .slider li img");
    var pop_list_title = document.querySelectorAll(".home_mod .most_popular_movies .slider li .movie_name");
    var pop_list_img_link = document.querySelectorAll(".home_mod .most_popular_movies .movie_image");
    
    popular_load();
    function popular_load(){
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET',"https://api.themoviedb.org/3/movie/popular?api_key=22ea51bd991e53490cba480db454673a",true);
    
        xhttp.onload = function(){
            if(this.status == 200){
                var pop_obj = JSON.parse(this.responseText);
                for(var i=0; i < pop_list_img.length; i++){
                    pop_list_img[i].src = "https://image.tmdb.org/t/p/w154/"+pop_obj.results[i].poster_path;
                    pop_list_img[i].title = pop_obj.results[i].title;
                    pop_list_title[i].innerHTML = pop_obj.results[i].title;
                    pop_list_title[i].title = pop_obj.results[i].title;
                    pop_list_img_link[i].href = "detail.html?movie&"+pop_obj.results[i].id;
                    pop_list_title[i].href = "detail.html?movie&"+pop_obj.results[i].id;
                }
            }
            else{
                console.error("error");
            }
        };
    
        xhttp.send();
    }
    
    // ***************************** most popular movies api request end *****************************
    
    // ***************************** now playing movies api request start *****************************
    
    var nowPlay_list_img = document.querySelectorAll(".home_mod .now_playing_movies .slider li img");
    var nowPlay_list_title = document.querySelectorAll(".home_mod .now_playing_movies .slider li .movie_name");
    var nowPlay_list_img_link = document.querySelectorAll(".home_mod .now_playing_movies .movie_image");
    
    nowplay_load();
    function nowplay_load(){
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET","https://api.themoviedb.org/3/movie/now_playing?api_key=22ea51bd991e53490cba480db454673a",true);
        
        xhttp.onload = function(){
            if(this.status == 200){
                var nowplay_obj = JSON.parse(this.responseText);
                for(var i=0; i<nowPlay_list_img.length; i++){
                    nowPlay_list_img[i].src = "https://image.tmdb.org/t/p/w154/"+nowplay_obj.results[i].poster_path;
                    nowPlay_list_img[i].title = nowplay_obj.results[i].title;
                    nowPlay_list_title[i].innerHTML = nowplay_obj.results[i].title;
                    nowPlay_list_title[i].title = nowplay_obj.results[i].title;
                    nowPlay_list_img_link[i].href = "detail.html?movie&"+nowplay_obj.results[i].id;
                    nowPlay_list_title[i].href = "detail.html?movie&"+nowplay_obj.results[i].id;
                }
            }
            else{
                console.error("error");
            }
        }
        
        xhttp.send();
    }
    
    // ***************************** now playing movies api request end *****************************
    
    // ***************************** upcoming movies api request start *****************************
    
    var upcoming_list_img = document.querySelectorAll(".home_mod .upcoming_movies .slider li img");
    var upcoming_list_title = document.querySelectorAll(".home_mod .upcoming_movies .slider li .movie_name");
    var upcoming_list_img_link = document.querySelectorAll(".home_mod .upcoming_movies .movie_image");
    
    upcoming_load();
    function upcoming_load(){
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET","https://api.themoviedb.org/3/movie/upcoming?api_key=22ea51bd991e53490cba480db454673a",true);
        
        xhttp.onload = function(){
            if(this.status == 200){
                var upcoming_obj = JSON.parse(this.responseText);
                for(var i=0; i<upcoming_list_img.length; i++){
                    upcoming_list_img[i].src = "https://image.tmdb.org/t/p/w154/"+upcoming_obj.results[i].poster_path;
                    upcoming_list_img[i].title = upcoming_obj.results[i].title;
                    upcoming_list_title[i].innerHTML = upcoming_obj.results[i].title;
                    upcoming_list_title[i].title = upcoming_obj.results[i].title;
                    upcoming_list_img_link[i].href = "detail.html?movie&"+upcoming_obj.results[i].id;
                    upcoming_list_title[i].href = "detail.html?movie&"+upcoming_obj.results[i].id;
                }
            }
            else{
                console.error("error");
            }
        }
    
        xhttp.send();
    }
    
    // ***************************** upcoming movies api request end *****************************
    
    // ***************************** trending api request start *****************************
    
    var trend_list_img = document.querySelectorAll(".home_mod .trending .slider li img");
    var trend_list_title = document.querySelectorAll(".home_mod .trending .slider li .movie_name");
    var trend_list_img_link = document.querySelectorAll(".home_mod .trending .movie_image");
    
    trend_load()
    function trend_load(){
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET","https://api.themoviedb.org/3/trending/movie/day?api_key=22ea51bd991e53490cba480db454673a",true);
        
        xhttp.onload = function(){
            if(this.status == 200){
                var trend_obj = JSON.parse(this.responseText);
                for(var i=0; i<trend_list_img.length; i++){
                    trend_list_img[i].src = "https://image.tmdb.org/t/p/w154/"+trend_obj.results[i].poster_path;
                    trend_list_img[i].title = trend_obj.results[i].title;
                    trend_list_title[i].innerHTML = trend_obj.results[i].title;
                    trend_list_title[i].title = trend_obj.results[i].title;
                    trend_list_img_link[i].href = "detail.html?movie&"+trend_obj.results[i].id;
                    trend_list_title[i].href = "detail.html?movie&"+trend_obj.results[i].id;
                }
            }
            else{
                console.error("error");
            }
        }
    
        xhttp.send();
    }
    
    // ***************************** trending api request end *****************************
}

// ============================================================================
// ************************ home/index page script end ************************
// ============================================================================

// ============================================================================
// *********************** view more page script start ************************
// ============================================================================
page_check = document.querySelector("body > div");

if(page_check.className == "container home_mod view_more_mod"){

    var sessionObj = JSON.parse(sessionStorage.getItem("login"));
    var user_obj = JSON.parse(localStorage.getItem("user"));
    if(sessionObj == null){
        window.location.replace("login.html");
    }
    else{
        for(var i = 0; i < user_obj.user.length; i++){
            var sessionCreated = false;
            if(sessionObj.email == user_obj.user[i].email && sessionObj.id == user_obj.user[i].id){
                sessionCreated = true;
                break;
            }
            else{
                sessionCreated = false;
            }
        }

        if(sessionCreated == false){
            window.location.replace("login.html");
        }
    }

    // ***************************** movie/tv shows list api start *****************************
    var view_more_list = document.querySelector('.view_more_mod .view_more_list');
    var paginated_no = 1;
    
    // url decode start
    var url_string = location.search.substring(1);
    var url_data = url_string.split("&");
    var title_value = url_data[0];
    var title = decodeURI(title_value);
    var medium = url_data[1];
    var category = url_data[2];
    var time = url_data[3];
    // url decode end

    if(url_string == ""){
        window.location.replace("login.html");
    }

    var section_title = document.querySelector(".section_title");
    section_title.innerHTML = title;
    
    top_rated_view_more_load();
    function top_rated_view_more_load(){
        var xhttp = new XMLHttpRequest();
        
        if(time == undefined){
            xhttp.open('GET', "https://api.themoviedb.org/3/"+medium+"/"+category+"?api_key=22ea51bd991e53490cba480db454673a&page="+paginated_no, true);
        }
        else{
            xhttp.open('GET', "https://api.themoviedb.org/3/"+medium+"/"+category+"/"+time+"?api_key=22ea51bd991e53490cba480db454673a&page="+paginated_no, true);
        }
        
        xhttp.onload = function(){
            if(this.status == 200){
                var obj = JSON.parse(this.responseText);
                var view_more_list_li = document.querySelectorAll('.view_more_mod .view_more_list li');
                view_more_list_li.forEach(function(e){
                    e.remove();
                });
                for(var i = 0; i < obj.results.length; i++){
                    var li_element = document.createElement("li");
                    var a_element = document.createElement("a");
                    var img_link = document.createElement("a");   
                    var img_element = document.createElement("img"); 
                    var figure_element = document.createElement("figure"); 
                    var div1_element = document.createElement("div"); 
                    var div2_element = document.createElement("div"); 
                    var rating_element = document.createElement("span");
                    var release_element = document.createElement("span");
                    
                    
                    release_element.innerHTML = obj.results[i].release_date;
                    rating_element.innerHTML = obj.results[i].vote_average;
                    img_element.src = "https://image.tmdb.org/t/p/w92/"+obj.results[i].poster_path;
                    img_element.title = obj.results[i].title;
                    img_link.href = "detail.html?movie&"+obj.results[i].id;
                    a_element.href = "detail.html?movie&"+obj.results[i].id;
                    a_element.innerHTML = obj.results[i].title;
                    figure_element.appendChild(img_element);
                    img_link.appendChild(figure_element);
                    div1_element.appendChild(img_link);
                    div1_element.appendChild(a_element);
                    div2_element.appendChild(rating_element);
                    div2_element.appendChild(release_element);
                    li_element.appendChild(div1_element);
                    li_element.appendChild(div2_element);
                    view_more_list.appendChild(li_element);
                }
            }
            else{
                console.error("error");
            }
        }
        
        xhttp.send();
    }

    var paginated_li = document.querySelectorAll(".paginated_list li");
    paginated_li.forEach(function(e){
        e.addEventListener('click', function(){
            paginated_no = e.innerHTML;
            top_rated_view_more_load();
            paginated_li.forEach(function(event){
                event.classList.remove("paginated_active");
            });
            e.classList.add("paginated_active");
        });
    });
    // ***************************** movie/tv shows list api request end *****************************    
}

// ============================================================================
// ************************ view more page script end ************************
// ============================================================================


// ============================================================================
// *********************** detail.html page script start ************************
// ============================================================================
page_check = document.querySelector("body > div");

if(page_check.className == "container home_mod detail_mod"){

    var sessionObj = JSON.parse(sessionStorage.getItem("login"));
    var user_obj = JSON.parse(localStorage.getItem("user"));
    if(sessionObj == null){
        window.location.replace("login.html");
    }
    else{
        for(var i = 0; i < user_obj.user.length; i++){
            var sessionCreated = false;
            if(sessionObj.email == user_obj.user[i].email && sessionObj.id == user_obj.user[i].id){
                sessionCreated = true;
                break;
            }
            else{
                sessionCreated = false;
            }
        }

        if(sessionCreated == false){
            window.location.replace("login.html");
        }
    }

    // ***************************** movie/tv shows detail api start *****************************
    var poster_img = document.querySelector(".detail_section .post_image img");
    var title = document.querySelector(".detail_section .title_box h2");
    var release_date = document.querySelector(".detail_section .title_box .release_date");
    var genres = document.querySelector(".detail_section .title_box .genres");
    var user_score = document.querySelector(".detail_section .user_score .score");
    var overview = document.querySelector(".detail_section .overview p");
    
    // url decode start
    var url_string = location.search.substring(1);
    var url_data = url_string.split("&");
    var medium = url_data[0];
    var id = url_data[1];
    // url decode end

    if(url_string == ""){
        window.location.replace("login.html");
    }
    
    detail_load();
    function detail_load(){
        var xhttp = new XMLHttpRequest();
        
        xhttp.open('GET', "https://api.themoviedb.org/3/"+medium+"/"+id+"?api_key=22ea51bd991e53490cba480db454673a", true);
        
        xhttp.onload = function(){
            if(this.status == 200){
                var obj = JSON.parse(this.responseText);
                poster_img.src = "https://image.tmdb.org/t/p/w300/"+obj.poster_path;
                title.innerHTML = obj.title;
                var date = obj.release_date;
                release_date.innerHTML = date.replaceAll("-","/");
                genres.innerHTML = "";
                obj.genres.forEach(function(e){
                    var span_element = document.createElement("span");
                    span_element.innerHTML += e.name;
                    genres.appendChild(span_element);
                });
                user_score.innerHTML = obj.vote_average*10+"%";
                overview.innerHTML = obj.overview;
            }
            else{
                console.error("error");
            }
        }
        
        xhttp.send();
    }


    var crew_li = document.querySelectorAll(".detail_section .crew li");
    var crew_ul = document.querySelector(".detail_section .crew");

    // crew list api request start
    crew_load();
    function crew_load(){
        var xhttp = new XMLHttpRequest();
        
        xhttp.open('GET', "https://api.themoviedb.org/3/"+medium+"/"+id+"/credits?api_key=22ea51bd991e53490cba480db454673a", true);
        
        xhttp.onload = function(){
            if(this.status == 200){
                var crew_obj = JSON.parse(this.responseText);
                crew_li.forEach(function(e){
                    e.remove();
                });
                for(var i=0; i < crew_obj.crew.length; i++){
                    if(crew_obj.crew[i].job == "Director"){
                        var li_element = document.createElement("li");
                        var job_element = document.createElement("span");
                        var name_element = document.createElement("span");

                        job_element.innerHTML = "Director";
                        name_element.innerHTML = crew_obj.crew[i].name;
                        li_element.appendChild(name_element);
                        li_element.appendChild(job_element);
                        crew_ul.appendChild(li_element);
                    }

                    if(crew_obj.crew[i].job == "Producer"){
                        var li_element = document.createElement("li");
                        var job_element = document.createElement("span");
                        var name_element = document.createElement("span");

                        job_element.innerHTML = "Producer";
                        name_element.innerHTML = crew_obj.crew[i].name;
                        li_element.appendChild(name_element);
                        li_element.appendChild(job_element);
                        crew_ul.appendChild(li_element);
                    }
                }
                for(var i=0; i < 2; i++){
                    if(crew_obj.cast[i].known_for_department == "Acting"){
                        var li_element = document.createElement("li");
                        var job_element = document.createElement("span");
                        var name_element = document.createElement("span");

                        job_element.innerHTML = "Acting";
                        name_element.innerHTML = crew_obj.cast[i].name;
                        li_element.appendChild(name_element);
                        li_element.appendChild(job_element);
                        crew_ul.appendChild(li_element);
                    }
                }
            }
            else{
                console.error("error");
            }
        }
        
        xhttp.send();
    }
    // crew list api request end

    // add favorite start

    var favorite_btn = document.querySelector(".favorite");
    var login_obj = JSON.parse(sessionStorage.getItem("login"));
    var user_obj = JSON.parse(localStorage.getItem("user"));

    favorite_check();
    function favorite_check(){
        for(var i=0; i<user_obj.user.length; i++){
            if(login_obj.email == user_obj.user[i].email){
                if(user_obj.user[i].favorite.length == 0){
                    favorite_btn.classList.remove("like");
                }
                else{
                    for(var j=0; j<user_obj.user[i].favorite.length;j++){
                        if(user_obj.user[i].favorite[j].movie_id==id){
                            favorite_btn.classList.add("like");
                            break;
                        }
                        else{
                            favorite_btn.classList.remove("like");
                        }
                    }
                }
            }
        }
    }

    favorite_btn.addEventListener("click", function(){
        for(var i=0; i<user_obj.user.length; i++){
            if(login_obj.email == user_obj.user[i].email){
                if(user_obj.user[i].favorite.length == 0){
                    var value = {"movie_id": id};
                    user_obj.user[i].favorite.push(value);
                    localStorage.setItem("user",JSON.stringify(user_obj));
                    favorite_check();
                }
                else{
                    var new_movie_id = false;
                    for(var j=0; j<user_obj.user[i].favorite.length;j++){
                        if(user_obj.user[i].favorite[j].movie_id==id){
                            new_movie_id = false;
                            break;
                        }
                        else{
                            new_movie_id = true;
                        }
                    }

                    if(new_movie_id){
                        var value = {"movie_id": id};
                        user_obj.user[i].favorite.push(value);
                        localStorage.setItem("user",JSON.stringify(user_obj));
                        favorite_check();
                    }
                    else{
                        var value = {"movie_id": id};
                        user_obj.user[i].favorite.pop(value);
                        localStorage.setItem("user",JSON.stringify(user_obj));
                        favorite_check();
                    }
                }
            }
        }
    });
    // add favorite end

    // rating start
    var user_rating_list = document.querySelectorAll(".user_rating li");

    user_rating_list.forEach(function(e){
        var star_index = Array.prototype.indexOf.call(user_rating_list, e);
        e.addEventListener("mouseover",function(n){
            for(var i=0; i <= star_index; i++){
                user_rating_list[i].children[0].classList.add("star");
            }

        });

        e.addEventListener("mouseout",function(n){
            for(var i=0; i <= star_index; i++){
                user_rating_list[i].children[0].classList.remove("star");
            }
            star_check();
        });

        e.addEventListener("click", function(){ star_click(star_index)});
    });

    function star_click(e){
        var star_rating = e+1;
        for(var i=0; i<user_obj.user.length; i++){
            if(login_obj.email == user_obj.user[i].email){
                if(user_obj.user[i].rating.length == 0){
                    var value = {"movie_id": id,"rating": star_rating};
                    user_obj.user[i].rating.push(value);
                    localStorage.setItem("user",JSON.stringify(user_obj));
                    star_check();
                    break;
                }
                else{
                    var new_movie_id = false;
                    for(var j=0; j<user_obj.user[i].rating.length;j++){
                        if(user_obj.user[i].rating[j].movie_id==id){
                            new_movie_id = false;
                            break;
                        }
                        else{
                            new_movie_id = true;
                        }
                    }

                    if(new_movie_id){
                        var value = {"movie_id": id,"rating":star_rating};
                        user_obj.user[i].rating.push(value);
                        localStorage.setItem("user",JSON.stringify(user_obj));
                        star_check();
                    }
                    else{
                        var value = {"movie_id": id,"rating":star_rating};
                        user_obj.user[i].rating[j] = value;
                        localStorage.setItem("user",JSON.stringify(user_obj));
                        star_check();
                    }
                }
            }
        }
    }

    star_check();
    function star_check(){
        for(var i=0; i<user_obj.user.length; i++){
            if(login_obj.email == user_obj.user[i].email){
                if(user_obj.user[i].rating.length == 0){
                    user_rating_list[i].children[0].classList.remove("star");
                }
                else{
                    for(var j=0; j < user_obj.user[i].rating.length; j++){
                        if(user_obj.user[i].rating[j].movie_id==id){
                            var num_star = user_obj.user[i].rating[j].rating;

                            user_rating_list.forEach(function(e){
                                e.children[0].classList.remove("star");
                            });
                            for(var k=0; k<num_star; k++){
                                user_rating_list[k].children[0].classList.add("star");
                            }
                        }
                    }
                }
            }
        }
    }

    var rating_panel = document.querySelector(".rating_panel");
    var clear_stars = document.querySelector(".clear_stars");
    
    rating_panel.addEventListener("mouseover", function(){
        clear_stars.classList.add("display");
    });

    rating_panel.addEventListener("mouseout", function(){
        clear_stars.classList.remove("display");
    });

    clear_stars.addEventListener("click", function(){
        for(var i=0; i<user_obj.user.length; i++){
            if(login_obj.email == user_obj.user[i].email){
                if(user_obj.user[i].rating.length != 0){
                    for(var j=0; j<user_obj.user[i].rating.length;j++){

                        if(user_obj.user[i].rating[j].movie_id==id){
                            var value = user_obj.user[i].rating[j].rating;

                            user_obj.user[i].rating.pop(value);
                            localStorage.setItem("user",JSON.stringify(user_obj));
                            user_rating_list.forEach(function(e){
                                e.children[0].classList.remove("star");
                            });
                        }
                    }
                }
            }
        }
    });
    
    // rating end
    
 
    // ***************************** movie/tv shows detail api request end *****************************    
}

// ============================================================================
// ************************ detail.html page script end ************************
// ============================================================================


// ============================================================================
// *********************** search.html page script start **********************
// ============================================================================
page_check = document.querySelector("body > div");

if(page_check.className == "container home_mod search_mod"){

    var sessionObj = JSON.parse(sessionStorage.getItem("login"));
    var user_obj = JSON.parse(localStorage.getItem("user"));
    if(sessionObj == null){
        window.location.replace("login.html");
    }
    else{
        for(var i = 0; i < user_obj.user.length; i++){
            var sessionCreated = false;
            if(sessionObj.email == user_obj.user[i].email && sessionObj.id == user_obj.user[i].id){
                sessionCreated = true;
                break;
            }
            else{
                sessionCreated = false;
            }
        }

        if(sessionCreated == false){
            window.location.replace("login.html");
        }
    }

    // ***************************** search result list start *****************************
    var search_result_list = document.querySelector(".search_mod .search_result");
    
    // url data start
    var url_string = location.search.substring(8);
    var url_data = url_string.replaceAll("+"," ");
    // url data end

    if(url_string == ""){
        window.location.replace("login.html");
    }

    search_result_list_load();
    function search_result_list_load(){
        var xhttp = new XMLHttpRequest();
        
        xhttp.open('GET', "https://api.themoviedb.org/3/search/movie?api_key=22ea51bd991e53490cba480db454673a&query="+url_data, true);
        
        xhttp.onload = function(){
            if(this.status == 200){
                var obj = JSON.parse(this.responseText);
                var search_result_list_li = document.querySelectorAll(".search_mod .search_result li");
                search_result_list_li.forEach(function(e){
                    e.remove();
                });
                for(var i = 0; i < obj.results.length; i++){
                    var li_element = document.createElement("li");
                    var a_element = document.createElement("a");
                    var img_link = document.createElement("a");   
                    var img_element = document.createElement("img"); 
                    var figure_element = document.createElement("figure"); 
                    var div_element = document.createElement("div"); 
                    var details_element = document.createElement("div"); 
                    var release_element = document.createElement("span");
                    var overview_element = document.createElement("p");
                    
                    
                    var date = obj.results[i].release_date;
                    release_element.innerHTML = date.replaceAll("-","/");
                    img_element.src = "https://image.tmdb.org/t/p/w92/"+obj.results[i].poster_path;
                    img_element.title = obj.results[i].title;
                    overview_element.innerHTML = obj.results[i].overview;
                    img_link.href = "detail.html?movie&"+obj.results[i].id;
                    a_element.href = "detail.html?movie&"+obj.results[i].id;
                    a_element.innerHTML = obj.results[i].title;
                    figure_element.appendChild(img_element);
                    img_link.appendChild(figure_element);
                    div_element.appendChild(a_element);
                    div_element.appendChild(release_element);
                    li_element.appendChild(img_link);
                    details_element.appendChild(div_element);
                    details_element.appendChild(overview_element);
                    li_element.appendChild(details_element);
                    search_result_list.appendChild(li_element);
                }
            }
            else{
                console.error("error");
            }
        }
        
        xhttp.send();
    }

    // ***************************** search result list request end *****************************    
}

// ============================================================================
// ************************ search.html page script end ***********************
// ============================================================================

