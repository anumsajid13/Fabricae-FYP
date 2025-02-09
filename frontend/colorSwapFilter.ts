import { filters, Color, type T2DPipelineState } from "fabric";

type SwapColorOwnProps = {
  colorSource: string;
  colorDestination: string;
  tolerance: number;
};

const fragmentSource = `precision highp float;
uniform sampler2D uTexture;
uniform vec4 uColorSource;
uniform vec4 uColorDestination;
uniform float uTolerance;
varying vec2 vTexCoord;
void main() {
  vec4 color = texture2D(uTexture, vTexCoord);
  float delta = distance(uColorSource.rgb, color.rgb);
  if (delta < uTolerance) {
    gl_FragColor = uColorDestination;
  } else {
    gl_FragColor = color;
  }
}`;

export class SwapColor extends filters.BaseFilter<"SwapColor", SwapColorOwnProps> {
  static type = "SwapColor";

  static defaults = {
    colorSource: "rgb(255, 0, 0)",
    colorDestination: "rgb(0, 255, 0)",
    tolerance: 0.1,
  };

  declare colorSource: string;
  declare colorDestination: string;
  declare tolerance: number;

  static uniformLocations = ["uColorSource", "uColorDestination", "uTolerance"];

  protected getFragmentSource(): string {
    return fragmentSource;
  }

  applyTo2d({ imageData: { data } }: T2DPipelineState) {
    const source = new Color(this.colorSource).getSource(); // RGB [r, g, b]
    const destination = new Color(this.colorDestination).getSource(); // RGB [r, g, b]
    const tolerance = this.tolerance * 255; // Convert normalized tolerance to 0-255 range

    console.log("Source RGB:", source);
    console.log("Destination RGB:", destination);
    console.log("Tolerance in 255 range:", tolerance);

  
    // Loop through pixel data and apply color swapping based on tolerance
    for (let i = 0; i < data.length; i += 4) {
      const deltaR = Math.abs(data[i] - source[0]);
      const deltaG = Math.abs(data[i + 1] - source[1]);
      const deltaB = Math.abs(data[i + 2] - source[2]);
  
      const colorDistance = Math.sqrt(
        deltaR * deltaR + deltaG * deltaG + deltaB * deltaB
      );
  
      if (colorDistance <= tolerance) {
        data[i] = destination[0]; // Red
        data[i + 1] = destination[1]; // Green
        data[i + 2] = destination[2]; // Blue
      }
    }
  }
  
   /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
   sendUniformData(
    gl: WebGLRenderingContext,
    uniformLocations: Record<string, WebGLUniformLocation>
  ) {
    var source = new Color(this.colorSource).getSource(),
        destination = new Color(this.colorDestination).getSource();
    source[0] /= 255;
    source[1] /= 255;
    source[2] /= 255;
    destination[0] /= 255;
    destination[1] /= 255;
    destination[2] /= 255;
    gl.uniform4fv(uniformLocations.uColorSource, source);
    gl.uniform4fv(uniformLocations.uColorDestination, destination);
    gl.uniform1f(uniformLocations.uTolerance, this.tolerance); // Pass tolerance value to shader
  }

  isNeutralState(): boolean {
    return this.colorSource === this.colorDestination;
  }


}
