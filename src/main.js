const canvas = document.getElementById('sceneCanvas');
const statusOverlay = document.getElementById('statusOverlay');
const statusText = document.getElementById('statusText');

if (!window.THREE) {
  statusText.textContent = 'Three.js failed to load. Please check your connection and reload the page.';
  statusOverlay.classList.remove('hidden');
} else {
  try {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    const width = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || canvas.parentElement?.clientHeight || window.innerHeight * 0.7;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070d, 0.045);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 2, 6);

    const hemisphere = new THREE.HemisphereLight(0xbdd4ff, 0x080808, 0.8);
    scene.add(hemisphere);

    const headlamp = new THREE.SpotLight(0xffffff, 1.3, 35, Math.PI / 7, 0.5, 1.5);
    headlamp.position.set(0, 4, 4);
    headlamp.target.position.set(0, 0.5, -10);
    scene.add(headlamp, headlamp.target);

    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.1, roughness: 0.6 });
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x121826, metalness: 0.05, roughness: 0.9 });

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 80), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = -24;
    scene.add(floor);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6, 80), wallMaterial);
    leftWall.position.set(-3, 2.5, -24);
    const rightWall = leftWall.clone();
    rightWall.position.x = 3;
    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.5, 80), wallMaterial);
    ceiling.position.set(0, 5.8, -24);
    scene.add(leftWall, rightWall, ceiling);

    const glowMaterial = new THREE.MeshBasicMaterial({ color: 0x44ccff, transparent: true, opacity: 0.12 });
    const glowLines = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.02, 80), glowMaterial);
    glowLines.position.set(0, 0.02, -24);
    scene.add(glowLines);

    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 36, 24),
      new THREE.MeshStandardMaterial({ color: 0xe7ff6b, emissive: 0x455522, roughness: 0.2 })
    );
    ball.castShadow = true;
    ball.receiveShadow = true;
    ball.position.set(0, 2, 6);
    scene.add(ball);

    const floorHeight = 0.6;
    const corridorDepth = 60;
    const clock = new THREE.Clock();
    const velocity = new THREE.Vector3(0, 0, -12);
    let gravity = -9.8;
    let bounceFactor = 0.78;

    const gravityInput = document.getElementById('gravity');
    const speedInput = document.getElementById('speed');
    const bounceInput = document.getElementById('bounce');

    function resizeRenderer() {
      const nextWidth = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth;
      const nextHeight = canvas.clientHeight || canvas.parentElement?.clientHeight || window.innerHeight * 0.7;
      const needsResize = canvas.width !== nextWidth || canvas.height !== nextHeight;
      if (needsResize) {
        renderer.setSize(nextWidth, nextHeight, false);
        camera.aspect = nextWidth / nextHeight;
        camera.updateProjectionMatrix();
      }
    }

    function resetBall() {
      ball.position.set(0, 2, 6);
      velocity.set(0, 0, -parseFloat(speedInput.value));
    }

    function updateControls() {
      gravity = parseFloat(gravityInput.value);
      bounceFactor = parseFloat(bounceInput.value);
      velocity.z = -parseFloat(speedInput.value);
    }

    function animate() {
      resizeRenderer();
      const delta = clock.getDelta();

      velocity.y += gravity * delta;
      ball.position.addScaledVector(velocity, delta);

      if (ball.position.y <= floorHeight) {
        ball.position.y = floorHeight;
        velocity.y = -velocity.y * bounceFactor;
      }

      if (ball.position.z <= -corridorDepth) {
        ball.position.z = 6;
      }

      camera.position.z = ball.position.z + 5;
      headlamp.position.z = ball.position.z + 2;
      headlamp.target.position.z = ball.position.z - 4;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    function initializeUI() {
      updateControls();

      gravityInput.addEventListener('input', updateControls);
      speedInput.addEventListener('input', () => {
        velocity.z = -parseFloat(speedInput.value);
      });
      bounceInput.addEventListener('input', () => {
        bounceFactor = parseFloat(bounceInput.value);
      });
    }

    initializeUI();
    resetBall();
    animate();

    window.addEventListener('resize', resizeRenderer);
  } catch (error) {
    console.error('Failed to start the scene:', error);
    statusText.textContent =
      'The hallway scene could not start. If you opened this file directly, try running it from a local server instead (for example, "python -m http.server 8000").';
    statusOverlay.classList.remove('hidden');
  }
}
