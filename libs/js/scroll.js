
$(window).on('scroll', function() {
 var height = $(window).scrollTop();
 if (height > 100) {
    $('#back-to-top').fadeIn();
 } else {
     $('#back-to-top').fadeOut();
 }
})