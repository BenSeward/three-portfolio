// character-controller.js
import * as THREE from "three";

export class CharacterController {
  constructor(model, camera, controls, terrain) {
    this.model = model;
    this.camera = camera;
    this.controls = controls;
    this.terrain = terrain;
    this.moveDirection = new THREE.Vector3();
    this.moveSpeed = 0.1;
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };
    this.gravity = -0.05;
    this.verticalVelocity = 0;
    this.canJump = false;

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
      case "Space":
        if (this.canJump) {
          this.verticalVelocity = 0.5;
          this.canJump = false;
        }
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
      this.model.rotation.y = targetRotation;

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

    const raycaster = new THREE.Raycaster(
      new THREE.Vector3(
        this.model.position.x,
        this.model.position.y + 1,
        this.model.position.z
      ),
      new THREE.Vector3(0, -1, 0)
    );

    const intersects = raycaster.intersectObject(this.terrain);

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

    if (this.model.position.y < -10) {
      this.model.position.set(0, 2, 0);
      this.verticalVelocity = 0;
      this.canJump = true;
    }
  }
}
