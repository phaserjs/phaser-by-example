import{P as e}from"./phaser-CmFXOKba.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const s of e)if("childList"===s.type)for(const e of s.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();class t extends Phaser.Scene{constructor(){super({key:"bootloader"})}preload(){this.createBars(),this.setLoadEvents(),this.loadFonts(),this.loadImages(),this.loadAudios(),this.loadSpritesheets(),this.setRegistry()}setLoadEvents(){this.load.on("progress",(function(e){this.progressBar.clear(),this.progressBar.fillStyle(34986,1),this.progressBar.fillRect(this.cameras.main.width/4,this.cameras.main.height/2-16,this.cameras.main.width/2*e,16)}),this),this.load.on("complete",(()=>{this.scene.start("splash")}),this)}loadFonts(){this.load.bitmapFont("wendy","assets/fonts/wendy.png","assets/fonts/wendy.xml")}loadImages(){this.load.image("logo","assets/images/logo.png"),this.load.image("pello_logo","assets/images/pello_logo.png"),this.load.image("background","assets/images/background.png"),Array(4).fill(0).forEach(((e,t)=>{this.load.image(`stage${t+1}`,`assets/images/stage${t+1}.png`)}))}loadAudios(){this.load.audio("shot","assets/sounds/shot.mp3"),this.load.audio("foeshot","assets/sounds/foeshot.mp3"),this.load.audio("foedestroy","assets/sounds/foedestroy.mp3"),this.load.audio("foexplosion","assets/sounds/foexplosion.mp3"),this.load.audio("explosion","assets/sounds/explosion.mp3"),this.load.audio("stageclear1","assets/sounds/stageclear1.mp3"),this.load.audio("stageclear2","assets/sounds/stageclear2.mp3"),this.load.audio("boss","assets/sounds/boss.mp3"),this.load.audio("splash","assets/sounds/splash.mp3"),Array(3).fill(0).forEach(((e,t)=>{this.load.audio(`music${t+1}`,`assets/sounds/music${t+1}.mp3`)}))}loadSpritesheets(){this.load.spritesheet("player1","assets/images/player1.png",{frameWidth:64,frameHeight:64}),this.load.spritesheet("foe0","assets/images/foe0.png",{frameWidth:64,frameHeight:64}),this.load.spritesheet("foe1","assets/images/foe1.png",{frameWidth:64,frameHeight:64}),this.load.spritesheet("foe2","assets/images/foe2.png",{frameWidth:32,frameHeight:32}),this.load.spritesheet("guinxu","assets/images/guinxu.png",{frameWidth:128,frameHeight:144}),this.load.spritesheet("plenny0","assets/images/plenny0.png",{frameWidth:64,frameHeight:64})}setRegistry(){this.registry.set("score_player1",0),this.registry.set("power_player1","water"),this.registry.set("lives_player1",0),this.registry.set("score_player2",0),this.registry.set("power_player2","water"),this.registry.set("lives_player2",0)}createBars(){this.loadBar=this.add.graphics(),this.loadBar.fillStyle(13893632,1),this.loadBar.fillRect(this.cameras.main.width/4-2,this.cameras.main.height/2-18,this.cameras.main.width/2+4,20),this.progressBar=this.add.graphics()}}const s={chocolate:{color:11501655,radius:16,intensity:.4},vanila:{color:16774869,radius:16,intensity:.4},fruit:{color:65280,radius:16,intensity:.4},water:{color:204,radius:16,intensity:.4},foe:{color:16773151,radius:16,intensity:.4}};class i extends Phaser.GameObjects.PointLight{constructor(e,t,i,h="water",a,o=0,n=-300){const{color:r,radius:d,intensity:c}=s[h];super(e,t,i,r,d,c),this.name="foeshot",this.scene=e,this.playerName=a,this.spawnShadow(t,i,o,n),e.add.existing(this),e.physics.add.existing(this),"guinxu"===a&&this.body.setVelocity(o,n),this.body.setAllowGravity(!1),this.body.setCollideWorldBounds(!0),this.body.onWorldBounds=!0,this.body.setCircle(10),this.body.setOffset(6,9),this.init()}spawnShadow(e,t,s,i){this.shadow=this.scene.add.circle(e+20,t+20,10,0).setAlpha(.4),this.scene.add.existing(this.shadow),this.scene.physics.add.existing(this.shadow),"guinxu"===this.playerName&&this.shadow.body.setVelocity(s,i)}init(){this.scene.tweens.add({targets:this,duration:200,intensity:{from:.3,to:.7},repeat:-1})}shot(){const e=this.scene.add.circle(this.x,this.y,5).setStrokeStyle(10,16777215);this.showPoints(50),this.scene.tweens.add({targets:e,radius:{from:5,to:20},alpha:{from:1,to:0},duration:250,onComplete:()=>{e.destroy()}}),this.destroy()}showPoints(e,t=16711680){let s=this.scene.add.bitmapText(this.x+20,this.y-30,"wendy","+"+e,40,t).setOrigin(.5);this.scene.tweens.add({targets:s,duration:800,alpha:{from:1,to:0},y:{from:this.y-20,to:this.y-80},onComplete:()=>{s.destroy()}})}}class h{constructor(e,t,s,i=5,h=5,a=7){this.scene=e,this.radius=i,this.x=t,this.y=s,this.lights=Array(Phaser.Math.Between(h,a)).fill(0).map(((t,s)=>{const i=this.x+Phaser.Math.Between(-this.radius/2,this.radius/2),h=this.y+Phaser.Math.Between(-this.radius/2,-this.radius/2),a=Phaser.Math.Between(16711680,16777164),o=Phaser.Math.Between(this.radius/2,this.radius),n=Phaser.Math.Between(.3,.8);return e.lights.addPointLight(i,h,a,o,n)})),this.init()}init(){this.scene.tweens.add({targets:this.lights,duration:Phaser.Math.Between(600,1e3),scale:{from:1,to:0}})}}const a={foe0:{points:400,lives:1},foe1:{points:500,lives:3},foe2:{points:800,lives:2},guinxu:{points:1e4,lives:20}};class o extends Phaser.GameObjects.Sprite{constructor(e,t,s,i="foe0",h=0,o=0){super(e,t,s,i),this.name=i,this.points=a[i].points,this.lives=a[i].lives,this.id=Math.random(),"foe2"!==this.name&&this.spawnShadow(t,s),e.add.existing(this),e.physics.add.existing(this),this.body.setAllowGravity(!1),this.body.setCircle(19),this.body.setOffset(12,12),this.body.setVelocityX(h),this.body.setVelocityY(o),this.setData("vector",new Phaser.Math.Vector2),"guinxu"===this.name&&this.setGuinxuShot(),this.init()}setGuinxuShot(){this.patternIndex=0,this.pattern=Phaser.Utils.Array.NumberArrayStep(-300,300,50),this.pattern=this.pattern.concat(Phaser.Utils.Array.NumberArrayStep(300,-300,-50)),this.scene.tweens.add({targets:this,duration:2e3,y:{from:this.y,to:this.y+Phaser.Math.Between(100,-100)},x:{from:this.x,to:this.x+Phaser.Math.Between(100,-100)},yoyo:!0,repeat:-1})}spawnShadow(e,t){this.shadow=this.scene.add.image(e+20,t+20,this.name).setScale(.7).setTint(0).setAlpha(.4)}updateShadow(){this.shadow.x=this.x+20,this.shadow.y=this.y+20}init(){this.scene.anims.create({key:this.name,frames:this.scene.anims.generateFrameNumbers(this.name),frameRate:10,repeat:-1}),this.anims.play(this.name,!0),this.direction=-1}update(){if(this.y>this.scene.height+64&&("foe2"!==this.name&&this.shadow.destroy(),this.destroy()),"guinxu"===this.name&&Phaser.Math.Between(1,6)>5)this.guinxuShot();else if(Phaser.Math.Between(1,101)>100){if(!this.scene||!this.scene.player)return;this.scene.playAudio("foeshot");let e=new i(this.scene,this.x,this.y,"foe",this.name);this.scene.foeShots.add(e),this.scene.physics.moveTo(e,this.scene.player.x,this.scene.player.y,300),this.scene.physics.moveTo(e.shadow,this.scene.player.x,this.scene.player.y,300)}"foe2"!==this.name&&this.updateShadow()}guinxuShot(){if(!this.scene||!this.scene.player)return;this.scene.playAudio("foeshot");let e=new i(this.scene,this.x,this.y,"foe",this.name,this.pattern[this.patternIndex],300);this.scene.foeShots.add(e),this.patternIndex=this.patternIndex+1===this.pattern.length?0:++this.patternIndex}dead(){let e=60,t=20;"guinxu"===this.name&&(e=220,t=220,this.scene.cameras.main.shake(500));const s=this.scene.add.circle(this.x,this.y,5).setStrokeStyle(20,16777215);this.showPoints(this.points),this.scene.tweens.add({targets:s,radius:{from:10,to:e},alpha:{from:1,to:.3},duration:250,onComplete:()=>{s.destroy()}}),new h(this.scene,this.x,this.y,t),"foe2"!==this.name&&this.scene&&this.scene.scene.isActive()&&this.shadow&&this.shadow.active&&this.shadow.destroy(),"guinxu"===this.name&&(this.scene.number=5,this.scene.playAudio("explosion"),this.scene.endScene()),this.destroy()}showPoints(e,t=16711680){let s=this.scene.add.bitmapText(this.x+20,this.y-30,"wendy","+"+e,40,t).setOrigin(.5);this.scene.tweens.add({targets:s,duration:800,alpha:{from:1,to:0},y:{from:this.y-20,to:this.y-80},onComplete:()=>{s.destroy()}})}}class n{constructor(e){this.scene=e,this.waveFoes=[],this.generate(),this.activeWave=!1,this.waves=0}generate(){4===this.scene.number?this.scene.time.delayedCall(2e3,(()=>this.releaseGuinxu()),null,this):(this.generateEvent1=this.scene.time.addEvent({delay:7e3,callback:()=>this.orderedWave(),callbackScope:this,loop:!0}),this.generateEvent2=this.scene.time.addEvent({delay:15e3,callback:()=>this.wave(),callbackScope:this,loop:!0}),this.scene.number>1&&(this.generateEvent3=this.scene.time.addEvent({delay:3e3,callback:()=>this.tank(),callbackScope:this,loop:!0})),this.scene.number>2&&(this.generateEvent4=this.scene.time.addEvent({delay:5e3,callback:()=>this.slider(),callbackScope:this,loop:!0})))}releaseGuinxu(){const e=new o(this.scene,Phaser.Math.Between(200,600),200,"guinxu",0,20);this.scene.playAudio("boss"),this.laughterEvent=this.scene.time.addEvent({delay:1e4,callback:()=>{this.scene.playAudio("boss")},callbackScope:this,loop:!0}),this.scene.tweens.add({targets:e,alpha:{from:.3,to:1},duration:200,repeat:10}),this.scene.foeGroup.add(e)}stop(){clearInterval(this.generationIntervalId),this.scene.foeGroup.children.entries.forEach((e=>{null!==e&&e.active&&e.destroy()}))}finishScene(){this.generateEvent1.destroy(),this.generateEvent2.destroy(),this.scene.number>1&&this.generateEvent3.destroy(),this.scene.number>2&&this.generateEvent4.destroy(),this.scene.endScene()}createPath(){this.waves++,3===this.waves&&this.finishScene();const e=Phaser.Math.Between(100,600);this.path=new Phaser.Curves.Path(e,0),this.path.lineTo(e,Phaser.Math.Between(20,50));for(let t=0;t<8;t++)t%2==0?this.path.lineTo(e,50+62.5*(t+1)):this.path.lineTo(e+300,50+62.5*(t+1));this.path.lineTo(e,this.scene.height+50),this.graphics=this.scene.add.graphics(),this.graphics.lineStyle(0,16777215,0)}orderedWave(e=5){const t=Phaser.Math.Between(64,this.scene.width-200),s=Phaser.Math.Between(-100,0),i=Phaser.Math.Between(-1,1)>0?1:-1;Array(e).fill().forEach(((e,h)=>this.addOrder(h,t,s,i)))}wave(e=5){this.createPath(),Phaser.Math.Between(64,this.scene.width-200),Phaser.Math.Between(-100,0),Phaser.Math.Between(-1,1),Array(e).fill().forEach(((e,t)=>this.addToWave(t))),this.activeWave=!0}tank(){this.scene.foeGroup.add(new o(this.scene,Phaser.Math.Between(100,600),-100,"foe2",0,620))}slider(){let e=-200,t=0;Phaser.Math.Between(-1,1)>0?(e=200,t=-100):t=this.scene.width+100;const s=new o(this.scene,t,Phaser.Math.Between(100,600),"foe1",e,0);this.scene.tweens.add({targets:[s,s.shadow],duration:500,rotation:"+=5",repeat:-1}),this.scene.foeGroup.add(s)}add(){const e=new o(this.scene,Phaser.Math.Between(32,this.scene.width-32),0);this.scene.foeGroup.add(e)}addOrder(e,t,s,i){const h=70*i;this.scene.foeGroup.add(new o(this.scene,t+70*e,e*s+h,"foe0",0,300))}addToWave(e){const t=new o(this.scene,Phaser.Math.Between(32,this.scene.width-32),0,"foe0");this.scene.tweens.add({targets:t,z:1,ease:"Linear",duration:12e3,repeat:-1,delay:100*e}),this.scene.foeWaveGroup.add(t)}update(){this.path&&(this.path.draw(this.graphics),this.scene.foeWaveGroup.children.entries.forEach((e=>{if(null===e||!e.active)return;let t=e.z,s=e.getData("vector");this.path.getPoint(t,s),e.setPosition(s.x,s.y),e.shadow.setPosition(s.x+20,s.y+20),e.setDepth(e.y)})),this.activeWave&&this.checkIfWaveDestroyed()&&(this.activeWave=!1,this.scene.spawnShake(),this.path.destroy())),this.scene.foeGroup.children.entries.forEach((e=>{(null===e||!e.active||e.y>this.scene.height+100)&&e.destroy(),e.update()}))}checkIfWaveDestroyed(){const e=this.scene.foeWaveGroup.children.entries;return e.length===e.filter((e=>!e.active)).length}}class r extends Phaser.GameObjects.PointLight{constructor(e,t,s,i=16777215,h=5,a=.5){super(e,t,s,i,h,a),this.name="celtic",this.scene=e,e.add.existing(this),e.physics.add.existing(this),this.body.setAllowGravity(!1),this.body.setVelocityY(300),this.init()}init(){this.scene.tweens.add({targets:this,duration:Phaser.Math.Between(600,1e3),scale:{from:1,to:3},alpha:{from:this.alpha,to:0},onComplete:()=>{this.destroy()}})}}const d={chocolate:{color:11501655,radius:16,intensity:.4},vanila:{color:16774869,radius:16,intensity:.4},fruit:{color:16777215,radius:16,intensity:.4},water:{color:16777215,radius:16,intensity:.4},foe:{color:65280,radius:16,intensity:.4}};class c extends Phaser.GameObjects.PointLight{constructor(e,t,s,i="water",h,a=0,o=-500){const{color:n,radius:r,intensity:c}=d[i];super(e,t,s,n,r,c),this.name="shot",this.playerName=h,e.add.existing(this),e.physics.add.existing(this),this.body.setAllowGravity(!1),this.body.setVelocityX(a),this.body.setVelocityY(o),this.body.setCircle(10),this.body.setOffset(6,9),this.body.setCollideWorldBounds(!0),this.body.onWorldBounds=!0,this.spawnShadow(t,s,a,o),this.init()}spawnShadow(e,t,s,i){this.shadow=this.scene.add.circle(e+20,t+20,10,0).setAlpha(.4),this.scene.add.existing(this.shadow),this.scene.physics.add.existing(this.shadow),this.shadow.body.setVelocityX(s),this.shadow.body.setVelocityY(i)}init(){this.scene.tweens.add({targets:this,duration:200,intensity:{from:.3,to:.7},repeat:-1})}}class l{constructor(e,t){this.scene=e,this.name=t,this.shootingMethods={water:this.single.bind(this),fruit:this.tri.bind(this),vanila:this.quintus.bind(this),chocolate:this.massacre.bind(this)}}shoot(e,t,s){this.shootingMethods[s](e,t,s)}single(e,t,s){this.scene.shots.add(new c(this.scene,e,t,s,this.name))}tri(e,t,s){this.scene.shots.add(new c(this.scene,e,t,s,this.name,-60)),this.scene.shots.add(new c(this.scene,e,t,s,this.name)),this.scene.shots.add(new c(this.scene,e,t,s,this.name,60))}quintus(e,t,s){this.scene.shots.add(new c(this.scene,e,t,s,this.name,-300)),this.scene.shots.add(new c(this.scene,e,t,s,this.name,300)),this.scene.shots.add(new c(this.scene,e,t,s,this.name,-300,500)),this.scene.shots.add(new c(this.scene,e,t,s,this.name,300,500))}massacre(e,t,s){this.scene.shots.add(new c(this.scene,e,t,s,this.name,300,0)),this.scene.shots.add(new c(this.scene,e,t,s,this.name,-300,0)),this.scene.shots.add(new c(this.scene,e,t,s,this.name,0,500)),this.scene.shots.add(new c(this.scene,e,t,s,this.name,30)),this.scene.shots.add(new c(this.scene,e,t,s,this.name,60))}}class p extends Phaser.GameObjects.Sprite{constructor(e,t,s,i="player1",h="water"){super(e,t,s,i),this.name=i,this.spawnShadow(t,s),this.powerUp=h,this.id=Math.random(),e.add.existing(this),e.physics.add.existing(this),this.body.setCollideWorldBounds(!0),this.body.setAllowGravity(!1),this.body.setCircle(26),this.body.setOffset(6,9),this.power=0,this.blinking=!1,this.shootingPatterns=new l(this.scene,this.name),this.init(),this.setControls()}spawnShadow(e,t){this.shadow=this.scene.add.image(e+20,t+20,"player1").setTint(0).setAlpha(.4)}init(){this.scene.anims.create({key:this.name,frames:this.scene.anims.generateFrameNumbers(this.name,{start:0,end:0}),frameRate:10,repeat:-1}),this.scene.anims.create({key:this.name+"right",frames:this.scene.anims.generateFrameNumbers(this.name,{start:1,end:1}),frameRate:10,repeat:-1}),this.scene.anims.create({key:this.name+"left",frames:this.scene.anims.generateFrameNumbers(this.name,{start:2,end:2}),frameRate:10,repeat:-1}),this.anims.play(this.name,!0),this.upDelta=0}setControls(){this.SPACE=this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),this.cursor=this.scene.input.keyboard.createCursorKeys(),this.W=this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),this.A=this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),this.S=this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),this.D=this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)}shoot(){this.scene.playAudio("shot"),this.shootingPatterns.shoot(this.x,this.y,this.powerUp)}update(e,t){this.death||(this.cursor.left.isDown?(this.x-=5,this.anims.play(this.name+"left",!0),this.shadow.setScale(.5,1)):this.cursor.right.isDown?(this.x+=5,this.anims.play(this.name+"right",!0),this.shadow.setScale(.5,1)):(this.anims.play(this.name,!0),this.shadow.setScale(1,1)),this.cursor.up.isDown?this.y-=5:this.cursor.down.isDown&&(this.y+=5),Phaser.Input.Keyboard.JustDown(this.SPACE)&&this.shoot(),this.scene.trailLayer.add(new r(this.scene,this.x,this.y,16777215,10)),this.updateShadow())}updateShadow(){this.shadow.x=this.x+20,this.shadow.y=this.y+20}showPoints(e,t=16711680){let s=this.scene.add.bitmapText(this.x+20,this.y-30,"starshipped",e,20,16776503).setOrigin(.5);this.scene.tweens.add({targets:s,duration:2e3,alpha:{from:1,to:0},y:{from:s.y-10,to:s.y-100}})}dead(){const e=this.scene.add.circle(this.x,this.y,10).setStrokeStyle(40,16777215);this.scene.tweens.add({targets:e,radius:{from:10,to:512},alpha:{from:1,to:.3},duration:300,onComplete:()=>{e.destroy()}}),this.scene.cameras.main.shake(500),this.death=!0,this.shadow.destroy(),new h(this.scene,this.x,this.y,40),super.destroy()}}class y extends Phaser.GameObjects.Sprite{constructor(e,t,s,i="plenny0",h="fruit"){super(e,t,s,i),this.name=i,this.power=h,this.scene=e,this.id=Math.random(),this.spawnShadow(t,s),e.add.existing(this),e.physics.add.existing(this),this.body.setAllowGravity(!1),this.body.setCircle(19),this.body.setOffset(12,12),this.body.setVelocityX(-100),this.init()}spawnShadow(e,t){this.shadow=this.scene.add.image(e+20,t+20,"plenny0").setTint(0).setAlpha(.4),this.scene.physics.add.existing(this.shadow),this.shadow.body.setVelocityX(-100)}init(){this.scene.anims.create({key:this.name,frames:this.scene.anims.generateFrameNumbers(this.name),frameRate:10,repeat:-1}),this.scene.tweens.add({targets:[this],duration:5e3,x:{from:this.x,to:0},y:{from:this.y-10,to:this.y+10},scale:{from:.8,to:1},repeat:-1,yoyo:!0}),this.scene.tweens.add({targets:this.shadow,duration:5e3,x:{from:this.shadow.x,to:0},y:{from:this.shadow.y-10,to:this.y+10},scale:{from:.8,to:1},repeat:-1,yoyo:!0}),this.anims.play(this.name,!0),this.body.setVelocityX(-100),this.shadow.body.setVelocityX(-100),this.direction=-1}destroy(){this.shadow.destroy(),super.destroy()}}class u{constructor(e){this.scene=e}simpleClose(e){const t=this.scene.width/2,s=this.scene.add.rectangle(0-t,0,this.scene.width,this.scene.height,0).setOrigin(.5,0);this.scene.tweens.add({targets:s,duration:500,x:{from:-t/2,to:t},onComplete:()=>{e()}})}simpleOpen(e){const t=this.scene.width/2,s=this.scene.add.rectangle(t,0,this.scene.width,this.scene.height,0).setOrigin(.5,0);this.scene.tweens.add({targets:s,duration:500,x:{from:t,to:-t},onComplete:()=>{e()}})}close(e){const t=this.scene.width/2,s=this.scene.add.rectangle(0-t,0,this.scene.width/2,this.scene.height,0).setOrigin(.5,0),i=this.scene.add.rectangle(this.scene.width,0,this.scene.width/2,this.scene.height,0).setOrigin(0,0);this.scene.tweens.add({targets:s,duration:1e3,x:{from:-t/2,to:t/2}},{targets:i,duration:1e3,x:{from:this.scene.width,to:t},onComplete:()=>{e()}})}}class m extends Phaser.Scene{constructor(){super({key:"game"}),this.player=null,this.score=0,this.scoreText=null}init(e){this.name=e.name,this.number=e.number,this.next=e.next,this.currentPowerUp=+this.registry.get("currentPowerUp")}create(){this.duration=1e3*this.time,this.width=this.sys.game.config.width,this.height=this.sys.game.config.height,this.center_width=this.width/2,this.center_height=this.height/2,new u(this).simpleOpen((()=>0)),this.addBackground(),this.cameras.main.setBackgroundColor(3355443),this.lights.enable(),this.lights.setAmbientColor(6710886),this.addScores(),this.addFoes(),this.addPlayers(),this.addPowerUps(),this.addShots(),this.loadAudios(),this.addColliders()}addBackground(){this.background=this.add.tileSprite(0,0,this.width,this.height,"stage"+this.number).setOrigin(0).setScrollFactor(0,1)}spawnShake(){const{x:e,y:t}=this.lastDestroyedWaveFoe;this.shake=new y(this,e,t),this.powerUps.add(this.shake)}addScores(){this.scores={player1:{},player2:{}},this.scores.player1.scoreText=this.add.bitmapText(150,16,"wendy",String(this.registry.get("score_player1")).padStart(6,"0"),50).setOrigin(.5).setScrollFactor(0),this.scores.player2.scoreText=this.add.bitmapText(this.width-150,16,"wendy","0".padStart(6,"0"),50).setOrigin(.5).setScrollFactor(0)}addPlayers(){this.trailLayer=this.add.layer(),this.players=this.add.group(),this.player=new p(this,this.center_width,this.center_height),this.players.add(this.player)}addShots(){this.shotsLayer=this.add.layer(),this.shots=this.add.group()}addFoes(){this.foeGroup=this.add.group(),this.foeWaveGroup=this.add.group(),this.foeShots=this.add.group(),this.foes=new n(this)}addPowerUps(){this.available=["fruit","vanila","chocolate"],this.powerUps=this.add.group()}addColliders(){this.physics.add.collider(this.players,this.foeGroup,this.crashFoe,(()=>!0),this),this.physics.add.collider(this.players,this.foeWaveGroup,this.crashFoe,(()=>!0),this),this.physics.add.overlap(this.shots,this.foeGroup,this.destroyFoe,(()=>!0),this),this.physics.add.overlap(this.shots,this.foeWaveGroup,this.destroyWaveFoe,(()=>!0),this),this.physics.add.collider(this.players,this.powerUps,this.pickPowerUp,(()=>!0),this),this.physics.add.overlap(this.players,this.foeShots,this.hitPlayer,(()=>!0),this),this.physics.add.collider(this.shots,this.foeShots,this.destroyShot,(()=>!0),this),this.physics.world.on("worldbounds",this.onWorldBounds)}onWorldBounds(e,t){const s=e.gameObject.name.toString();["foeshot","shot"].includes(s)&&(e.gameObject.shadow.destroy(),e.gameObject.destroy())}destroyShot(e,t){const s=this.lights.addPointLight(e.x,e.y,16777215,10,.7);this.tweens.add({targets:s,duration:400,scale:{from:1,to:0}}),this.playAudio("foexplosion"),e.shadow.destroy(),e.destroy(),t.shadow.destroy(),t.shot(),this.updateScore(e.playerName,50)}destroyWaveFoe(e,t){this.lastDestroyedWaveFoe={x:t.x,y:t.y},this.destroyFoe(e,t)}destroyFoe(e,t){t.lives--,this.playAudio("foexplosion");const s=this.lights.addPointLight(e.x,e.y,16777215,10,.7);if(this.tweens.add({targets:s,duration:400,scale:{from:1,to:0}}),this.tweens.add({targets:t,duration:400,tint:{from:16777215,to:16711680}}),this.updateScore(e.playerName,50),this.tweens.add({targets:t,y:"-=10",yoyo:!0,duration:100}),e.destroy(),0===t.lives){this.playAudio("foedestroy");const s=this.lights.addPointLight(e.x,e.y,16777215,10,.7);this.tweens.add({targets:s,duration:400,scale:{from:1,to:0}}),this.updateScore(e.playerName,t.points),t.dead()}}hitPlayer(e,t){e.blinking||(this.players.remove(this.player),e.dead(),this.playAudio("explosion"),t.shadow.destroy(),t.destroy(),this.time.delayedCall(1e3,(()=>this.respawnPlayer()),null,this))}crashFoe(e,t){e.blinking||(e.dead(),this.playAudio("explosion"),t.dead(),this.time.delayedCall(1e3,(()=>this.respawnPlayer()),null,this))}pickPowerUp(e,t){this.playAudio("stageclear1"),this.updatePowerUp(e,t),this.tweens.add({targets:e,duration:200,alpha:{from:.5,to:1},scale:{from:1.4,to:1},repeat:3}),t.destroy()}respawnPlayer(){this.player=new p(this,this.center_width,this.center_height),this.player.blinking=!0,this.players.add(this.player),this.tweens.add({targets:this.player,duration:100,alpha:{from:0,to:1},repeat:10,onComplete:()=>{this.player.blinking=!1}})}loadAudios(){this.audios={shot:this.sound.add("shot"),foeshot:this.sound.add("foeshot"),explosion:this.sound.add("explosion"),foexplosion:this.sound.add("foexplosion"),foedestroy:this.sound.add("foedestroy"),stageclear1:this.sound.add("stageclear1"),stageclear2:this.sound.add("stageclear2"),boss:this.sound.add("boss")}}playAudio(e){this.audios[e].play()}update(){this.player&&this.player.update(),this.foes.update(),this.background.tilePositionY-=10}endScene(){this.foeWaveGroup.children.entries.forEach((e=>e.shadow.destroy())),this.foeGroup.children.entries.forEach((e=>e.shadow.destroy())),this.shots.children.entries.forEach((e=>e.shadow.destroy())),this.foeShots.children.entries.forEach((e=>e.shadow.destroy())),this.time.delayedCall(2e3,(()=>{this.finishScene()}),null,this)}finishScene(){this.game.sound.stopAll(),this.scene.stop("game");const e=this.number<5?"transition":"outro";this.scene.start(e,{next:"game",name:"STAGE",number:this.number+1})}updatePowerUp(e,t){e.powerUp=this.available[this.currentPowerUp],this.currentPowerUp=this.currentPowerUp+1===this.available.length?this.currentPowerUp:this.currentPowerUp+1,this.registry.set("currentPowerUp",this.currentPowerUp)}updateScore(e,t=0){const s=+this.registry.get("score_"+e)+t;this.registry.set("score_"+e,s),this.scores[e].scoreText.setText(String(s).padStart(6,"0")),this.tweens.add({targets:this.scores[e].scoreText,duration:200,tint:{from:255,to:16777215},scale:{from:1.2,to:1},repeat:2})}}class g extends Phaser.Scene{constructor(){super({key:"outro"})}create(){this.width=this.sys.game.config.width,this.height=this.sys.game.config.height,this.center_width=this.width/2,this.center_height=this.height/2,this.introLayer=this.add.layer(),this.splashLayer=this.add.layer(),this.text=["Score: "+this.registry.get("score_player1"),"The evil forces among with","their tyrannical leader GUINXU","were finally wiped out.","Thanks to commander Alva","And the powah of the Plenny Shakes"," - press enter - "],this.showHistory(),this.showPlayer(),this.input.keyboard.on("keydown-ENTER",this.startSplash,this)}showHistory(){this.text.forEach(((e,t)=>{this.time.delayedCall(2e3*(t+1),(()=>this.showLine(e,60*(t+1))),null,this)})),this.time.delayedCall(4e3,(()=>this.showPlayer()),null,this)}showLine(e,t){let s=this.introLayer.add(this.add.bitmapText(this.center_width,t,"wendy",e,50).setOrigin(.5).setAlpha(0));this.tweens.add({targets:s,duration:2e3,alpha:1})}showPlayer(){this.player1=this.add.sprite(this.center_width,this.height-200,"player1").setOrigin(.5)}startSplash(){this.scene.start("splash")}}class w extends Phaser.Scene{constructor(){super({key:"splash"})}create(){this.width=this.sys.game.config.width,this.height=this.sys.game.config.height,this.center_width=this.width/2,this.center_height=this.height/2,this.addBackground(),this.showLogo(),this.registry.set("currentPowerUp",0),this.time.delayedCall(1e3,(()=>this.showInstructions()),null,this),this.input.keyboard.on("keydown-SPACE",(()=>this.transitionToChange()),this),this.playMusic()}addBackground(){this.background=this.add.tileSprite(0,0,this.width,this.height,"background").setOrigin(0).setScrollFactor(0,1)}update(){this.background.tilePositionY-=2,this.background.tilePositionX+=2}transitionToChange(){new u(this).simpleClose(this.startGame.bind(this))}startGame(){this.theme&&this.theme.stop(),this.scene.start("transition",{next:"game",name:"STAGE",number:1,time:30})}showLogo(){this.gameLogoShadow=this.add.image(this.center_width,250,"logo").setScale(.7).setOrigin(.5),this.gameLogoShadow.setOrigin(.48),this.gameLogoShadow.tint=4083267,this.gameLogoShadow.alpha=.6,this.gameLogo=this.add.image(this.center_width,250,"logo").setScale(.7).setOrigin(.5),this.tweens.add({targets:[this.gameLogo,this.gameLogoShadow],duration:500,y:{from:-200,to:250}}),this.tweens.add({targets:[this.gameLogo,this.gameLogoShadow],duration:1500,y:{from:250,to:200},repeat:-1,yoyo:!0})}playMusic(e="splash"){this.theme=this.sound.add(e),this.theme.stop(),this.theme.play({mute:!1,volume:.5,rate:1,detune:0,seek:0,loop:!0,delay:0})}showInstructions(){this.add.bitmapText(this.center_width,450,"wendy","Arrows to move",60).setOrigin(.5).setDropShadow(3,4,2236962,.7),this.add.bitmapText(this.center_width,500,"wendy","SPACE to shoot",60).setOrigin(.5).setDropShadow(3,4,2236962,.7),this.add.sprite(this.center_width-95,598,"pello_logo").setOrigin(.5).setScale(.3).setTint(0).setAlpha(.7),this.add.sprite(this.center_width-100,590,"pello_logo").setOrigin(.5).setScale(.3),this.add.bitmapText(this.center_width+30,590,"wendy","PELLO",50).setOrigin(.5).setDropShadow(3,4,2236962,.7),this.space=this.add.bitmapText(this.center_width,680,"wendy","Press SPACE to start",60).setOrigin(.5).setDropShadow(3,4,2236962,.7),this.tweens.add({targets:this.space,duration:300,alpha:{from:0,to:1},repeat:-1,yoyo:!0})}}class f extends Phaser.Scene{constructor(){super({key:"transition"})}init(e){this.name=e.name,this.number=e.number,this.next=e.next}create(){this.width=this.sys.game.config.width,this.height=this.sys.game.config.height,this.center_width=this.width/2,this.center_height=this.height/2,this.sound.add("stageclear2").play(),this.add.bitmapText(this.center_width,this.center_height-50,"wendy",["Fire at will","Beware the tanks","Shoot down the UFOs","FINAL BOSS"][this.number-1],100).setOrigin(.5),this.add.bitmapText(this.center_width,this.center_height+50,"wendy","Ready player 1",80).setOrigin(.5),this.playMusic("music"+(4!==this.number?this.number:1)),this.time.delayedCall(2e3,(()=>this.loadNext()),null,this)}loadNext(){this.scene.start(this.next,{name:this.name,number:this.number,time:this.time})}playMusic(e="music1"){this.theme=this.sound.add(e),this.theme.play({mute:!1,volume:.4,rate:1,detune:0,seek:0,loop:!0,delay:0})}}const b={width:1e3,height:800,scale:{mode:e.Scale.FIT,autoCenter:e.Scale.CENTER_BOTH},autoRound:!1,parent:"game-container",physics:{default:"arcade",arcade:{gravity:{y:0},debug:!1}},scene:[t,w,f,m,g]};new e.Game(b);
