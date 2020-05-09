import * as THREE from 'three';
import WorldImage from '../images/world.jpg';
import Shaders from './shaders';

export default function(container) {
    var camera, scene, renderer, w, h;
    var mesh;

    var overRenderer;

    var curZoomSpeed = 0;
    var zoomSpeed = 50;

    var mouse = { x: 0, y: 0 };
    var mouseOnDown = { x: 0, y: 0 };
    var rotation = { x: 0, y: 0 };
    var target = { x: Math.PI * 3 / 2, y: Math.PI / 6.0 };
    var targetOnDown = { x: 0, y: 0 };

    var distance = 100000;
    var distanceTarget = 100000;
    var PI_HALF = Math.PI / 2;

    function init() {

        container.style.color = '#fff';
        container.style.font = '13px/20px Arial, sans-serif';

        w = container.offsetWidth || window.innerWidth;
        h = container.offsetHeight || window.innerHeight;

        camera = new THREE.PerspectiveCamera(30, w / h, 1, 10000);
        camera.position.z = distance;

        scene = new THREE.Scene();

        const sphereGeometry = new THREE.SphereGeometry(200, 40, 30);

        const shader = Shaders.earth;
        const uniforms = THREE.UniformsUtils.clone(shader.uniforms);

        uniforms.texture.value = THREE.ImageUtils.loadTexture(WorldImage);

        const material = new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: shader.vertexShader, fragmentShader: shader.fragmentShader });

        mesh = new THREE.Mesh(sphereGeometry, material);
        mesh.rotation.y = Math.PI;
        scene.add(mesh);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(w, h);

        container.appendChild(renderer.domElement);

        container.addEventListener('mousedown', onMouseDown, false);

        container.addEventListener('mousewheel', onMouseWheel, false);

        document.addEventListener('keydown', onDocumentKeyDown, false);

        window.addEventListener('resize', onWindowResize, false);

        container.addEventListener('mouseover', () => {
            overRenderer = true;
        }, false);

        container.addEventListener('mouseout', () => {
            overRenderer = false;
        }, false);
    }

    function addData(data) {
        const subgeo = new THREE.Geometry();
        const step = 2;
        for (let i = 0; i < data.length; i += step) {
            const lat = data[i];
            const lng = data[i + 1];
            addPoint(lat, lng, subgeo);
        }

        this.points = new THREE.Mesh(subgeo, new THREE.MeshBasicMaterial());
        scene.add(this.points);
    };

    function addPoint(lat, lng, subgeo) {
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        boxGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.5));

        const point = new THREE.Mesh(boxGeometry);

        const phi = (90 - lat) * Math.PI / 180;
        const theta = (180 - lng) * Math.PI / 180;

        point.position.x = 200 * Math.sin(phi) * Math.cos(theta);
        point.position.y = 200 * Math.cos(phi);
        point.position.z = 200 * Math.sin(phi) * Math.sin(theta);

        point.lookAt(mesh.position);

        point.scale.z = 1;

        subgeo.merge(point.geometry, point.matrix);
    }

    function onMouseDown(event) {
        event.preventDefault();

        container.addEventListener('mousemove', onMouseMove, false);
        container.addEventListener('mouseup', onMouseUp, false);
        container.addEventListener('mouseout', onMouseOut, false);

        mouseOnDown.x = -event.clientX;
        mouseOnDown.y = event.clientY;

        targetOnDown.x = target.x;
        targetOnDown.y = target.y;

        container.style.cursor = 'move';
    }

    function onMouseMove(event) {
        mouse.x = -event.clientX;
        mouse.y = event.clientY;

        const zoomDamp = distance / 1000;

        target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005 * zoomDamp;
        target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005 * zoomDamp;

        target.y = target.y > PI_HALF ? PI_HALF : target.y;
        target.y = target.y < -PI_HALF ? -PI_HALF : target.y;
    }

    function onMouseUp(event) {
        container.removeEventListener('mousemove', onMouseMove, false);
        container.removeEventListener('mouseup', onMouseUp, false);
        container.removeEventListener('mouseout', onMouseOut, false);
        container.style.cursor = 'auto';
    }

    function onMouseOut(event) {
        container.removeEventListener('mousemove', onMouseMove, false);
        container.removeEventListener('mouseup', onMouseUp, false);
        container.removeEventListener('mouseout', onMouseOut, false);
    }

    function onMouseWheel(event) {
        event.preventDefault();
        if (overRenderer) {
            zoom(event.wheelDeltaY * 0.3);
        }
        return false;
    }

    function onDocumentKeyDown(event) {
        switch (event.keyCode) {
            case 38:
                zoom(100);
                event.preventDefault();
                break;
            case 40:
                zoom(-100);
                event.preventDefault();
                break;
        }
    }

    function onWindowResize(event) {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    }

    function zoom(delta) {
        distanceTarget -= delta;
        distanceTarget = distanceTarget > 1000 ? 1000 : distanceTarget;
        distanceTarget = distanceTarget < 350 ? 350 : distanceTarget;
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        zoom(curZoomSpeed);

        rotation.x += (target.x - rotation.x) * 0.1;
        rotation.y += (target.y - rotation.y) * 0.1;
        distance += (distanceTarget - distance) * 0.3;

        camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
        camera.position.y = distance * Math.sin(rotation.y);
        camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);

        camera.lookAt(mesh.position);

        renderer.render(scene, camera);
    }

    init();
    this.animate = animate;

    this.addData = addData;
    this.renderer = renderer;
    this.scene = scene;

    return this;

};