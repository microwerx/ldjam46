#version 300 es

uniform mat4 ProjectionMatrix;
uniform mat4 CameraMatrix;
uniform mat4 WorldMatrix;
uniform mat4 TextureMatrix;

in vec3 aPosition;
in vec3 aNormal;
in vec3 aTexcoord;
in vec3 aColor;

// These MUST match the fragment shader
out vec3 vPosition;
out vec3 vNormal;
out vec3 vTexcoord;
out vec3 vColor;
out vec3 vViewDir;

void main() {
  vNormal = mat3(WorldMatrix) * aNormal;
  vColor = aColor;
  vec4 tCoord =
      TextureMatrix * vec4(aTexcoord.s, 1.0 - aTexcoord.t, aTexcoord.p, 1.0);
  vTexcoord = tCoord.xyz;
  vec4 p = WorldMatrix * vec4(aPosition, 1.0);
  vPosition = p.xyz;
  vViewDir = inverse(CameraMatrix)[3].xyz - vPosition;
  gl_Position = ProjectionMatrix * CameraMatrix * p;
}
