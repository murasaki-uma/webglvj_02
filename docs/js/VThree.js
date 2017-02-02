var VThree = (function () {
    function VThree() {
        var _this = this;
        this.NUM = 0;
        this.scenes = [];
        this.isOrbitControls = false;
        this.onWindowResize = function () {
            var windowHalfX = window.innerWidth / 2;
            var windowHalfY = window.innerHeight / 2;
            _this.scenes[_this.NUM].camera.aspect = window.innerWidth / window.innerHeight;
            _this.scenes[_this.NUM].camera.updateProjectionMatrix();
            _this.renderer.setSize(window.innerWidth, window.innerHeight);
            console.log("resize");
        };
        this.checkNum = function () {
            if (_this.NUM < 0) {
                _this.NUM = _this.scenes.length - 1;
            }
            if (_this.NUM >= _this.scenes.length) {
                _this.NUM = 0;
            }
        };
        this.onClick = function () {
            _this.scenes[_this.NUM].click();
        };
        this.onKeyUp = function (e) {
            _this.scenes[_this.NUM].keyUp(e);
        };
        this.onKeyDown = function (e) {
            console.log(e);
            if (e.key == "ArrowRight") {
                _this.NUM++;
                _this.checkNum();
            }
            if (e.key == "ArrowLeft") {
                _this.NUM--;
                _this.checkNum();
            }
            console.log(_this.NUM);
            _this.scenes[_this.NUM].keyDown(e);
        };
        this.init();
        window.addEventListener('resize', this.onWindowResize, false);
        window.addEventListener('click', this.onClick, false);
        document.addEventListener("keydown", this.onKeyDown, true);
        document.addEventListener("keyup", this.onKeyUp, true);
    }
    VThree.prototype.enableOrbitControls = function () {
    };
    VThree.prototype.initOrbitContorols = function () {
    };
    VThree.prototype.init = function () {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.sortObjects = false;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        this.renderer.domElement.id = "main";
        document.body.appendChild(this.renderer.domElement);
    };
    VThree.prototype.addScene = function (scene) {
        this.scenes.push(scene);
    };
    VThree.prototype.draw = function () {
        this.scenes[this.NUM].update();
        this.renderer.render(this.scenes[this.NUM].scene, this.scenes[this.NUM].camera);
        requestAnimationFrame(this.draw.bind(this));
    };
    return VThree;
}());
//# sourceMappingURL=VThree.js.map