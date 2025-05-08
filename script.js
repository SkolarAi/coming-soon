import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

// Setup renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 200; // Reduced for subtlety
const posArray = new Float32Array(particlesCount * 3);
const velocityArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i += 3) {
    // Create a more spread out field
    posArray[i] = (Math.random() - 0.5) * 8;
    posArray[i + 1] = (Math.random() - 0.5) * 8;
    posArray[i + 2] = (Math.random() - 0.5) * 8;
    
    // Add velocity for each particle
    velocityArray[i] = (Math.random() - 0.5) * 0.01;
    velocityArray[i + 1] = (Math.random() - 0.5) * 0.01;
    velocityArray[i + 2] = (Math.random() - 0.5) * 0.01;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Create material with custom shader
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.01,
    color: '#00f5d4',
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

// Create mesh
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Position camera
camera.position.z = 5;

// Mouse movement effect
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Smooth mouse movement
    targetX += (mouseX - targetX) * 0.02;
    targetY += (mouseY - targetY) * 0.02;
    
    // Rotate particles
    particlesMesh.rotation.x += 0.0003;
    particlesMesh.rotation.y += 0.0005;
    
    // Update particle positions
    const positions = particlesMesh.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocityArray[i];
        positions[i + 1] += velocityArray[i + 1];
        positions[i + 2] += velocityArray[i + 2];
        
        // Reset particles if they move too far
        if (Math.abs(positions[i]) > 4) velocityArray[i] *= -1;
        if (Math.abs(positions[i + 1]) > 4) velocityArray[i + 1] *= -1;
        if (Math.abs(positions[i + 2]) > 4) velocityArray[i + 2] *= -1;
    }
    particlesMesh.geometry.attributes.position.needsUpdate = true;
    
    // Subtle camera movement
    camera.position.x += (targetX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (targetY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();

// Form handling
function handleSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    
    // Here you would typically send this to your backend
    console.log('Email submitted:', email);
    
    // Show thank you message
    document.getElementById('waitlistForm').style.display = 'none';
    document.getElementById('thankYouMessage').classList.remove('hidden');
    
    // Store email in localStorage (optional)
    localStorage.setItem('waitlistEmail', email);
} 