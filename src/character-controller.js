import * as THREE from "three";

export class CharacterController {
  constructor(model, camera, controls) {
    this.model = model;
    this.camera = camera;
    this.controls = controls;
    this.moveDirection = new THREE.Vector3();
    this.moveSpeed = 0.1;
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };

    document.addEventListener("keydown", (event) => this.handleKeyDown(event));
    document.addEventListener("keyup", (event) => this.handleKeyUp(event));
  }

  handleKeyDown(event) {
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
    }
  }

  handleKeyUp(event) {
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
    }
  }

  update() {
    this.moveDirection.set(0, 0, 0);

    if (this.keys.forward) this.moveDirection.z = -1;
    if (this.keys.backward) this.moveDirection.z = 1;
    if (this.keys.left) this.moveDirection.x = -1;
    if (this.keys.right) this.moveDirection.x = 1;

    this.moveDirection.normalize();

    if (this.moveDirection.length() > 0) {
      this.model.position.add(
        this.moveDirection.multiplyScalar(this.moveSpeed)
      );

      const targetRotation = Math.atan2(
        this.moveDirection.x,
        this.moveDirection.z
      );
      this.model.rotation.y = targetRotation; // Only the movement rotation now

      const cameraOffset = new THREE.Vector3(0, 2, 5);
      const targetCameraPosition = new THREE.Vector3()
        .copy(this.model.position)
        .add(cameraOffset);

      this.camera.position.lerp(targetCameraPosition, 0.1);
      this.controls.target.copy(this.model.position);
      this.camera.lookAt(
        this.model.position.x,
        this.model.position.y + 1,
        this.model.position.z
      );
    }
  }
}
