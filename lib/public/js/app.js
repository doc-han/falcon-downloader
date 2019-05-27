const {ipcRenderer} = require('electron');
const url = require('url');
const path = require('path');
//when the show link modal is clicked
$('.add-link').click(function(){
    $('.ui.modal').modal('show');
});

//when the download is started by link
$('.dl-btn').click(function(){
    let link = $('.dl-link').val();
    let parsed = url.parse(link);
    let name = path.basename(parsed.pathname);
    name = decodeURIComponent(name);
})

//when the YouTube button is clicked
$('.youtube-btn').click(function(){
    ipcRenderer.send('show-youtube');
});