var characters = [
  "Black Widow",
  "Spider-man",
  "Iron man",
  "The Hulk",
  "Captain America",
  "Thor"
];

var app = {
  settings: {
    apiKey: "NTHeqM2633S1tOUHW5WcR9E2TVwzpVrG",
    superHeroApiUrl: "http://superheroapi.com/api/10209881724519328/search/",
    currentCharacter: "",
    gifSearchBaseUrl: "https://api.giphy.com/v1/gifs/search",
    gifSearchCurrentOffset: 0,
    gifSearchLimit: 10
  },

  new: function() {
    $("#gifControls").hide();
    this.appendInitialCharacterButtons();
    this.bindCharacterButtonsClick();
    this.bindCharacterFormSubmit();
    this.bindGifClick();
    this.bindGlobalGifActions();
  },

  appendInitialCharacterButtons: function() {
    characters.forEach(function(character) {
      app.appendCharacterButton(character);
    });
  },

  appendCharacterButton: function(character) {
    var button = $("<button>")
      .attr("data-character", character)
      .addClass("btn btn-success m-1 character")
      .text(character);

    $("#characters").append(button);
  },

  bindCharacterButtonsClick: function() {
    $(document).on("click", ".character", function() {
      app.settings.currentCharacter = $(this).attr("data-character");
      app.settings.gifSearchCurrentOffset = 0;

      $(".gifCard").remove();

      app.searchGifs();
    });
  },

  bindCharacterFormSubmit: function() {
    $("#characterForm").submit(function(e) {
      e.preventDefault();

      var newCharacter = $("#characterName")
        .val()
        .trim();

      app.appendCharacterButton(newCharacter);

      $("#characterName").val("");
    });
  },

  bindGifClick: function() {
    $(document).on("click", ".gif", function() {
      $(this).toggleClass("playing");
      app.updateGifImage($(this));
    });
  },

  updateGifImage: function(gif) {
    if (gif.hasClass("playing")) {
      gif.attr("src", gif.attr("data-original"));
    } else {
      gif.attr("src", gif.attr("data-still"));
    }
  },

  bindGlobalGifActions: function(gif) {
    $("#more").click(function() {
      app.searchGifs();
    });

    $("#play-all").click(function() {
      $(".gif").each(function() {
        $(this).addClass("playing");
        app.updateGifImage($(this));
      });
    });

    $("#stop-all").click(function() {
      $(".gif").each(function() {
        $(this).removeClass("playing");
        app.updateGifImage($(this));
      });
    });
  },

  searchGifs: function() {
    $("#gifControls").hide();
    $.ajax({
      method: "GET",
      url: this.gifSearchUrl()
    }).then(function(response) {
      response.data.forEach(function(data) {
        app.appendGif(data);
      });

      app.settings.gifSearchCurrentOffset += app.settings.gifSearchLimit;
      $("#gifControls").show();
    });
  },

  gifSearchUrl: function() {
    return (
      this.settings.gifSearchBaseUrl +
      "?api_key=" +
      this.settings.apiKey +
      "&q=" +
      this.settings.currentCharacter +
      "&limit=" +
      this.settings.gifSearchLimit +
      "&offset=" +
      this.settings.gifSearchCurrentOffset
    );
  },

  appendGif: function(data) {
    var stillImage = data.images.original_still.url;
    var originalImage = data.images.original.url;

    var gifCard = $("<div>").addClass("card gifCard");

    var img = $("<img>")
      .addClass("gif card-img-top")
      .attr("data-original", originalImage)
      .attr("data-still", stillImage)
      .attr("src", stillImage);

    gifCard.append(img);

    var cardFooter = $("<div>").addClass("card-footer");

    var rating = $("<p>")
      .addClass("text-center mb-0")
      .append(
        $("<span>")
          .addClass("badge badge-light")
          .text("Rating: " + data.rating)
      );

    cardFooter.append(rating);
    gifCard.append(cardFooter);

    $("#gifs").append(gifCard);
  }
};

app.new();
