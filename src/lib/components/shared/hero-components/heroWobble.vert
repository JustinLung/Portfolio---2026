uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform vec3 uHoverPoint;
uniform float uHoverStrength;
uniform vec3 uDragOrigin;
uniform vec3 uDragOffset;
uniform float uDragStrength;
uniform float uDragRadius;

varying float vWobble;
varying float vHover;

vec4 permute(vec4 x) {
	return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float permute(float x) {
	return floor(mod(((x * 34.0) + 1.0) * x, 289.0));
}

vec4 taylorInvSqrt(vec4 r) {
	return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r) {
	return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip) {
	const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
	vec4 p;
	vec4 s;

	p.xyz = floor(fract(vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
	p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
	s = vec4(lessThan(p, vec4(0.0)));
	p.xyz = p.xyz + (s.xyz * 2.0 - 1.0) * s.www;

	return p;
}

float simplexNoise4d(vec4 v) {
	const vec2 C = vec2(
		0.138196601125010504,
		0.309016994374947451
	);

	vec4 i = floor(v + dot(v, C.yyyy));
	vec4 x0 = v - i + dot(i, C.xxxx);
	vec4 i0;

	vec3 isX = step(x0.yzw, x0.xxx);
	vec3 isYZ = step(x0.zww, x0.yyz);

	i0.x = isX.x + isX.y + isX.z;
	i0.yzw = 1.0 - isX;
	i0.y += isYZ.x + isYZ.y;
	i0.zw += 1.0 - isYZ.xy;
	i0.z += isYZ.z;
	i0.w += 1.0 - isYZ.z;

	vec4 i3 = clamp(i0, 0.0, 1.0);
	vec4 i2 = clamp(i0 - 1.0, 0.0, 1.0);
	vec4 i1 = clamp(i0 - 2.0, 0.0, 1.0);

	vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
	vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
	vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
	vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

	i = mod(i, 289.0);
	float j0 = permute(permute(permute(permute(i.w) + i.z) + i.y) + i.x);
	vec4 j1 = permute(permute(permute(permute(
		i.w + vec4(i1.w, i2.w, i3.w, 1.0))
		+ i.z + vec4(i1.z, i2.z, i3.z, 1.0))
		+ i.y + vec4(i1.y, i2.y, i3.y, 1.0))
		+ i.x + vec4(i1.x, i2.x, i3.x, 1.0));

	vec4 ip = vec4(1.0 / 294.0, 1.0 / 49.0, 1.0 / 7.0, 0.0);
	vec4 p0 = grad4(j0, ip);
	vec4 p1 = grad4(j1.x, ip);
	vec4 p2 = grad4(j1.y, ip);
	vec4 p3 = grad4(j1.z, ip);
	vec4 p4 = grad4(j1.w, ip);

	vec4 norm = taylorInvSqrt(vec4(
		dot(p0, p0),
		dot(p1, p1),
		dot(p2, p2),
		dot(p3, p3)
	));
	p0 *= norm.x;
	p1 *= norm.y;
	p2 *= norm.z;
	p3 *= norm.w;
	p4 *= taylorInvSqrt(dot(p4, p4));

	vec3 m0 = max(0.6 - vec3(
		dot(x0, x0),
		dot(x1, x1),
		dot(x2, x2)
	), 0.0);
	vec2 m1 = max(0.6 - vec2(dot(x3, x3), dot(x4, x4)), 0.0);
	m0 *= m0;
	m1 *= m1;

	return 49.0 * (
		dot(m0 * m0, vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2)))
		+ dot(m1 * m1, vec2(dot(p3, x3), dot(p4, x4)))
	);
}

float getWobble(vec3 samplePosition) {
	vec3 warpedPosition = samplePosition;
	warpedPosition.xy += uPointer * 0.16;
	warpedPosition += simplexNoise4d(vec4(
		samplePosition * uWarpPositionFrequency,
		uTime * uWarpTimeFrequency
	)) * uWarpStrength;

	float baseWobble = simplexNoise4d(vec4(
		warpedPosition * uPositionFrequency,
		uTime * uTimeFrequency
	)) * uStrength;
	float hoverMask = 1.0 - smoothstep(
		0.0,
		0.72,
		distance(samplePosition, uHoverPoint)
	);
	float hoverDetail = simplexNoise4d(vec4(
		samplePosition * 2.2,
		uTime * 1.6
	)) * 0.1;

	return baseWobble + hoverMask * (0.16 + hoverDetail) * uHoverStrength;
}

float getDragMask(vec3 samplePosition) {
	float normalizedDistance = distance(samplePosition, uDragOrigin)
		/ max(uDragRadius, 0.001);
	float gaussianFalloff = exp(-4.0 * normalizedDistance * normalizedDistance);
	float softEdge = 1.0 - smoothstep(0.72, 1.0, normalizedDistance);

	return gaussianFalloff * softEdge * uDragStrength;
}

vec3 getDeformedPosition(vec3 samplePosition, vec3 sampleNormal) {
	return samplePosition
		+ getWobble(samplePosition) * sampleNormal
		+ uDragOffset * getDragMask(samplePosition);
}

void main() {
	vec3 tangentAxis = abs(normal.y) < 0.99
		? vec3(0.0, 1.0, 0.0)
		: vec3(1.0, 0.0, 0.0);
	vec3 localTangent = normalize(cross(tangentAxis, normal));
	vec3 biTangent = cross(normal, localTangent);
	float shift = 0.025;
	vec3 originalPosition = csm_Position;
	vec3 positionA = originalPosition + localTangent * shift;
	vec3 positionB = originalPosition + biTangent * shift;

	float wobble = getWobble(originalPosition);
	csm_Position = originalPosition
		+ wobble * normal
		+ uDragOffset * getDragMask(originalPosition);
	positionA = getDeformedPosition(positionA, normalize(positionA));
	positionB = getDeformedPosition(positionB, normalize(positionB));

	vec3 toA = normalize(positionA - csm_Position);
	vec3 toB = normalize(positionB - csm_Position);
	csm_Normal = cross(toA, toB);
	vWobble = wobble / max(uStrength, 0.001);
	vHover = (
		1.0 - smoothstep(0.0, 0.72, distance(position, uHoverPoint))
	) * uHoverStrength;
}
