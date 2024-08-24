const clock = new THREE.Clock();


// Configurando a cena e o renderizador
let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// -----------------Câmera ------------------------------
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.x = 2;
camera.position.y = 5;

const controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 2.0;
controls.zoomSpeed = 4;
controls.panSpeed = 0.8;
controls.staticMoving = true;

// Função de redimensionamento da janela
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

//------------------Object Shader ---------------------------
function createShaderObject() {

    const basicVertexShader = `
    uniform float time;

    // Matriz de rotação 3D em torno do eixo Y
    mat3 rotationY(float angle) {
        return mat3(
            cos(angle), 0.0, sin(angle),
            0.0, 1.0, 0.0,
            -sin(angle), 0.0, cos(angle)
        );
    }

    void main(){
        vec3 pos = position;

        // Aplicar a rotação ao longo do tempo usando uma matriz de rotação pura
        pos = rotationY(time) * pos;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }`;

    const basicFragmentShader = `
    uniform float time;
    uniform vec3 colorA;
    uniform vec3 colorB;

    void main(){
        float pct = abs(sin(time));
        vec3 color = mix(colorA, colorB, pct);
        gl_FragColor = vec4(color, 1.0);
    }`;

    const shadermaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 },
            colorA: { value: new THREE.Color(0xff0000) }, // Vermelho
            colorB: { value: new THREE.Color(0x0000ff) }, // Azul
        },
        vertexShader: basicVertexShader,
        fragmentShader: basicFragmentShader,
    });

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cube = new THREE.Mesh(cubeGeometry, shadermaterial);
    scene.add(cube);
}

createShaderObject();


//-----------------Animation---------------------------------
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();
    scene.children[0].material.uniforms.time.value = elapsedTime;
    controls.update(delta);

    renderer.render(scene, camera);
}

animate();
