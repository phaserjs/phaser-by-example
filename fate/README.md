
# UFISH

A *fartastic* adventure
0x03A062
0x06E18A

Benjamin Tissot 
Bitmap font generator:
https://snowb.org/

Music: UFISH

Template
https://github.com/enable3d/enable3d-phaser-project-template/blob/master/src/scripts/game.ts

Sounds
https://www.youtube.com/watch?v=Qo4JIT8jMtI&ab_channel=UltimateAmbientNoiseSoundzzz

https://www.youtube.com/watch?v=G-Rud5Z1n9c&ab_channel=MUSICASINCOPYRIGHTparacreadores

https://www.youtube.com/watch?v=P43G4glM1_M&ab_channel=EasySounds%26RelaxationChannel


https://ttsmp3.com/text-to-speech/Russian/

VoiceChanger
https://voicechanger.io/


NOTES:

create () {      
      this.bulletHell = new BulletHell();
      this.x = -500;
      // creates a nice scene
      this.third.warpSpeed()

      this.third.camera.position.set(0, 5, 20)
      this.third.camera.lookAt(0, 0, 0)

      // enable physics debugging
      this.third.physics.debug.enable()
      // adds a box
      // this.third.add.box({ x: 1, y: 2 })

      // adds a box with physics
      // this.third.physics.add.box({ x: -1, y: 2 })

      // throws some random object on the scene
      //this.third.haveSomeFun()
      //this.loadAudios(); 
      // this.playMusic();

      // add object3d (the monkey's name is object3d)
      // https://catlikecoding.com/unity/tutorials/basics/mathematical-surfaces/
      // https://github.com/enable3d/enable3d-website/blob/master/src/examples/first-phaser-game-3d-version.html
      this.third.load.gltf('/assets/objects/ship.glb').then(gltf => {
        // If you can, always use simple shapes like BOX, SPHERE, CONE etc.
        // The second most efficient shape is a COMPOUND, which merges multiple simple shapes.
        // Prefer HULL over CONVEX MESH.
        // HACD is the most expensive but also the most accurate.
        // If you need a concave shape, for a static or kinematic body, use CONCAVE MESH.

        // (mesh and convex are aliases for convexMesh)
        // (concave is an alias for concaveMesh)
        // (heightMap uses concaveMesh by default)
        // (extrude uses hacd by default)
        const object = new ExtendedObject3D()
        object.add(gltf.scene)
        //const object3d = gltf.scene.children[0]

        const shapes = ['box', 'compound', 'hull', 'hacd', 'convexMesh', 'concaveMesh']

        const material = this.third.add.material({ standard: { color: 0xcc0000, transparent: false, opacity: 1 } })


        // compound multiple simple shape together

        object.traverse(child => {
          if (child.isMesh && child.material.isMaterial) {
            child.material = material
          }
        })

        //shapes.forEach((shape, i) => { this.createObject(shape,i,  object3d) })
        this.ship = this.createObject("hull",0,  object)
      })

      this.cursor = this.input.keyboard.createCursorKeys();
      this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    }