import * as THREE from "three";

type Controls = {
  target: THREE.Vector3;
};

type Keys = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  space: boolean; // Add space for jumping
};

export class CharacterController {
  private model: THREE.Object3D;
  private camera: THREE.Camera;
  private terrain: THREE.Object3D;
  private moveDirection: THREE.Vector3;
  private moveSpeed: number;
  private keys: Keys;
  private gravity: number;
  private verticalVelocity: number;
  private canJump: boolean;

  constructor(
    model: THREE.Object3D,
    camera: THREE.Camera,
    terrain: THREE.Object3D
  ) {
    this.model = model;
    this.camera = camera;
    this.terrain = terrain;
    this.moveDirection = new THREE.Vector3();
    this.moveSpeed = 0.1;
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false, // Initialize space key
    };
    this.gravity = -0.05;
    this.verticalVelocity = 0;
    this.canJump = true;

    document.addEventListener("keydown", (event) => this.handleKeyDown(event));
    document.addEventListener("keyup", (event) => this.handleKeyUp(event));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case "KeyW":
        this.keys.forward = true;
        break;
      case "KeyS":
        this.keys.backward = true;
        break;
      case "KeyA":
        this.keys.left = true;
        break;
      case "KeyD":
        this.keys.right = true;
        break;
      case "Space": // Handle jump key down
        this.keys.space = true;
        break;
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case "KeyW":
        this.keys.forward = false;
        break;
      case "KeyS":
        this.keys.backward = false;
        break;
      case "KeyA":
        this.keys.left = false;
        break;
      case "KeyD":
        this.keys.right = false;
        break;
      case "Space": // Handle jump key up
        this.keys.space = false;
        break;
    }
  }

  public update(): void {
    this.moveDirection.set(0, 0, 0);

    if (this.keys.forward) this.moveDirection.z = 1; // W is forward
    if (this.keys.backward) this.moveDirection.z = -1; // S is backward

    this.moveDirection.normalize();

    if (this.moveDirection.length() > 0) {
      // Apply character's rotation to movement (for W/S movement)
      this.moveDirection.applyQuaternion(this.model.quaternion);
      this.model.position.add(
        this.moveDirection.multiplyScalar(this.moveSpeed)
      );
    }

    // Rotation with A and D
    let rotationAngle = 0;
    if (this.keys.left) rotationAngle += 0.05;
    if (this.keys.right) rotationAngle -= 0.05;

    this.model.rotation.y += rotationAngle;

    // Camera positioning and look-at
    const cameraDistance = 5;
    const cameraHeight = 3;

    const cameraTargetOffset = new THREE.Vector3(
      0,
      cameraHeight,
      -cameraDistance
    );
    cameraTargetOffset.applyQuaternion(this.model.quaternion);

    const cameraTargetPosition = new THREE.Vector3()
      .copy(this.model.position)
      .add(cameraTargetOffset);

    this.camera.position.lerp(cameraTargetPosition, 0.1);

    const lookAtPosition = new THREE.Vector3().copy(this.model.position);
    lookAtPosition.y += 1;
    this.camera.lookAt(lookAtPosition);

    // Ground collision detection
    const raycaster = new THREE.Raycaster(
      new THREE.Vector3(
        this.model.position.x,
        this.model.position.y + 10,
        this.model.position.z
      ),
      new THREE.Vector3(0, -1, 0)
    );

    const intersects = raycaster.intersectObject(this.terrain, true);

    if (intersects.length > 0) {
      const intersectionPoint = intersects[0].point;
      const targetY = intersectionPoint.y + 0.7;
      const yDifference = targetY - this.model.position.y;

      if (Math.abs(yDifference) > 0.05) {
        this.model.position.y += yDifference * 0.2;
        this.verticalVelocity = 0;
        this.canJump = false;
      } else {
        this.model.position.y = targetY;
        this.verticalVelocity = 0;
        this.canJump = true;
      }
    } else {
      this.verticalVelocity += this.gravity;
      this.model.position.y += this.verticalVelocity;
      this.canJump = false;
    }

    // Jumping logic
    if (this.keys.space && this.canJump) {
      this.verticalVelocity = 0.5;
      this.canJump = false;
      this.keys.space = false;
    }

    if (this.model.position.y < -10) {
      this.model.position.set(-85, 1.6, 2.1); // Reset to original starting position
      this.verticalVelocity = 0;
      this.canJump = true;
    }
  }
}
