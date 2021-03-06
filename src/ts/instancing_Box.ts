/// <reference path="typings/index.d.ts" />

class InstancingLines{

    public scene: THREE.Scene;
    public camera: THREE.Camera;
    private renderer:THREE.WebGLRenderer;
    private noise:Object;
    private time:Float32Array;

    private geometry:THREE.InstancedBufferGeometry;
    private material:THREE.RawShaderMaterial;
    private mesh:THREE.Mesh;



    private WIDTH:number;
    private PARTICLES:number;




    constructor(renderer:THREE.WebGLRenderer) {

        // renderer.setClearColor(0xffffff);
        this.renderer = renderer;
        this.createScene();

        let width = 100;
        this.WIDTH = width;
        this.PARTICLES =  width * width;

    }



    // シーンを作る。ここでオブジェクトを格納していく。
    private createScene(){

        this.time = new Float32Array(1);
        this.time[0] = 0.0;
        this.noise = new SimplexNoise();


        // シーンを作る
        this.scene = new THREE.Scene();

        // カメラを作成
        this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 10000 );
        // this.camera.position.z = 1400;
        // this.camera.position.y = 20;

        this.renderer.setClearColor(new THREE.Color(0x000000));


        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );


        var instances = 65000;




        this.geometry = new THREE.InstancedBufferGeometry();
        this.geometry.maxInstancedCount = instances;

        var vertices = new THREE.BufferAttribute( new Float32Array( triangles * 3 * 3 ), 3 );
        vertices.setXYZ( 0, 0.025, -0.025, 0 );
        vertices.setXYZ( 1, -0.025, 0.025, 0 );
        vertices.setXYZ( 2, 0, 0, 0.025 );

        this.geometry.addAttribute('position',vertices);

        var offsets = new THREE.InstancedBufferAttribute( new Float32Array( instances * 2 ), 2, 1 );


        for ( var i = 0, ul = offsets.count; i < ul; i++ ) {
            offsets.setXYZ( i, Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
        }

        this.geometry.addAttribute( 'offset', offsets );


        var colors = new THREE.InstancedBufferAttribute( new Float32Array( instances * 4 ), 4, 1 );
        for ( var i = 0, ul = colors.count; i < ul; i++ ) {
            colors.setXYZW( i, Math.random(), Math.random(), Math.random(), Math.random() );
        }

        this.geometry.addAttribute( 'color', colors );


        var vector = new THREE.Vector4();
        var orientationsStart = new THREE.InstancedBufferAttribute( new Float32Array( instances * 4 ), 4, 1 );
        for ( var i = 0, ul = orientationsStart.count; i < ul; i++ ) {
            vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
            vector.normalize();
            orientationsStart.setXYZW( i, vector.x, vector.y, vector.z, vector.w );
        }
        this.geometry.addAttribute( 'orientationStart', orientationsStart );

        var orientationsEnd = new THREE.InstancedBufferAttribute( new Float32Array( instances * 4 ), 4, 1 );
        for ( var i = 0, ul = orientationsEnd.count; i < ul; i++ ) {
            vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
            vector.normalize();
            orientationsEnd.setXYZW( i, vector.x, vector.y, vector.z, vector.w );
        }
        this.geometry.addAttribute( 'orientationEnd', orientationsEnd );




        this.material = new THREE.RawShaderMaterial( {
            uniforms: {
                time: { value: 1.0 },
                sineTime: { value: 1.0 }
            },
            vertexShader: document.getElementById( 'vertexShader_line' ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader_line' ).textContent,
            side: THREE.DoubleSide,
            transparent: true
        } );

        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.scene.add( this.mesh );


        let controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );



    }


    public click()
    {

    }

    public keyDown()
    {

    }
    // ワンフレームごとの処理
    public update() {


        var time = performance.now();
        var object = this.scene.children[0];
        object.rotation.y = time * 0.0005;
        object.material.uniforms.time.value = time * 0.005;
        object.material.uniforms.sineTime.value = Math.sin( object.material.uniforms.time.value * 0.05 );







    }


}


