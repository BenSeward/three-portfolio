import { ReactThreeFiber } from "@react-three/fiber";
import * as THREE from "three";

interface WaterMaterialParameters
  extends THREE.MeshStandardMaterialParameters {}

export class WaterMaterial extends THREE.MeshStandardMaterial {
  private _shader: THREE.Shader | null = null;

  constructor(params: WaterMaterialParameters) {
    super(params);
    this.onBeforeCompile = (shader) => {
      this._shader = shader;

      // misc
      shader.uniforms.uTime = { value: 0 }; // the elapsed time

      // depth
      shader.uniforms.uDepthShallowColor = {
        value: new THREE.Vector4(0.325, 0.707, 0.971, 0.725),
      }; // Color of the shallow water
      shader.uniforms.uDepthDeepColor = {
        value: new THREE.Vector4(0.086, 0.407, 1, 0.749),
      }; // color of the deep water
      shader.uniforms.uFoamDist = { value: 0.3 }; // depth distance cutoff to calculate foam

      // textures
      shader.uniforms.uResolution = {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      }; // scene resolution

      shader.uniforms.tDepth = {
        value: new THREE.DepthTexture(window.innerWidth, window.innerHeight),
      }; // depth texture

      shader.uniforms.tNoise = {
        value: new THREE.Texture(),
      }; // noise texture

      shader.uniforms.tDistortion = {
        value: new THREE.Texture(),
      }; // distortion texture

      // surface noise
      shader.uniforms.uSurfaceDistortionAmount = {
        value: 0.5,
      }; // distortion amount
      shader.uniforms.uSurfaceNoiseTiling = {
        value: new THREE.Vector2(16.0, 8.0),
      }; // tiling used to scale uv
      shader.uniforms.uSurfaceNoiseCutoff = { value: 0.8 }; // surface noise cutoff
      shader.uniforms.uSurfaceNoiseScroll = {
        value: new THREE.Vector2(-0.003, 0.03),
      }; // scroll speed to control noise scatter in x,y dir

      // water noise rings
      shader.uniforms.uRingHalfWidth = { value: 0.05 }; // ring half width
      shader.uniforms.uRingThickness = { value: 0.008 }; // ring thickness
      shader.uniforms.uRingThreshold = { value: 0.7 }; // min width
      shader.uniforms.uRingOpacity = { value: 0.04 }; // opacity of the rings
      shader.uniforms.uRingFrequency = { value: 2.0 }; // ring frequency

      // === Vertex Shader ===
      shader.vertexShader = `
          varying vec2 vUv; 
          varying vec2 vWorldUV;
          varying vec2 vNoiseUV;
          varying mat4 vProjectionMatrix;

          uniform float uTime;
          uniform vec2 uSurfaceNoiseTiling;
          ${shader.vertexShader}
        `.replace(
        "#include <begin_vertex>",
        /* glsl */ `
          #include <begin_vertex>
          
          vUv = uv;
          vNoiseUV = uv * uSurfaceNoiseTiling;
          vProjectionMatrix = projectionMatrix;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vec3 ndc = gl_Position.xyz/gl_Position.w;
          vWorldUV = ndc.xy * 0.5 + 0.5;
          `
      );

      // === Fragment Shader ===
      shader.fragmentShader = /* glsl */ `
        precision highp float;
        
        // definitions
        varying vec2 vUv;
        varying vec2 vWorldUV;
        varying vec2 vNoiseUV;
        varying mat4 vProjectionMatrix;

        uniform sampler2D tNoise;
        uniform sampler2D tDistortion;
        uniform sampler2D tDepth;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec4 uDepthShallowColor;
        uniform vec4 uDepthDeepColor;
        uniform float uSurfaceNoiseCutoff;
        uniform vec2 uSurfaceNoiseScroll;
        uniform float uSurfaceDistortionAmount;
        uniform float uFoamDist;
        uniform float uRingHalfWidth;
        uniform float uRingThickness;
        uniform float uRingThreshold;
        uniform float uRingOpacity;
        uniform float uRingFrequency;


        const float SMOOTHSTEP_AA = 0.001;

        // convert logarithmic depth to linear depth
        float linearizeDepth(float z, mat4 projectionMatrix) {
          z = z * 2.0 - 1.0;
          z = projectionMatrix[3][2] / (z + projectionMatrix[2][2]);
          return z;
        }

        // apply beer lambert law to depth
        float calculateDepthDiff(float objectDepth, float fragDepth, float absorptionFactor, float foamDist) {
          // objectDepth = smoothstep(objectDepth - 0.0001, objectDepth + 0.0001, objectDepth);
          float depthDiff = abs(objectDepth - fragDepth);
          depthDiff = exp(-depthDiff * absorptionFactor);
          depthDiff = 1.0 - depthDiff;
          depthDiff = clamp(depthDiff/uFoamDist, 0.001, 1.0);
          return depthDiff;
        }

        // create surface noise rings
        vec3 surfaceNoiseRings(float waterNoise, float frequency, float threshold, float halfWidth, float ringThickness, float transparency) {
          float bands = fract(waterNoise * frequency);
          float edgeLow = (threshold - halfWidth) - ringThickness;
          float edgeHigh = threshold - halfWidth;
          float ringStart = smoothstep(edgeLow, edgeHigh, bands);

          float edgeLow2 = threshold + halfWidth;
          float edgeHigh2 = threshold + halfWidth + ringThickness;
          float ringEnd = smoothstep(edgeLow2, edgeHigh2, bands);
          float ringMask = ringStart - ringEnd;

          return mix(vec3(0.0), vec3(transparency), ringMask);
        }

          ${shader.fragmentShader}
        `.replace(
        "#include <dithering_fragment>",
        /* glsl */ `
          #include <dithering_fragment>
          

          // noise texture
          vec2 distortAmount = vec2(texture2D(tDistortion, vUv).xy * 2.0 - 1.0) * uSurfaceDistortionAmount;
          vec2 noiseUV = vec2(
            vNoiseUV.x + uTime * uSurfaceNoiseScroll.x + distortAmount.x, 
            vNoiseUV.y + uTime * uSurfaceNoiseScroll.y + distortAmount.y
          );

          // depth calculation
          float objectDepth = texture2D(tDepth, vWorldUV).r;
          objectDepth = linearizeDepth(objectDepth, vProjectionMatrix);
          float fragDepth = linearizeDepth(gl_FragCoord.z, vProjectionMatrix);
          float depthDiff = calculateDepthDiff(objectDepth, fragDepth, 1.2, uFoamDist);
          
          // random water foam
          float perlinNoise = texture2D(tNoise, noiseUV).r;
          float surfaceNoiseCutoff = uSurfaceNoiseCutoff * depthDiff;
          float surfaceNoise = smoothstep(surfaceNoiseCutoff - SMOOTHSTEP_AA, surfaceNoiseCutoff + SMOOTHSTEP_AA, perlinNoise);
          
          vec2 waveUV = vec2(
            vUv.x * 3.0 + uTime * 0.001 + distortAmount.x,
            vUv.y * 3.0 + uTime * 0.008 + distortAmount.y
          );

          // noise rings
          float waterNoise = texture2D(tNoise, waveUV).r;
          vec3 ringColor = surfaceNoiseRings(waterNoise, uRingFrequency, uRingThreshold, uRingHalfWidth, uRingThickness, uRingOpacity);
          vec4 waterColor = mix(uDepthDeepColor, uDepthShallowColor, depthDiff);
          vec4 finalColor = waterColor + vec4(surfaceNoise) + vec4(ringColor, 1.0);

          gl_FragColor *= vec4(finalColor);
        `
      );
    };
  }

  // update time
  updateTime(time: number) {
    if (this._shader) {
      this._shader.uniforms.uTime.value = time;
    }
  }

  // update noise texture
  updateNoiseTexture(noiseTexture: THREE.Texture) {
    if (this._shader) {
      this._shader.uniforms.tNoise.value = noiseTexture;
    }
  }

  // update distortion texture
  updateDistortionTexture(distortionTexture: THREE.Texture) {
    if (this._shader) {
      this._shader.uniforms.tDistortion.value = distortionTexture;
    }
  }

  // update depth texture
  updateDepthTexture(depthTexture: THREE.DepthTexture) {
    if (this._shader) {
      this._shader.uniforms.tDepth.value = depthTexture;
    }
  }

  // update resolution
  updateResolution(resolution: THREE.Vector2) {
    if (this._shader) {
      this._shader.uniforms.uResolution.value = resolution;
    }
  }

  // add uniform update functions here
}

// Declare the custom material type for TypeScript
declare module "@react-three/fiber" {
  interface ThreeElements {
    waterMaterial: ReactThreeFiber.Object3DNode<
      WaterMaterial,
      typeof WaterMaterial
    >;
  }
}
