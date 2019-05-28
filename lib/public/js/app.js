const {ipcRenderer} = require('electron');
const url = require('url');
const path = require('path');
const uidGenerator = require('uid-generator');

const mtDl = require('mt-files-downloader');
const downloader = new mtDl();

//when add link is clicked from menu
ipcRenderer.on('show-modal',function(event,args){
    $('.ui.modal').modal('show');
    event.returnValue = "OK";
});

//when the show link modal is clicked
$('.add-link').click(function(){
    $('.ui.modal').modal('show');
});

//download controller keys
$(document).on('click','.cntrl',function(e){

});

//when the download is started by link
$('.dl-btn').click(function(){
    let link = $('.dl-link').val();
    let parsed = url.parse(link);
    let name = path.basename(parsed.pathname);
    name = decodeURIComponent(name);
    let id = new uidGenerator(null,uidGenerator.BASE16,6).generateSync();
    let newDl = new download(link,name,id,downloader);
    newDl.startDownload();
})

//when the YouTube button is clicked
$('.youtube-btn').click(function(){
    ipcRenderer.send('show-youtube');
});

function toggleState(_url,_uid){
    let dl = downloader.getDownloadByUrl(_url);
    let elem = $(`#${_uid} .cntrl i`);
    if(dl.status==1){
        dl.stop();
        if(elem.hasClass("pause")){
            elem.removeClass("pause").addClass("play");
        }
    }else{
        dl.resume();
        if(elem.hasClass("play")){
            elem.removeClass("play").addClass("pause");
        }
    }
}
function stop(_url,_uid){
    let dl = downloader.getDownloadByUrl(_url);
    let elem = $(`#${_uid} .cntrl i`);
    dl.destroy();
    if(elem.hasClass("pause")){
        elem.removeClass("pause").addClass("play");
    }
}
function trash(_url,_uid){
    let dl = downloader.getDownloadByUrl(_url);
    if(dl.status!=-3){
        dl.destroy();
    }
    console.log('Num of downlaods: '+downloader.getDownloads().length);
    if(downloader.removeDownloadByFilePath(dl.filePath)){
        $(`#${_uid}`).remove();
    }else{
        console.log('error removing dl!!!');
    }
    console.log('Num of downlaods: '+downloader.getDownloads().length);
}