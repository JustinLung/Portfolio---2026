uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uHoverColor;

varying float vWobble;
varying float vHover;

void main() {
	float colorMix = smoothstep(-1.0, 1.0, vWobble);
	vec3 baseColor = mix(uColorA, uColorB, colorMix);
	csm_DiffuseColor.rgb = mix(baseColor, uHoverColor, vHover * 0.42);
	csm_Roughness = mix(mix(0.5, 0.24, colorMix), 0.18, vHover);
	csm_Metalness = 0.04;
}
