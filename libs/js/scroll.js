
$('body').on('scroll', function() {
 var height = $('body').scrollTop();
 if (height > 100) {
    $('#back-to-top').fadeIn();
 } else {
     $('#back-to-top').fadeOut();
 }
})