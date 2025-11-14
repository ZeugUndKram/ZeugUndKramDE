import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

window.handleButtonClick = function(action) {
    switch(action) {
        case 'view':
            window.open('https://www.youtube.com/watch?v=9On4STB4PPE', '_blank', 'noopener,noreferrer');
            break;
        case 'download':
            window.open('https://www.instructables.com/GTA-Radio-Transmitter/', '_blank', 'noopener,noreferrer');
            break;
        case 'purchase':
            window.open('https://www.tindie.com/products/zeugundkram/mp3-radio-fm-transmitter/', '_blank', 'noopener,noreferrer');
            break;
        default:
            console.log('Unknown action:', action);
    }
}

// Scroll functionality
const scrollContainer = document.getElementById('scroll-container');
const navDots = document.querySelectorAll('.nav-dot');
let isScrolling = false;

// Handle scroll events
scrollContainer.addEventListener('scroll', () => {
    if (!isScrolling) {
        isScrolling = true;

        const scrollPosition = scrollContainer.scrollTop;
        const pageHeight = window.innerHeight;
        const currentPage = Math.round(scrollPosition / pageHeight);

        updateNavigation(currentPage);

        setTimeout(() => {
            isScrolling = false;
        }, 100);
    }
});

// Navigation dot clicks
navDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const pageIndex = parseInt(dot.getAttribute('data-page'));
        scrollToPage(pageIndex);
    });
});

function updateNavigation(currentPage) {
    navDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentPage);
    });
}

function scrollToPage(pageIndex) {
    const pageHeight = window.innerHeight;
    scrollContainer.scrollTo({
        top: pageIndex * pageHeight,
        behavior: 'smooth'
    });
}

// Three.js initialization for first model
const container = document.getElementById("container3D");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);
camera.position.set(1, -10, 10);

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Gradient background
let backgroundTexture = null;

function createGradientBackground() {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2;

    const gradient = context.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
    );

    gradient.addColorStop(0, '#0b1e00');
    gradient.addColorStop(0.2, '#0b1e00');
    gradient.addColorStop(1, '#000000');

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    if (backgroundTexture) {
        backgroundTexture.dispose();
    }

    backgroundTexture = new THREE.CanvasTexture(canvas);
    scene.background = backgroundTexture;
}

// Create initial gradient
setTimeout(() => {
    createGradientBackground();
}, 100);

// Enhanced lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
scene.add(new THREE.HemisphereLight(0x443333, 0x111122, 0.6));

const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0xa594f9, 0.4);
fillLight.position.set(-5, 3, -5);
scene.add(fillLight);

// Load model
const loader = new GLTFLoader();
let radioModel = null;

loader.load(
    "./models/GTARadio.glb",
    (gltf) => {
        console.log('Model loaded successfully!', gltf);
        radioModel = gltf.scene;

        radioModel.traverse((obj) => {
            if (obj.isMesh) {
                obj.material = new THREE.MeshStandardMaterial({
                    color: obj.material.color || 0x888888,
                    metalness: obj.material.metalness ?? 0.7,
                    roughness: obj.material.roughness ?? 0.3
                });
            }
        });

        const box = new THREE.Box3().setFromObject(radioModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        let scale;
        if (maxDim > 10) {
            scale = 2 / maxDim;
        } else if (maxDim < 1) {
            scale = 2 / maxDim;
        } else {
            scale = 1.5 / maxDim;
        }

        radioModel.scale.set(scale, scale, scale);

        box.setFromObject(radioModel);
        box.getCenter(center);
        box.getSize(size);

        radioModel.position.x = -center.x;
        radioModel.position.y = -center.y;
        radioModel.position.z = -center.z;

        scene.add(radioModel);

        camera.position.set(0, 0, 3);
        controls.target.set(0, 0, 0);
        controls.update();

    },
    (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
        console.error('Error loading model:', error);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            wireframe: true
        });
        const placeholder = new THREE.Mesh(geometry, material);
        scene.add(placeholder);
    }
);

// Enable zoom with scroll wheel!
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.zoomSpeed = 1.0;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.minDistance = 0.5;
controls.maxDistance = 20;

// Handle resize
function handleResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    createGradientBackground();
}

const resizeObserver = new ResizeObserver(handleResize);
resizeObserver.observe(container);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Keyboard navigation
document.addEventListener('keydown', (event) => {
    const currentScroll = scrollContainer.scrollTop;
    const pageHeight = window.innerHeight;
    const currentPage = Math.round(currentScroll / pageHeight);

    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault();
        scrollToPage(Math.min(currentPage + 1, navDots.length - 1));
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault();
        scrollToPage(Math.max(currentPage - 1, 0));
    }
});

// Fallback background
setTimeout(() => {
    if (!scene.background) {
        scene.background = new THREE.Color(0x000000);
    }
}, 1000);

// Initialize second 3D model for page 3
const container2 = document.getElementById("container3D-2");
const scene2 = new THREE.Scene();

const camera2 = new THREE.PerspectiveCamera(
    75,
    container2.clientWidth / container2.clientHeight,
    0.1,
    100
);
camera2.position.set(1, -10, 10);

const renderer2 = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
});
renderer2.setSize(container2.clientWidth, container2.clientHeight);
renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container2.appendChild(renderer2.domElement);

// Gradient background for second model
let backgroundTexture2 = null;

function createGradientBackground2() {
    const width = Math.max(container2.clientWidth, 1);
    const height = Math.max(container2.clientHeight, 1);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2;

    const gradient = context.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
    );

    gradient.addColorStop(0, '#1e0b00');
    gradient.addColorStop(0.2, '#1e0b00');
    gradient.addColorStop(1, '#000000');

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    if (backgroundTexture2) {
        backgroundTexture2.dispose();
    }

    backgroundTexture2 = new THREE.CanvasTexture(canvas);
    scene2.background = backgroundTexture2;
}

// Create initial gradient for second model
setTimeout(() => {
    createGradientBackground2();
}, 100);

// Enhanced lighting for second model
scene2.add(new THREE.AmbientLight(0xffffff, 0.8));
scene2.add(new THREE.HemisphereLight(0x443333, 0x111122, 0.6));

const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight2.position.set(5, 10, 7);
scene2.add(dirLight2);

const fillLight2 = new THREE.DirectionalLight(0xa594f9, 0.4);
fillLight2.position.set(-5, 3, -5);
scene2.add(fillLight2);

// Load second model (placeholder for Writerdeck)
loader.load(
    "./models/Writerdeck.glb", // You'll need to add this model
    (gltf) => {
        console.log('Writerdeck model loaded successfully!', gltf);
        const writerdeckModel = gltf.scene;

        writerdeckModel.traverse((obj) => {
            if (obj.isMesh) {
                obj.material = new THREE.MeshStandardMaterial({
                    color: obj.material.color || 0x888888,
                    metalness: obj.material.metalness ?? 0.7,
                    roughness: obj.material.roughness ?? 0.3
                });
            }
        });

        const box = new THREE.Box3().setFromObject(writerdeckModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        let scale;
        if (maxDim > 10) {
            scale = 2 / maxDim;
        } else if (maxDim < 1) {
            scale = 2 / maxDim;
        } else {
            scale = 1.5 / maxDim;
        }

        writerdeckModel.scale.set(scale, scale, scale);

        box.setFromObject(writerdeckModel);
        box.getCenter(center);
        box.getSize(size);

        writerdeckModel.position.x = -center.x;
        writerdeckModel.position.y = -center.y;
        writerdeckModel.position.z = -center.z;

        scene2.add(writerdeckModel);

        camera2.position.set(0, 0, 3);
        controls2.target.set(0, 0, 0);
        controls2.update();

    },
    (progress) => {
        console.log('Writerdeck loading progress:', (progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
        console.error('Error loading Writerdeck model:', error);

        // Create placeholder geometry for Writerdeck
        const geometry = new THREE.BoxGeometry(1.5, 0.3, 1);
        const material = new THREE.MeshStandardMaterial({
            color: 0x7db359,
            wireframe: false
        });
        const placeholder = new THREE.Mesh(geometry, material);
        scene2.add(placeholder);
    }
);

// Controls for second model
const controls2 = new OrbitControls(camera2, renderer2.domElement);
controls2.enableDamping = true;
controls2.dampingFactor = 0.05;
controls2.enableZoom = true;
controls2.zoomSpeed = 1.0;
controls2.autoRotate = true;
controls2.autoRotateSpeed = 0.5;
controls2.minDistance = 0.5;
controls2.maxDistance = 20;

// Handle resize for second model
function handleResize2() {
    const width = container2.clientWidth;
    const height = container2.clientHeight;

    camera2.aspect = width / height;
    camera2.updateProjectionMatrix();
    renderer2.setSize(width, height);
    createGradientBackground2();
}

const resizeObserver2 = new ResizeObserver(handleResize2);
resizeObserver2.observe(container2);

// Animation loop for second model
function animate2() {
    requestAnimationFrame(animate2);
    controls2.update();
    renderer2.render(scene2, camera2);
}
animate2();