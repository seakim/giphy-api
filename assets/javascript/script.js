
/////
// update buttons
/////
var recent = ['car', 'dog', 'funny', 'party'];
renderBtn();

function renderBtn() {
    $(".btn-container").empty();

    // 1. does not work
    // for (var i = 0; i < recent.length; i++) {
    //     var queryURL = buildQueryURLRand1(recent[i]);
    //     // IIFE to create own function closure. (i in for loop returns max)  Note: passing cntr instead of i inside of 'then'
    //     (function (cntr) {
    //         $.ajax({
    //             url: queryURL,
    //             method: "GET"
    //         }).then(updateBtn); 
    //         // //// two problems with using this callback:
    //         // ////  1. cannot get recent[i]
    //         // ////  2. it's returning only the last data using for loop
    //         //closing with i
    //     })(i);
    // }

    // 2. works 
    // for (var i = 0; i < recent.length; i++) {
    //     var queryURL = buildQueryURLRand1(recent[i]);
    //     // IIFE to create own function closure. (i in for loop returns max)  Note: passing cntr instead of i inside of 'then'
    //     (function (cntr) { //
    //         $.ajax({
    //             url: queryURL,
    //             method: "GET"
    //         }).then(function (response) { 
    //             var fixedHeightURL = response.data.images.fixed_height.url; 
    //             var btnContainer = $('<button class="giphy-btn">'); 
    //             btnContainer.attr('data-attr', recent[cntr]); 
    //             btnContainer.attr('style', 'background: url(' + fixedHeightURL + ')'); 
    //             btnContainer.text(recent[cntr]); // how do I get this on general basis
    //             var giphyContainer = $('<div class="btn-inner col-sm-3">'); 
    //             giphyContainer.append(btnContainer); 
    //             $('.btn-container').prepend(giphyContainer); 
    //         }); 
    //         //closing with i
    //     })(i); //
    // }

    // 3. works: each wait for the callbacks
    recent.forEach( function (e) {
        var queryURL = buildQueryURLRand1(e);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(updateBtn); 
    });
};
/**
 * @returns {string} pulls information from the input and build the query URL
 */
function buildQueryURLRand1(keyword) {
    var queryURL = "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&";
    var queryParams = {};
    queryParams.tag = keyword;
    return queryURL + $.param(queryParams);
}

/**
 * takes API data (JSON/object) and turns it into elements on the page
 * @param {object} GifData - object containing Giphy API data
 */
function updateBtn(GifData) {
    var gifBtn = GifData.data;
    // Create the container to contain all the content
    var $btnContainer = $('<div>');
    $btnContainer.addClass("btn-inner col-sm-3");
    $(".btn-container").append($btnContainer);

    // Create the button to contain the gif image content
    var $gifBtn = $('<button>');
    $gifBtn.addClass("giphy-btn");

    if (gifBtn.images) {
        var fixedHeightURL = gifBtn.images.fixed_height.url;
        if (fixedHeightURL) {
            $gifBtn.attr('data-attr', fixedHeightURL);
            $gifBtn.attr('style', 'background: url(' + fixedHeightURL + ')');
            // $gifBtn.text(gifBtn.title); // I want to get search text on the button
            $gifBtn.text($('#search-term').val().trim()); // I want to get search text on the button
        }
        // Append btn to Container
        $btnContainer.append($gifBtn);
    }
}
/////* *//////

/////
// run search & add to Button & update page
/////
$(document).on('click', '#run-search', function () {
    event.preventDefault();

    // search topic and add to recent search with gif image
    var topic = $('#search-term').val().trim();
    recent.unshift(topic);
    recent.pop();
    console.log(recent);
    renderBtn();

    var queryURL = buildQueryURLSearch(topic, 10);
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(updatePage);
});
/////* *//////

/////
// update page on button click
/////
$(document).on("click", '.giphy-btn', function (event) {
    event.preventDefault();
    renderBtn();
    // reset giphy img
    $('.giphy-img-area').html('');
    var data = $(this).attr("data-attr");

    var queryURL = buildQueryURLSearch(data, 10);
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(updatePage);
});
/**
 * @returns {string} pulls information from the input and build the query URL
 */
function buildQueryURLSearch(keyword, limit) {
    var queryURL = "https://api.giphy.com/v1/gifs/search?";
    var queryParams = {};
    queryParams.q = keyword;
    queryParams.api_key = 'dc6zaTOxFJmzC';
    queryParams.limit = limit;
    return queryURL + $.param(queryParams);
}

/**
 * takes API data (JSON/object) and turns it into elements on the page
 * @param {object} GifData - object containing Giphy API data
 */
function updatePage(GifData) {

    var numGif = 10;
    console.log(GifData);
    for (var i = 0; i < numGif; i++) {
        var gif = GifData.data[i];

        // Create <div> to contain the gifs and other contents
        var $gifContainer = $('<div>');
        $gifContainer.addClass("giphy-container col-12 col-sm-6");

        // Add the newly created element to the DOM
        $('.giphy-img-area').prepend($gifContainer);

        // If the GifData has the components below, append to $gif
        var $gif = $('<img>');
        $gif.addClass("gif");
        var fixedWidthURL = gif.images.fixed_width.url;
        var fixedWidthStillURL = gif.images.fixed_width_still.url;
        var originalURL = gif.images.original.url;
        var originalStillURL = gif.images.original_still.url;

        if (originalURL) {
            $gif.attr('data-animate', originalURL);
        }
        if (originalStillURL) {
            $gif.attr('data-still', originalStillURL);
            $gif.attr('src', originalStillURL);
            $gif.attr('data-state', 'still');
        }

        // if (fixedWidthURL) {
        //     $gif.attr('data-animate', fixedWidthURL);
        // }
        // if (fixedWidthStillURL) {
        //     $gif.attr('data-still', fixedWidthStillURL);
        //     $gif.attr('src', fixedWidthStillURL);
        //     $gif.attr('data-state', 'still');
        // }

        // If the GifData has the components below, append
        var $gifRating = $("<h5>");
        $gifRating.addClass('giphy-rating');
        var rating = gif.rating;
        if (rating) {
            $gif.attr('rating', rating);
            $gifRating.html(rating);
        }

        var title = gif.title;
        if (title) {
            $gif.attr('title', title);
        }     
   
        var $gifFav = $('<button>');
        $gifFav.addClass('giphy-favorite');
        $gifFav.attr('favorite', false);
        $gifFav.html('&#x2764;');
        
        var $gifDown = $('<button class="giphy-download">');
        var gifDown = '<a href= "' + originalURL + '" download>Download</a>';
        $gifDown.append(gifDown);

        // Append the components to $gifContainer
        $gifContainer.append($gif);
        $gifContainer.append($gifRating);
        $gifContainer.append($gifFav);
        $gifContainer.append($gifDown);
        // $gifContainer.append($gifDown);
    }
}
/////* *//////

// Searched tab and Favorite tab
$(document).on('click', '.giphy-tab-btn', function () {
    var tab = $(this).attr("id");
    // console.log(tab);
    if (tab === 'giphy-page') {
        $('.giphy-img-area').show();
        $('.fav-img-area').hide();
    } else {
        $('.giphy-img-area').hide();
        $('.fav-img-area').show();
    }
});


// toggle favorite on click
$(document).on('click', '.giphy-favorite', function () {
    event.preventDefault();
    var $gifContainer = $(this).parent();
    var fav = $(this).attr("favorite");
    if (fav === 'false') {   
        $(this).css("color", 'rgba(0, 0, 0, 1)');
        $(this).attr('favorite', 'true');
        $('.fav-img-area').prepend($gifContainer);
    }
    if (fav === 'true') {
        $(this).css("color", 'rgba(0, 0, 0, 0.4)');
        $(this).attr('favorite', 'false');
        $gifContainer.remove();
        $('.giphy-img-area').prepend($gifContainer);
    }
});


// toggle animate and still on click
$(document).on('click', '.gif', function () {
    // event.preventDefault();  //do not need it

    var state = $(this).attr("data-state");
    if (state === 'still') {
        $(this).attr('src', $(this).attr('data-animate'));
        $(this).attr('data-state', 'animate');
    } else {
        $(this).attr('src', $(this).attr('data-still'));
        $(this).attr('data-state', 'still');
    }
});