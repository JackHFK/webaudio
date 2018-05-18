/**
 * Created by hongjac on 2017/3/22.
 */
var AudioHelper = function() {
    this.audioContext = null;

    this.audios = {};
    this.loadList = [];
    this.total = 0;
    this.loadComplete = false;
};

AudioHelper.prototype = {
    ini: function(count, updateFun) {
        if(updateFun){
            this.updateFun = updateFun;
        }
        return this._prepareAPI(count);
    },
    _prepareAPI: function(count) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        try {
            this.audioContext = new AudioContext();
            return true;
            //console.log(this.analyser.frequencyBinCount)
        } catch (e) {
            alert('!Your browser does not support AudioContext');
            console.log(e);
        }
        return false;
    },
    loadSounds:function (items, comp) {
        this.total = items.length;
        var loadCount = 0;
        for(var i = 0; i < this.total; i++){
            var item = items[i];
            this.audios[item.id] = {};
            this.audios[item.id].url = item.url;
            this.loadList.push(item.id);
        }
        this.loadNext(comp);
    },

    loadNext:function (comp) {
        var thisObj = this;
        var request = new XMLHttpRequest();
        request.open('GET', this.audios[this.loadList[0]].url, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            var arraybuffer = request.response;
            thisObj.audioContext.decodeAudioData(arraybuffer, function (buffer) { //解码成功则调用此函数，参数buffer为解码后得到的结果
                thisObj.audios[thisObj.loadList[0]].buffer = buffer;
                thisObj.audios[thisObj.loadList[0]].gain = thisObj.audioContext.createGain();
                thisObj.audios[thisObj.loadList[0]].gain.connect(thisObj.audioContext.destination);
                console.log(thisObj.loadList[0])
                thisObj.loadList.splice(0,1)
                if(thisObj.loadList.length == 0){
                    thisObj.loadComplete = true;
                    if(comp){
                        comp();
                    }
                }
                else{
                    thisObj.loadNext(comp);
                }
            }, function(e) { //这个是解码失败会调用的函数
                console.log("!Decode Error:(");
            });
        }
        request.send();
    },

    play: function (id, loop) {
        if(this.audios[id]){
            this.audios[id].source = this.audioContext.createBufferSource();
            this.audios[id].source.connect(this.audios[id].gain);
            this.audios[id].source.buffer = this.audios[id].buffer;
            this.audios[id].source.loop = loop?loop:false;
            this.audios[id].source.start(0);
        }

    },

    stop:function (id) {
        if(this.audios[id]){
            var source = this.audios[id].source;
            source.stop();
        }
    },

    setVolume:function (id, n) {
        if(this.audios[id]){
            this.audios[id].gain.gain.setValueAtTime(n, this.audioContext.currentTime)
        }
    }
};