#version 300 es

precision highp float;

layout(location = 0) in vec2 inPosition;
layout(location = 1) in vec2 inVelocity;
layout(location = 2) in float inTime;
layout(location = 3) in float inDuration;
layout(location = 4) in float inAlpha;

out vec2 outPosition;
out vec2 outVelocity;
out float outTime;
out float outDuration;
out float outAlpha;
out float alpha;

uniform float reset;
uniform float time;
uniform float deltaTime;
uniform vec2 size;
uniform float r;
uniform float seed;
uniform float noiseScale;
uniform float noiseSpeed;
uniform float noiseMovement;
uniform float dampingMult;
uniform float forceMult;
uniform float velocityMult;
uniform float longevity;
uniform float maxVelocity;

uniform float fadeOut;
uniform vec2 fadeOutXY;

uniform float text;
uniform sampler2D textTexture;

float rand(vec2 n) {
	return fract(sin(dot(n,vec2(12.9898,4.1414-seed*.42)))*43758.5453);
}
vec4 loop(vec4 p) {
  p.xy = fract(p.xy / noiseScale) * noiseScale;
  p.zw = fract(p.zw / noiseScale) * noiseScale;
  return p;
}
vec3 loop(vec3 p) {
  p.xy = fract(p.xy / noiseScale) * noiseScale;
  return p;
}
float mod289(float x){return x-floor(x*(1./(289.+seed)))*(289.+seed);}
vec4 mod289(vec4 x){return x-floor(x*(1./(289.+seed)))*(289.0+seed);}
vec4 perm(vec4 x){return mod289(((x*34.)+1.)*x);}
float noise(vec3 p){

  vec3 a = floor(p);
  vec3 d = p - a;
  d = d * d * (3. - 2. * d);

  vec4 b = a.xxyy + vec4(0., 1., 0., 1.);
  vec4 k1 = perm(loop(b.xyxy));
  vec4 k2 = perm(loop(k1.xyxy + b.zzww));

  vec4 c = k2 + a.zzzz;
  vec4 k3 = perm(c);
  vec4 k4 = perm(c + 1.0);

  vec4 o3 = fract(k4 / 41.0) * d.z + fract(k3 / 41.0) * (1.0 - d.z);
  vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

  return o4.y * d.y + o4.x * (1.0 - d.y);
}
vec3 grad(vec3 p) {
  const vec2 e = vec2(.1, .0);
  return vec3(
    noise(loop(p + e.xyy)) - noise(loop(p - e.xyy)),
    noise(loop(p + e.yxy)) - noise(loop(p - e.yxy)),
    noise(loop(p + e.yyx)) - noise(loop(p - e.yyx))
  ) / (2.0 * e.x);
}
vec3 curlNoise(vec3 p) {
  p.xy /= size;
  p.x *= (size.x / size.y);
  p.xy = fract(p.xy);
  p.xy *= noiseScale;

  const vec2 e = vec2(.01, .0);
  return grad(loop(p)).yzx - vec3(
    grad(loop(p + e.yxy)).z,
    grad(loop(p + e.yyx)).x,
    grad(loop(p + e.xyy)).y
  );
}

float textAlpha(vec2 pos) {
  vec2 uv = pos / size;
  uv.y = 1. - uv.y;
  return texture(textTexture, uv).a;
}

vec2 genpos() {
  float t = fract(time / 50.) * 50.;
  if (text > 0.) {
    vec2 pos = vec2(-10., -10.);
    int i = 0;
    for (; i < 4 && textAlpha(pos * size) < .3; ++i) {
      pos = vec2(
        rand(vec2(42., -3.) * vec2(cos(float(gl_VertexID + i) - seed), gl_VertexID + i)),
        rand(vec2(-3., 42.) * vec2(t * (t + float(i)), sin(float(gl_VertexID + i) + seed)))
      );
    }
    return pos * size;
  }
  return size * vec2(
    rand(vec2(42., -3.) * vec2(cos(float(gl_VertexID) - seed), gl_VertexID)),
    rand(vec2(-3., 42.) * vec2(t * t, sin(float(gl_VertexID) + seed)))
  );
}

void main() {
  vec2 position = inPosition;
  vec2 velocity = inVelocity;
  float particleDuration = inDuration;
  float particleTime = inTime + deltaTime * particleDuration / longevity;
  float particleAlpha = inAlpha;

  if (reset > 0.) {
    particleTime = rand(vec2(-94.3, 83.9) * vec2(gl_VertexID, gl_VertexID));
    particleDuration = .5 + 2. * rand(vec2(gl_VertexID) + seed * 32.4);
    position = genpos();
    velocity = vec2(0.);
    particleAlpha = text > .5 ? particleAlpha = textAlpha(position) : 1.;
  } else if (particleTime >= 1.) {
    particleTime = 0.0;
    particleDuration = .5 + 2. * rand(vec2(gl_VertexID) + position);
    if (text > .5) {
      position = genpos();
      particleAlpha = textAlpha(position);
    } else {
      particleAlpha = 1.;
    }
    velocity = vec2(0.);
  }

  float textVelocityMult = 1.;
  if (text > .5) {
    float insideText = textVelocityMult = textAlpha(position);
    particleAlpha = min(max(particleAlpha + (insideText - .75) * deltaTime * 3., 0.), 1.);
    if (fadeOut > 0.) {
      particleAlpha *= mix(1., insideText, fadeOut);
    }
  }

  float msz = min(size.x, size.y);
  vec2 force = normalize(curlNoise(
    vec3(
      position + time * (noiseMovement / 100. * msz),
      time * noiseSpeed + rand(position) * 2.5
    )
  ).xy);

  velocity += force * forceMult * deltaTime * msz * .1;
  velocity *= dampingMult;
  float vlen = length(velocity);
  float maxVelocityPx = maxVelocity / 100. * msz;
  if (vlen > maxVelocityPx) {
    velocity = velocity / vlen * maxVelocityPx;
  }

  float fadeOutAlpha = 1.;
  if (fadeOut > 0.) {
    vec2 vector = position - fadeOutXY;
    float dist = length(vector);
    vec2 dir = normalize(vector);
    float dst = .9 * max(0., 1. - max(0., dist / (max(size.x, size.y) * fadeOut) - 1.));
    position += dir * deltaTime * 1000. * dst;
    fadeOutAlpha = 1. - fadeOut;
  }
  position += velocity * velocityMult * textVelocityMult * deltaTime;

  if ((
    position.x < 0. ||
    position.y < 0. ||
    position.x > size.x ||
    position.y > size.y
  ) && fadeOut < .1) {
    particleTime = 0.0;
    position = genpos();
    particleDuration = .5 + 2. * rand(vec2(gl_VertexID) + position);
    velocity = vec2(0.);
  }

  outPosition = position;
  outVelocity = velocity;
  outTime = particleTime;
  outDuration = particleDuration;
  outAlpha = particleAlpha;

  gl_PointSize = r;
  gl_Position = vec4((position / size * 2.0 - vec2(1.0)), 0.0, 1.0);

  alpha = sin(particleTime * 3.14) * fadeOutAlpha * particleAlpha * (.6 + .4 * rand(vec2(gl_VertexID)));
}

// @dkaraush
