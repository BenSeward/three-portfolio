# Water Material

<p align="center">
<img alt="water body" src="../../../public/images/water-body.png" height=400 />
</p>

The water material extends the `MeshStandardMaterial` class. The `onBeforeCompile` method is updated with the uniforms, vertex and fragment shaders. This enables the developer to have the functionality of a PBR material for the water body. They can add maps, shadows etc without much interference just like they would in a normal `MeshStandardMaterial` implementation!

## Water Body
The original water mesh in the scene is removed as the mesh's UV was incorrectly packed. We replace with our own mesh which is just a plane mesh. The current implementation resides in `water-body.tsx`. 

> To update the wave height and wave speed, you can update the props - `waveHeight` and `waveSpeed` of the `WaterBody` component

## Uniforms

| Uniform Name               | Type        | Description                                             |
| -------------------------- | ----------- | ------------------------------------------------------- |
| `uTime`                    | `float`     | The elapsed time                                        |
| `uDepthShallowColor`       | `vec4`      | Color of the shallow water                              |
| `uDepthDeepColor`          | `vec4`      | Color of the deep water                                 |
| `uFoamDist`                | `float`     | Depth distance cutoff to calculate foam                 |
| `uResolution`              | `vec2`      | Scene resolution                                        |
| `tDepth`                   | `sampler2D` | Depth texture                                           |
| `tNoise`                   | `sampler2D` | Noise texture                                           |
| `tDistortion`              | `sampler2D` | Distortion texture                                      |
| `uSurfaceDistortionAmount` | `float`     | Distortion amount                                       |
| `uSurfaceNoiseTiling`      | `vec2`      | Tiling used to scale UV                                 |
| `uSurfaceNoiseCutoff`      | `float`     | Surface noise cutoff                                    |
| `uSurfaceNoiseScroll`      | `vec2`      | Scroll speed to control noise scatter in x, y direction |
| `uRingHalfWidth`           | `float`     | Ring half width                                         |
| `uRingThickness`           | `float`     | Ring thickness                                          |
| `uRingThreshold`           | `float`     | Minimum width of rings                                  |
| `uRingOpacity`             | `float`     | Opacity of the rings                                    |
| `uRingFrequency`           | `float`     | Ring frequency                                          |

Some of these uniforms have an update function within the material class.

```tsx
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
```

These functions are accessed from within the mesh component by accessing the material from the mesh ref.

```tsx
if (waterRef.current) {
  const material = waterRef.current.material as WaterMaterial;
  material.updateTime(clock.getElapsedTime());
  material.updateResolution(
    new THREE.Vector2(window.innerWidth, window.innerHeight)
  );
  material.updateDepthTexture(rt.depthTexture);
}
```

If the user wishes to expose a unifrom, they can write the corresponding update function for the uniform.

## References

- https://godotshaders.com/shader/toon-water-shader/
- https://roystan.net/articles/toon-water/

> For any doubts, feel free to contact <a href="https://www.github.com/madraven05" target="_blank" rel="noopener noreferrer">Pranshu Kumar Gond</a>
