/**
 * Created by Administrator on 2016/5/11.
 */
$('#submit').on('click', function(){
    var lis = $('#editor').find('li');
    var pre = "";
    lis.each(function(){
        pre += $(this).text();
    });
    console.log(pre);
    $('body').append('<script>'+pre+'</script>');
});
$('#editor').keydown(function(evt){
    evt = (evt) ? evt : window.event;
    if (evt.keyCode) {
        if(evt.keyCode == 8){
            var lis = $(this).find('li');
            if(lis.length<2 && !lis.first().text()){
                window.event.keyCode = 0;
                window.event.returnValue = false;
                return false;
            }
        }
    }
});