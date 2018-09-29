var topics = [
  "Pet Shop Boys",
  "Tears for Fears",
  "Megadeth",
  "Judas Priest",
  "Michael Jackson",
  "Peter Gabriel",
  "Van Halen"
];

var app = {
  settings: {
    apiKey: "NTHeqM2633S1tOUHW5WcR9E2TVwzpVrG",
    baseUrl: "http://api.giphy.com/v1/gifs/search",
    searchLimit: 10,
    currentTopic: "",
    currentOffset: 0
  },

  new: function() {
    this.appendInitialTopicButtons();
    this.bindTopicButtonsClick();
    this.bindGifClick();
    this.bindGlobalGifActions();
  },

  appendInitialTopicButtons: function() {
    topics.forEach(function(topic) {
      app.appendTopicButton(topic);
    });
  },

  appendTopicButton: function(topic) {
    var button = $("<button>");

    button.attr("data-topic", topic.trim());
    button.addClass("topic");
    button.text(topic);

    $("#topics").append(button);
  },

  bindTopicButtonsClick: function() {
    $(document).on("click", ".topic", function() {
      app.settings.currentTopic = $(this).attr("data-topic") + "+music";
      app.settings.currentOffset = 0;

      $(".card").remove();

      app.searchGifs();
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
    $.ajax({
      method: "GET",
      url: this.topicSearchUrl()
    }).then(function(response) {
      response.data.forEach(function(data) {
        app.appendGif(data);
      });

      app.settings.currentOffset += app.settings.searchLimit;
    });
  },

  topicSearchUrl: function() {
    return (
      this.settings.baseUrl +
      "?api_key=" +
      this.settings.apiKey +
      "&q=" +
      this.settings.currentTopic +
      "&limit=" +
      this.settings.searchLimit +
      "&offset=" +
      this.settings.currentOffset
    );
  },

  appendGif: function(data) {
    var stillImage = data.images.original_still.url;
    var originalImage = data.images.original.url;

    var gifCard = $("<div>").addClass("card");

    var img = $("<img>")
      .addClass("gif card-img-top")
      .attr("data-original", originalImage)
      .attr("data-still", stillImage)
      .attr("src", stillImage);

    gifCard.append(img);

    var cardBody = $("<div>").addClass("card-body");

    var cardTitle = $("<h6>")
      .addClass("card-title text-center")
      .text(data.title);

    var rating = $("<p>")
      .addClass("text-center")
      .text("Rating " + data.rating);

    cardBody.append(cardTitle);
    cardBody.append(rating);
    gifCard.append(cardBody);

    $("#gifs").append(gifCard);
  }
};

app.new();
