var Convex = (function () {
    function Convex() {
        this.UPDATE = true;
        this.END = false;
        this.fov = -60;
        this.camera_timer = 0;
        this.createScene();
    }
    Convex.prototype.remove = function () {
        while (this.scene.children.length != 0) {
            this.scene.remove(this.scene.children[0]);
            if (this.scene.children[0] == THREE.Mesh) {
                this.scene.children[0].geometry.dispose();
                this.scene.children[0].material.dispose();
            }
        }
        ;
    };
    Convex.prototype.createScene = function () {
        this.noiseseed = [];
        this.milliseconds = 0.0;
        var settings = {
            metalness: 1.0,
            roughness: 0.4,
            ambientIntensity: 0.2,
            aoMapIntensity: 1.0,
            envMapIntensity: 1.0,
            displacementScale: 100.436143,
            normalScale: 1.0
        };
        this.clearColor = 0x7d7c7e;
        this.convexmeshs = [];
        this.convexwiremeshs = [];
        this.convexRotationValues = [];
        this.timer = 0.0;
        this.timer_end = Math.PI;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(0, 10, 150);
        var dlight = new THREE.DirectionalLight(0xffffff, 1.0);
        dlight.position.set(0, 1, 0);
        dlight.castShadow = true;
        this.scene.add(dlight);
        var dlight02 = new THREE.DirectionalLight(0xffffff, 1.0);
        dlight02.position.set(0, 1, 1);
        dlight02.castShadow = true;
        this.scene.add(dlight02);
        var pointlight = new THREE.PointLight(0xffffff, 0.8, 100, 2);
        pointlight.position.set(0, 100, 0);
        pointlight.castShadow = true;
        this.scene.add(pointlight);
        this.camera.lookAt(new THREE.Vector3(0, 80, 0));
        this.scene.add(this.camera);
        this.color = new THREE.Color();
        this.color.setRGB(Math.random() * 0.5 + 0.5, 0.5, Math.random() * 0.5 + 0.5);
        this.meshMaterial = new THREE.MeshPhongMaterial({
            color: this.color,
            shading: THREE.FlatShading
        });
        var meshwireMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0,
            wireframe: true,
            wireframeLinewidth: 2
        });
        for (var i = 0; i < 40; i++) {
            this.meshMaterial.wireframe = false;
            var cvMesh = this.createConvexMesh(20, 80, 30, this.meshMaterial);
            var pos = this.randomPoint();
            cvMesh.position.set(pos.x * 400, pos.y * 800, pos.z * 200 - 200);
            cvMesh.castShadow = true;
            cvMesh.receiveShadow = true;
            this.convexmeshs.push(cvMesh);
            this.scene.add(cvMesh);
            var cvwireMesh = cvMesh.clone();
            cvwireMesh.material = meshwireMaterial;
            cvwireMesh.position = cvMesh.position;
            this.convexwiremeshs.push(cvwireMesh);
            this.convexRotationValues.push({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 2 - 1 });
        }
    };
    Convex.prototype.createConvexMesh = function (width, height, depth, material) {
        var points = [];
        for (var i = 0; i < 40; i++) {
            var randomX = -width / 2 + Math.round(Math.random() * width);
            var randomY = -height / 2 + Math.round(Math.random() * height);
            var randomZ = -depth / 2 + Math.round(Math.random() * depth);
            points.push(new THREE.Vector3(randomX, randomY, randomZ));
        }
        var cvGeo = new THREE.ConvexGeometry(points);
        var cvMesh = new THREE.Mesh(cvGeo, material);
        return cvMesh;
    };
    Convex.prototype.randomPoint = function () {
        return new THREE.Vector3(THREE.Math.randFloat(-1, 1), THREE.Math.randFloat(-1, 1), THREE.Math.randFloat(-1, 1));
    };
    Convex.prototype.keyDown = function (e) {
        if (e.key == "c") {
            this.color.setRGB(Math.random() * 0.5 + 0.5, 0.5, Math.random() * 0.5 + 0.5);
            for (var i = 0; i < this.convexmeshs.length; i++) {
                this.convexmeshs[i].material.color = this.color;
            }
        }
    };
    Convex.prototype.endEnabled = function () {
        this.UPDATE = false;
    };
    Convex.prototype.update = function () {
        this.camera_timer += 0.01;
        if (this.UPDATE == false) {
            this.remove();
            if (this.scene.children.length == 0) {
                this.END = true;
            }
        }
        var date = new Date();
        if (this.pre_sec != date.getSeconds()) {
            this.timer = 0.0;
            for (var i = 0; i < this.noiseseed.length; i++) {
                this.noiseseed[i].x += 0.1;
                this.noiseseed[i].y += 0.3;
                this.noiseseed[i].z += 0.1;
            }
        }
        this.timer += (this.timer_end - this.timer) * 0.1;
        for (var i = 0; i < this.convexmeshs.length; i++) {
            this.convexmeshs[i].rotation.y += Math.sin(this.timer) * 0.1;
            this.convexmeshs[i].position.y += Math.sin(this.timer) * 8 + 1;
            this.convexwiremeshs[i].rotation.y = this.convexmeshs[i].rotation.y;
            this.convexwiremeshs[i].position.y = this.convexmeshs[i].position.y;
            this.convexmeshs[i].rotation.x += this.convexRotationValues[i].x * 0.01;
            this.convexwiremeshs[i].rotation.x += this.convexRotationValues[i].x * 0.01;
            this.convexmeshs[i].rotation.z += this.convexRotationValues[i].z * 0.01;
            this.convexwiremeshs[i].rotation.z += this.convexRotationValues[i].z * 0.01;
            if (this.convexmeshs[i].position.y > 800) {
                this.convexmeshs[i].position.y = -50;
                this.convexwiremeshs[i].position.y = -50;
            }
        }
        this.pre_sec = date.getSeconds();
        this.camera.position.y = Math.sin(this.camera_timer) * 100 - 50;
        this.camera.lookAt(new THREE.Vector3(0, 80, 0));
    };
    Convex.prototype.render = function () {
    };
    return Convex;
}());
//# sourceMappingURL=convex.js.map