var btn = $('#back-to-btn');

$(window).on('scroll', function() {
  if ($(window).scrollTop() > 300) {
    btn.addClass('show-btn');
  } else {
    btn.removeClass('show-btn');
  }
});

btn.on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, '300');
});
