const {ipcRenderer} = require('electron');
//when the show link modal is clicked
$('.add-link').click(function(){
    $('.ui.modal').modal('show');
});

//when the YouTube button is clicked
$('.youtube-btn').click(function(){
    ipcRenderer.send('show-youtube');
})