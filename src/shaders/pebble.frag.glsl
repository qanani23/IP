// ─── Pebble Basketball — Fragment Shader ─────────────────────────────────────
// Generates procedural leather texture with:
//   - Orange leather base color with warm noise variation
//   - Voronoi/FBM pebble cell pattern
//   - Seam darkening by UV proximity
//   - Noise-driven roughness variation

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;

uniform float uTime;
uniform vec3  uLightDir;
uniform vec3  uBaseColor;   // Dynamic base color
uniform vec3  uAccentColor; // Dynamic accent/rim color

// ─── Noise helpers (same as vertex) ──────────────────────────────────────────
vec3 mod289v3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289v4(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute4(vec4 x) { return mod289v4(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt4(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise3(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289v3(i);
  vec4 p = permute4(permute4(permute4(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0+1.0;
  vec4 s1 = floor(b1)*2.0+1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt4(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m = max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

float fbm3(vec3 p) {
  float v=0.0; float a=0.5; float f=1.0;
  for(int i=0;i<4;i++){v+=a*snoise3(p*f);a*=0.5;f*=2.0;}
  return v;
}

// ─── Seam distance ────────────────────────────────────────────────────────────
// Returns 0.0 at seam center, 1.0 far from seam
// Basketball has 4 seam arcs — approximated via UV-space sine curves
float seamDistance(vec2 uv) {
  float pi = 3.14159265;
  // Two main seam arcs
  float seam1 = abs(sin(uv.x * pi * 2.0) * 0.5 - (uv.y - 0.5));
  float seam2 = abs(cos(uv.x * pi * 2.0) * 0.5 - (uv.y - 0.5));
  float seam3 = abs(uv.x - 0.5);
  float seam4 = abs(uv.y - 0.5);
  float minDist = min(min(seam1, seam2), min(seam3, seam4));
  return smoothstep(0.0, 0.04, minDist);
}

void main() {
  vec3 normal = normalize(vNormal);

  // ─── Base leather color with warm noise variation ─────────────────────────
  float colorNoise = fbm3(vWorldPosition * 3.0) * 0.5 + 0.5;
  // Use dynamic uBaseColor instead of hardcoded orange
  // INCREASED brightness multipliers for more vibrant appearance
  vec3 leatherDark  = uBaseColor * 0.85;
  vec3 leatherLight = uBaseColor * 1.4;
  vec3 baseColor = mix(leatherDark, leatherLight, colorNoise);

  // ─── Pebble cell pattern (FBM layered for bumpy leather look) ────────────
  float pebble = fbm3(vWorldPosition * 12.0);
  float pebblePattern = smoothstep(0.0, 0.6, pebble);
  baseColor = mix(baseColor * 0.9, baseColor, pebblePattern);

  // ─── Seam darkening ───────────────────────────────────────────────────────
  float seam = seamDistance(vUv);
  baseColor = mix(baseColor * 0.4, baseColor, seam);

  // ─── Roughness variation (noise-driven) ───────────────────────────────────
  float roughness = 0.7 + fbm3(vWorldPosition * 6.0) * 0.2;
  roughness = clamp(roughness, 0.55, 0.9);

  // ─── Enhanced Blinn-Phong shading with INCREASED brightness ──────────────
  vec3 lightDir = normalize(vec3(0.6, 1.0, 0.8));
  float diff = max(dot(normal, lightDir), 0.0);

  vec3 viewDir = normalize(vViewPosition);
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), (1.0 - roughness) * 64.0);

  // INCREASED ambient and diffuse for brighter ball
  vec3 ambient  = baseColor * 0.5;
  vec3 diffuse  = baseColor * diff * 1.2;
  vec3 specular = vec3(1.0) * spec * (1.0 - roughness) * 0.6;

  // Enhanced rim light (dynamic accent color) - INCREASED intensity
  vec3 rimDir = normalize(vec3(-0.8, 0.4, -0.6));
  float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);
  rim *= max(dot(normal, rimDir), 0.0);
  vec3 rimColor = uAccentColor * rim * 0.5; // Increased from 0.3 to 0.5

  // Additional front lighting for better visibility
  vec3 frontDir = normalize(vec3(0.0, 0.2, 1.0));
  float frontLight = max(dot(normal, frontDir), 0.0);
  vec3 frontFill = baseColor * frontLight * 0.4;

  // Combine all lighting with INCREASED overall brightness
  vec3 finalColor = ambient + diffuse + specular + rimColor + frontFill;
  
  // Slight brightness boost for overall visibility
  finalColor *= 1.15;

  gl_FragColor = vec4(finalColor, 1.0);
}
