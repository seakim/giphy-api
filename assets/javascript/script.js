

// function buildQueryURL() {

$(document).ready( function () {

    var recent = ['car','dog','funny','party'];
    function renderBtn () {
        $(".btn-container").empty();

        for (var i = 0; i < recent.length; i++) {
            var queryURL = "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=" + recent[i];
            // IIFE to create own function closure.  Note: passing cntr instead of i inside of 'then'
            (function(cntr) {
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function (response) {
                    
                    // i === 4, cntr is 0 ... 3
                    // console.log(i);
                    // console.log(cntr);
                    // console.log(queryURL);
                    var fixedHeightURL = response.data.images.fixed_height.url;
                    var btnContainer = $('<button class="giphy-btn">');
                    btnContainer.attr('data-attr', recent[cntr]);
                    btnContainer.attr('style', 'background: url(' + fixedHeightURL + ')');
                    btnContainer.text(recent[cntr]);
    
                    var giphyContainer = $('<div class="btn-inner col-sm-3">');
                    giphyContainer.append(btnContainer);
                    $('.btn-container').prepend(giphyContainer);
                });
            // closing with i
            })(i);

        }
    };

    $('#run-search').on('click', function () {
        event.preventDefault();

        // search topic and add to recent search with gif image
        var topic = $('#search-term').val().trim();

        recent.unshift(topic);
        recent.pop();
        console.log(recent);
   
        renderBtn();
    
    });

    // get gif files on button click
    $(document).on("click", '.giphy-btn', function () {
        event.preventDefault();
        renderBtn();
        // reset giphy img
        $('.giphy-img-area').html('');
        var data = $(this).attr("data-attr");
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + data + "&api_key=dc6zaTOxFJmzC&limit=12";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then( function (response) {
            var result = response.data;
            console.log(result);

            for (var i = 0; i < result.length; i++) {
                var fixedWidthURL = result[i].images.fixed_width.url;
                var fixedWidthstillURL = result[i].images.fixed_width_still.url;

                // adding gif attr to img
                var img = $("<img class='gif'>");
                img.attr('src', fixedWidthstillURL);
                img.attr('data-still', fixedWidthstillURL);
                img.attr('data-animate', fixedWidthURL);
                img.attr('data-state', 'still');
                img.attr('rating', rating);
                
                // adding rating to text
                var giphyText = $("<h5 class='giphy-rating'>");
                var rating = result[i].rating;
                giphyText.html(rating);

                // adding img and text to container
                var giphyContainer = $('<div class="giphy-container col-sm-6">');
                giphyContainer.append(img);
                giphyContainer.append(giphyText);

                // prepending container to the area
                $('.giphy-img-area').prepend(giphyContainer);
            }
        });

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

});

