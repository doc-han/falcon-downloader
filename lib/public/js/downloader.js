const mtDl = require('mt-files-downloader');
const homedir = require('os').homedir;

class Download {
    constructor(link,filename,uid){
        this.link = link;
        this.filename = filename;
        this.uid = uid;
        this.filepath = `${homedir}/Downloads/${filename}`;
        this.dl = new mtDl().download(link,this.filepath);
        console.log(this.dl);
    }

    startDownload(){
        this.injectCode();
        $(`#${this.uid} .dl-title`).text(this.filename);
        $(`#${this.uid} .progress`).progress({percent: 0});
        this.dl.setRetryOptions({
            retryInterval: 5000
        });
        this.dl.setOptions({
            threadCount: 5
        });
        this.dl.start();
        var notStarted = 0;
        var retryAgain = 0;
        var timer = setInterval(()=>{
            switch(this.dl.status){
                case 0:
                    if(retryAgain<=5){
                        notStarted++;
                        if(notStarted>=15){
                          this.dl.start();
                          notStarted = 0;
                          retryAgain++;
                        }
                    }
                    break;
                case 1:
                    let stats = this.dl.getStats();
                    let compl = stats.total.completed || 0;
                    let speed = (parseInt(stats.present.speed/1024)||0) + " Kb/s";
                    $(`#${this.uid} .dl-speed`).text(speed);
                    $(`#${this.uid} .progress`).progress({percent: compl});
                    $(`#${this.uid} .progress .label`).text(`${compl}%`);
                    break;
                case 2:
                    break;
                case -1:
                    this.dl.emit('end');
                    clearInterval(timer);
                    break;
                default:

            }
        },1000)
        this.dl.on('start', function(){
            console.log("dl started!!!");
        })
        this.dl.on('end', ()=>{
            $(`#${this.uid} .dl-speed`).text("0 Kb/s");
            $(`#${this.uid} .progress`).progress({percent: 100});
            $(`#${this.uid} .progress .label`).text(`100%`);
            console.log('download complete');
        });
        this.dl.on('error', ()=>{
            console.log('error downloading '+ this.filename);
        })

    }

    injectCode(){
        let code = `<tr id="${this.uid}">
                  <td class="dl-title">The begining of all</td>
                  <td><div class="ui small indicating progress" >
                      <div class="bar" style="width: 0%">
                      </div>
                      <div class="label">0%</div>
                    </div></td>
                  <td class="dl-speed">0 kb/s</td>
                  <td class="dl-time">Nan mins</td>
                  <td><div class="ui icon buttons" data-id="${this.uid}">
                      <button class="ui button cntrl"><i class="pause icon"></i></button>
                      <button class="ui button stp"><i class="stop icon"></i></button>
                      <button class="ui button trsh"><i class="trash icon"></i></button>
                    </div></td>
                </tr>`;
            $('tbody').prepend(code);
    }
}

module.exports = Download;