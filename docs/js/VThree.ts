/// <reference path="typings/index.d.ts" />

class VThree
{

    // 現在のシーンの番号
    public NUM:number = 0;
    // シーンを格納する配列
    public scenes:any[] = [];
    // Renderer
    public renderer:THREE.WebGLRenderer;
    private controls:Object;

    private opacityStep:number = 0.1;
    private opacity:number = 1.0;

    public transparent:boolean = false;
    public key_sceneNext:string = "ArrowRight";
    public key_scenePrev:string = "ArrowLeft";

    private isOrbitControls:boolean = false;
    constructor(startAlpha:number,transparent:boolean)
    {


        this.opacity = startAlpha;
        this.transparent = transparent;


        // 初期化処理後、イベント登録
        this.init();

        window.addEventListener( 'resize', this.onWindowResize, false );
        window.addEventListener( 'click', this.onClick, false );
        document.addEventListener("keydown", this.onKeyDown, true);
        document.addEventListener("keyup", this.onKeyUp, true);


    }

    public enableOrbitControls()
    {

    }

    public initOrbitContorols()
    {

    }


    // test

    public init()
    {

        // Rendererを作る
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.sortObjects = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        this.renderer.domElement.id = "main";
        document.body.appendChild( this.renderer.domElement );

        this.updateCanvasAlpha();
    }

    // 管理したいシーンを格納する関数

    public addScene(scene:Object)
    {

        this.scenes.push(scene);

    }


    // ウィンドウの幅が変わったときの処理
    public onWindowResize = () =>
    {
        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;
        this.scenes[this.NUM].camera.aspect = window.innerWidth / window.innerHeight;
        this.scenes[this.NUM].camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        console.log("resize");
    }

    // 現在のシーン番号が、不適切な値にならないようにチェック
    public checkNum = () =>
    {
        if(this.NUM <0)
        {
            this.NUM = this.scenes.length-1;
        }

        if(this.NUM >= this.scenes.length)
        {
            this.NUM = 0;
        }

        if(this.NUM == 1 )
        {
            $(".sceneinfo").html(
                "change animation [SPACE_KEY]<br>"
                +"speed down [S]<br>"
                +"change FOV[D]"
            );
        }
        if(this.NUM == 2 )
        {
            $(".sceneinfo").text("speed down [SPACE_KEY]");
        }
        if(this.NUM == 3 )
        {
            $(".sceneinfo").text("change mesh [SPACE_KEY]");
        }

        if(this.NUM == 4 )
        {
            $(".sceneinfo").text(" ");
            $(".sceneinfo").html(
                "speed down [SPACE_KEY]<br>"
                +"enable mouse control [C]"
            );
        }

        if(this.NUM == 5 )
        {
            $(".sceneinfo").text(" ");
        }

        if(this.NUM == 6 )
        {
            $(".sceneinfo").html(
                "reset noise value [R]<br>"
                +"change texture [T]<br>"
                +"speed Up or Down [A]<br>"
                +"change vector [V]<br>"
                +"change FOV [D]<br>"
                +"rotate img [C]<br>"

            );
        }
        if(this.NUM == 0 )
        {
            $(".sceneinfo").text(" ");

        }

    }

    public  onClick = () => {
        this.scenes[this.NUM].click();
    }
    // ←→キーでシーン番号を足し引き

    public onKeyUp = (e:KeyboardEvent) => {
        this.scenes[this.NUM].keyUp(e);
    }

    public onKeyDown = (e:KeyboardEvent) => {


        if(isFinite(Number(e.key)) && e.key != " ")
        {
            console.log("number: " + e.key);
            // console.log("number: " + Number);
            this.NUM = Number(e.key);
            this.checkNum();
        }

        console.log(e);
        // console.log(this.NUM);
        if(e.key == this.key_sceneNext)
        {
            this.NUM++;
            this.checkNum();
        }
        if( e.key == this.key_scenePrev)
        {

            this.NUM--;
            this.checkNum();
        }


        if(e.key == "ArrowUp")
        {
            this.opacity += this.opacityStep;

            if(this.opacity > 1.0)
            {

                this.opacity = 1.0;
            }

            this.updateCanvasAlpha();

        }
        if( e.key == "ArrowDown")
        {

            this.opacity -= this.opacityStep;

            if(this.opacity < 0.0)
            {

                this.opacity = 0.0;
            }
            this.updateCanvasAlpha();
        }


        console.log(this.NUM);

        this.scenes[this.NUM].keyDown(e);










    }

    private updateCanvasAlpha()
    {
        if(this.transparent)
        {
            this.renderer.domElement.style.opacity = this.opacity;
        }


    }


    // 最終的な描写処理と、アニメーション関数をワンフレームごとに実行
    public draw() {

        this.scenes[this.NUM].update();
        this.renderer.render(this.scenes[this.NUM].scene, this.scenes[this.NUM].camera);
        requestAnimationFrame(this.draw.bind(this));

    }
}

