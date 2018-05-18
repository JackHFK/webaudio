# webaudio
easy control

var ah = new AudioHelper();
ah.ini();
ah.loadSounds([
		{id:'sound1', url:'sound1.mp3'},
		{id:'sound2', url:'sound2.mp3'}
	], onLoadSoundComplete)
function onLoadSoundComplete(){
       ah.play('sound1');
}
