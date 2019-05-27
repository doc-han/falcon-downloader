const {remote,ipcRenderer} = require('electron');
const url = require('url');
const path = require('path');
const uidGenerator = require('uid-generator');

const dls = {
    uid: [],
    dls: []
}

//when the show link modal is clicked
$('.add-link').click(function(){
    $('.ui.modal').modal('show');
});

//download controller keys
$(document).on('click','.cntrl',function(e){
    let a = e.currentTarget.parentElement.getAtrribute('data-id');
    console.log(a);
});

//when the download is started by link
$('.dl-btn').click(function(){
    let link = $('.dl-link').val();
    let parsed = url.parse(link);
    let name = path.basename(parsed.pathname);
    name = decodeURIComponent(name);
    let id = new uidGenerator(null,uidGenerator.BASE16,6).generateSync();
    let newDl = new download(link,name,id);
    newDl.startDownload();
    dls.uid.push(id);
    dls.dls.push(newDl);
})

//when the YouTube button is clicked
$('.youtube-btn').click(function(){
    ipcRenderer.send('show-youtube');
});