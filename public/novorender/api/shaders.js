// /projects/Novorender/ts/dist/core3d/common.glsl
var common_default = "// shared/global stuff\r\n#define PASS_COLOR 0\r\n#define PASS_PICK 1\r\n#define PASS_PRE 2\r\n\r\n#ifndef PASS\r\n#define PASS PASS_COLOR // avoid red squigglies in editor\r\n#endif\r\n\r\nstruct CameraUniforms {\r\n    highp mat4 clipViewMatrix;\r\n    highp mat4 viewClipMatrix;\r\n    highp mat4 localViewMatrix;\r\n    highp mat4 viewLocalMatrix;\r\n    highp mat3 localViewMatrixNormal;\r\n    highp mat3 viewLocalMatrixNormal;\r\n    highp vec2 viewSize;\r\n    highp float near; // near clipping plane distance\r\n};\r\nstruct IBLTextures {\r\n    mediump samplerCube specular;\r\n    mediump samplerCube diffuse;\r\n};\r\n\r\n// background\r\nstruct BackgroundVaryings {\r\n    mediump vec3 dir;\r\n};\r\nstruct BackgroundUniforms {\r\n    lowp float envBlurNormalized;\r\n    lowp int mipCount;\r\n};\r\nstruct BackgroundTextures {\r\n    lowp samplerCube skybox;\r\n    IBLTextures ibl;\r\n};\r\n\r\n// clipping\r\nconst lowp uint undefinedIndex = 7U;\r\nconst highp uint clippingId = 0xfffffff0U;\r\nconst lowp uint clippingModeIntersection = 0U;\r\nconst lowp uint clippingModeUnion = 1U;\r\nstruct ClippingVaryings {\r\n    mediump vec3 dirVS;\r\n};\r\nstruct ClippingUniforms {\r\n    highp vec4 planes[6];\r\n    lowp uint numPlanes;\r\n    lowp uint mode; // 0 = intersection, 1 = union\r\n};\r\nstruct ClippingColors {\r\n    mediump vec4 colors[6];\r\n};\r\nbool clip(highp vec3 point, ClippingUniforms clipping) {\r\n    float s = clipping.mode == clippingModeIntersection ? -1.f : 1.f;\r\n    bool inside = clipping.mode == clippingModeIntersection ? clipping.numPlanes > 0U : true;\r\n    for(uint i = 0U; i < clipping.numPlanes; i++) {\r\n        inside = inside && dot(vec4(point, 1), clipping.planes[i]) * s < 0.f;\r\n    }\r\n    return clipping.mode == clippingModeIntersection ? inside : !inside;\r\n}\r\n\r\n// outlines\r\nstruct OutlineUniforms {\r\n    highp mat4 localPlaneMatrix;\r\n    highp mat4 planeLocalMatrix;\r\n    mediump vec3 color;\r\n    lowp int planeIndex;\r\n};\r\n\r\nbool clipOutlines(highp vec3 point, ClippingUniforms clipping) {\r\n    float s = clipping.mode == clippingModeIntersection ? -1.f : 1.f;\r\n    bool inside = clipping.mode == clippingModeIntersection ? clipping.numPlanes > 0U : true;\r\n    for(uint i = 0U; i < clipping.numPlanes; i++) {\r\n        inside = inside && dot(vec4(point, 1), clipping.planes[i]) * s < 0.f;\r\n    }\r\n    return !inside;\r\n}\r\n\r\n// cube\r\nconst uint cubeId = 0xfffffff8U;\r\nstruct CubeVaryings {\r\n    highp vec3 posVS;\r\n    mediump vec3 normal;\r\n    mediump vec3 color;\r\n};\r\nstruct CubeUniforms {\r\n    highp mat4 modelLocalMatrix;\r\n};\r\n\r\n// grid\r\nstruct GridVaryings {\r\n    highp vec2 posOS;\r\n    highp vec3 posLS;\r\n};\r\nstruct GridUniforms {\r\n    // below coords are in local space\r\n    highp vec3 origin;\r\n    mediump vec3 axisX;\r\n    mediump vec3 axisY;\r\n    highp float size1;\r\n    highp float size2;\r\n    mediump vec3 color1;\r\n    mediump vec3 color2;\r\n    highp float distance;\r\n};\r\n\r\nstruct ToonOutlineUniforms {\r\n    mediump vec3 color;\r\n};\r\n\r\n// dynamic geometry\r\nconst vec3 ambientLight = vec3(0);\r\nstruct DynamicVaryings {\r\n    mediump vec4 color0;\r\n    highp vec2 texCoord0;\r\n    highp vec2 texCoord1;\r\n    highp vec3 positionVS;\r\n    highp float linearDepth;\r\n    mediump mat3 tbn; // in world space\r\n    highp vec3 toCamera; // in world space (camera - position)\r\n};\r\nstruct DynamicVaryingsFlat {\r\n#if defined (ADRENO600)\r\n    mediump uint objectId_low;\r\n    mediump uint objectId_high;\r\n#else\r\n    highp uint objectId;\r\n#endif\r\n};\r\nstruct MaterialUniforms {\r\n    mediump vec4 baseColorFactor;\r\n    mediump vec3 emissiveFactor;\r\n    mediump float roughnessFactor;\r\n    mediump float metallicFactor;\r\n    mediump float normalScale;\r\n    mediump float occlusionStrength;\r\n    mediump float alphaCutoff;\r\n    lowp int baseColorUVSet;\r\n    lowp int metallicRoughnessUVSet;\r\n    lowp int normalUVSet;\r\n    lowp int occlusionUVSet;\r\n    lowp int emissiveUVSet;\r\n    lowp uint radianceMipCount;\r\n};\r\nstruct ObjectUniforms {\r\n    highp mat4 worldLocalMatrix;\r\n    highp uint baseObjectId;\r\n};\r\nstruct DynamicTextures {\r\n    mediump sampler2D lut_ggx;\r\n    IBLTextures ibl;\r\n    lowp sampler2D base_color;\r\n    mediump sampler2D metallic_roughness;\r\n    mediump sampler2D normal;\r\n    mediump sampler2D emissive;\r\n    mediump sampler2D occlusion;\r\n};\r\n\r\n// octree\r\n#define MODE_TRIANGLES 0\r\n#define MODE_POINTS 1\r\n#define MODE_TERRAIN 2\r\n\r\n#ifndef MODE\r\n#define MODE MODE_TRIANGLES // avoid red squigglies in editor\r\n#endif\r\n\r\nconst uint maxHighlights = 256U;\r\nstruct OctreeVaryings {\r\n    highp vec3 positionVS; // view space\r\n    mediump vec3 normalVS; // view space\r\n    highp vec2 texCoord0;\r\n    highp vec2 screenPos;\r\n    mediump float radius;\r\n    mediump float deviation;\r\n    mediump float elevation;\r\n};\r\nstruct OctreeVaryingsFlat {\r\n    lowp vec4 color;\r\n#if defined (ADRENO600)\r\n    mediump uint objectId_low;\r\n    mediump uint objectId_high;\r\n#else\r\n    highp uint objectId;\r\n#endif\r\n    lowp uint highlight;\r\n};\r\nstruct SceneUniforms {\r\n    bool applyDefaultHighlight;\r\n    lowp float iblMipCount;\r\n    // point cloud\r\n    mediump float pixelSize;\r\n    mediump float maxPixelSize;\r\n    mediump float metricSize;\r\n    mediump float toleranceFactor;\r\n    lowp int deviationIndex;\r\n    mediump float deviationFactor;\r\n    mediump vec2 deviationRange;\r\n    mediump vec4 deviationUndefinedColor;\r\n    bool useProjectedPosition;\r\n    // terrain elevation\r\n    highp vec2 elevationRange;\r\n    lowp float pickOpacityThreshold;\r\n};\r\nstruct NodeUniforms {\r\n    highp mat4 modelLocalMatrix;\r\n    mediump float tolerance;\r\n    lowp vec4 debugColor;\r\n    // min,max are in local space\r\n    highp vec3 min;\r\n    highp vec3 max;\r\n};\r\nconst struct OctreeTextures {\r\n    lowp sampler2D base_color;\r\n    IBLTextures ibl;\r\n    lowp sampler2D materials;\r\n    mediump sampler2D highlights;\r\n    mediump sampler2D gradients;\r\n};\r\n\r\n// watermark\r\nstruct WatermarkVaryings {\r\n    mediump float elevation;\r\n};\r\nstruct WatermarkUniforms {\r\n    highp mat4 modelClipMatrix;\r\n    mediump vec4 color;\r\n};\r\n\r\n// tonemapping\r\nconst mediump float tonemapMaxDeviation = 1.f;\r\nconst lowp uint tonemapModeColor = 0U;\r\nconst lowp uint tonemapModeNormal = 1U;\r\nconst lowp uint tonemapModeDepth = 2U;\r\nconst lowp uint tonemapModeObjectId = 3U;\r\nconst lowp uint tonemapModeDeviation = 4U;\r\nconst lowp uint tonemapModeZbuffer = 5U;\r\nstruct TonemappingVaryings {\r\n    highp vec2 uv;\r\n};\r\nstruct TonemappingUniforms {\r\n    mediump float exposure;\r\n    lowp uint mode;\r\n    highp float maxLinearDepth;\r\n};\r\nstruct TonemappingTextures {\r\n    mediump sampler2D color;\r\n    highp usampler2D pick;\r\n    highp sampler2D zbuffer;\r\n};\r\n\r\n// dither transparency\r\nconst mediump mat4 ditherThresholds = mat4(0.0f / 16.0f, 8.0f / 16.0f, 2.0f / 16.0f, 10.0f / 16.0f, 12.0f / 16.0f, 4.0f / 16.0f, 14.0f / 16.0f, 6.0f / 16.0f, 3.0f / 16.0f, 11.0f / 16.0f, 1.0f / 16.0f, 9.0f / 16.0f, 15.0f / 16.0f, 7.0f / 16.0f, 13.0f / 16.0f, 5.0f / 16.0f);\r\nmediump float dither(highp vec2 xy) {\r\n    lowp int x = int(xy.x) & 3;\r\n    lowp int y = int(xy.y) & 3;\r\n    return ditherThresholds[y][x];\r\n}\r\n\r\n// sRGB\r\nconst mediump float GAMMA = 2.2f;\r\nconst mediump float INV_GAMMA = 1.0f / GAMMA;\r\n// linear to sRGB approximation (http://chilliant.blogspot.com/2012/08/srgb-approximations-for-hlsl.html)\r\nmediump vec3 linearTosRGB(mediump vec3 color) {\r\n    return pow(color, vec3(INV_GAMMA));\r\n}\r\n// sRGB to linear approximation (http://chilliant.blogspot.com/2012/08/srgb-approximations-for-hlsl.html)\r\nmediump vec3 sRGBToLinear(mediump vec3 srgbIn) {\r\n    return vec3(pow(srgbIn.xyz, vec3(GAMMA)));\r\n}\r\n\r\n// gradients\r\nconst mediump float numGradients = 2.f;\r\nconst mediump float deviationV = 0.f / numGradients + .5f / numGradients;\r\nconst mediump float elevationV = 1.f / numGradients + .5f / numGradients;\r\n\r\nmediump vec4 getGradientColor(mediump sampler2D gradientTexture, highp float position, mediump float v, highp vec2 range) {\r\n    mediump float u = (range[0] >= range[1]) ? 0.f : (position - range[0]) / (range[1] - range[0]);\r\n    return texture(gradientTexture, vec2(u, v));\r\n}\r\n\r\n// packing\r\n\r\n// we use octrahedral packing of normals to map 3 components down to 2: https://jcgt.org/published/0003/02/01/\r\nmediump vec2 signNotZero(mediump vec2 v) { // returns \xB11\r\n    return vec2((v.x >= 0.f) ? +1.f : -1.f, (v.y >= 0.f) ? +1.f : -1.f);\r\n}\r\n\r\nmediump vec2 float32x3_to_oct(mediump vec3 v) { // assume normalized input. Output is on [-1, 1] for each component.\r\n    // project the sphere onto the octahedron, and then onto the xy plane\r\n    mediump vec2 p = v.xy * (1.f / (abs(v.x) + abs(v.y) + abs(v.z)));\r\n    // reflect the folds of the lower hemisphere over the diagonals\r\n    return (v.z <= 0.f) ? ((1.f - abs(p.yx)) * signNotZero(p)) : p;\r\n}\r\n\r\nmediump vec3 oct_to_float32x3(mediump vec2 e) {\r\n    mediump vec3 v = vec3(e.xy, 1.f - abs(e.x) - abs(e.y));\r\n    if(v.z < 0.f)\r\n        v.xy = (1.f - abs(v.yx)) * signNotZero(v.xy);\r\n    return normalize(v);\r\n}\r\n\r\nhighp uvec2 packNormalAndDeviation(mediump vec3 normal, mediump float deviation) {\r\n    return uvec2(packHalf2x16(normal.xy), packHalf2x16(vec2(normal.z, deviation)));\r\n}\r\n\r\nhighp uvec2 packNormal(mediump vec3 normal) {\r\n    return packNormalAndDeviation(normal, 0.f);\r\n}\r\n\r\nmediump vec4 unpackNormalAndDeviation(highp uvec2 normalAndDeviation) {\r\n    return vec4(unpackHalf2x16(normalAndDeviation[0]), unpackHalf2x16(normalAndDeviation[1]));\r\n}\r\n\r\nhighp uint combineMediumP(highp uint high, highp uint low) {\r\n    return (high << 16u) | (low & 0xffffu);\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/benchmark/shaders/fillrate.vert
var fillrate_default = "out float instance;\r\n\r\nvoid main() {\r\n    vec2 pos = vec2(gl_VertexID % 2, gl_VertexID / 2) * 2.0 - 1.0;\r\n    // float z = 1. - float(gl_InstanceID) * depth;\r\n    gl_Position = vec4(pos, 0, 1);\r\n    instance = float(gl_InstanceID);\r\n}";

// /projects/Novorender/ts/dist/core3d/benchmark/shaders/fillrate.frag
var fillrate_default2 = "in float instance;\r\nuniform float seed;\r\n\r\nconst float PHI = 1.61803398874989484820459;  // \u03A6 = Golden Ratio   \r\n\r\nfloat gold_noise(in vec2 xy, in float seed) {\r\n    return fract(tan(distance(xy * PHI, xy) * seed) * xy.x);\r\n}\r\n\r\nout vec4 fragColor;\r\nvoid main() {\r\n    // float v = gold_noise(gl_FragCoord.xy, instance / 1024. + seed);\r\n    fragColor = vec4(seed, seed, seed, 1);\r\n    // fragColor = vec4(v, v, v, .5);\r\n    // fragColor = vec4(1);\r\n}";

// /projects/Novorender/ts/dist/core3d/benchmark/shaders/pointrate.vert
var pointrate_default = "void main() {\r\n    vec2 pos = vec2(gl_VertexID % 1024, gl_VertexID / 1024) / 512.0 - 1.0;\r\n    gl_Position = vec4(pos, 0, 1);\r\n    gl_PointSize = 1.;\r\n}";

// /projects/Novorender/ts/dist/core3d/benchmark/shaders/pointrate.frag
var pointrate_default2 = "uniform vec4 color;\r\nout vec4 fragColor;\r\nvoid main() {\r\n    fragColor = color;\r\n}";

// /projects/Novorender/ts/dist/core3d/benchmark/shaders/index.ts
var shaders = {
  fillrate: {
    vertexShader: fillrate_default,
    fragmentShader: fillrate_default2
  },
  pointrate: {
    vertexShader: pointrate_default,
    fragmentShader: pointrate_default2
  }
};

// /projects/Novorender/ts/dist/core3d/modules/background/shaders/shader.vert
var shader_default = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Background {\r\n    BackgroundUniforms background;\r\n};\r\n\r\nuniform BackgroundTextures textures;\r\n\r\nout BackgroundVaryings varyings;\r\n\r\nvoid main() {\r\n    // output degenerate triangle if ortho camera to use clear color instead\r\n    bool isPerspective = camera.viewClipMatrix[3][3] == 0.0;\r\n    vec2 pos = vec2(gl_VertexID % 2, gl_VertexID / 2) * 2.0 - 1.0;\r\n    gl_Position = isPerspective ? vec4(pos, 1, 1) : vec4(0);\r\n    vec3 dirVS = vec3(pos.x / camera.viewClipMatrix[0][0], pos.y / camera.viewClipMatrix[1][1], -1);\r\n    varyings.dir = camera.viewLocalMatrixNormal * dirVS;\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/background/shaders/shader.frag
var shader_default2 = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Background {\r\n    BackgroundUniforms background;\r\n};\r\n\r\nuniform BackgroundTextures textures;\r\n\r\nin BackgroundVaryings varyings;\r\n\r\nlayout(location = 0) out mediump vec4 fragColor;\r\n\r\nvoid main() {\r\n    mediump vec3 rgb;\r\n    if(background.envBlurNormalized == 0.f) {\r\n        rgb = texture(textures.skybox, normalize(varyings.dir)).rgb;\r\n    } else {\r\n        mediump float lod = background.envBlurNormalized * float(background.mipCount - 1);\r\n        lod = min(lod, float(background.mipCount - 4)); // the last 3 mips are black for some reason (because of RGBA16F format?), so we clamp to avoid this.\r\n        rgb = textureLod(textures.ibl.specular, normalize(varyings.dir), lod).rgb;\r\n    }\r\n    fragColor = vec4(rgb, 1);\r\n}";

// /projects/Novorender/ts/dist/core3d/modules/background/shaders/index.ts
var shaders2 = {
  render: {
    vertexShader: shader_default,
    fragmentShader: shader_default2
  }
};
var shaders_default = shaders2;

// /projects/Novorender/ts/dist/core3d/modules/clipping/shaders/shader.vert
var shader_default3 = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Clipping {\r\n    ClippingUniforms clipping;\r\n};\r\n\r\nlayout(std140) uniform Colors {\r\n    ClippingColors visualization;\r\n};\r\n\r\nout ClippingVaryings varyings;\r\n\r\nvoid main() {\r\n    vec2 pos = vec2(gl_VertexID % 2, gl_VertexID / 2) * 2.0 - 1.0;\r\n    vec3 dirVS = vec3(pos.x / camera.viewClipMatrix[0][0], pos.y / camera.viewClipMatrix[1][1], -1);\r\n    varyings.dirVS = dirVS;\r\n    gl_Position = vec4(pos, 0.9, 1);\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/clipping/shaders/shader.frag
var shader_default4 = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Clipping {\r\n    ClippingUniforms clipping;\r\n};\r\n\r\nlayout(std140) uniform Colors {\r\n    ClippingColors visualization;\r\n};\r\n\r\nin ClippingVaryings varyings;\r\n\r\nlayout(location = 0) out vec4 fragColor;\r\nlayout(location = 1) out uvec4 fragPick;\r\n\r\nvoid main() {\r\n    mediump vec3 dir = normalize(varyings.dirVS);\r\n    float rangeT[2] = float[](0.f, 1000000.f); // min, max T\r\n    uint idx[2] = uint[](undefinedIndex, undefinedIndex);\r\n    float s = clipping.mode == 0U ? 1.f : -1.f;\r\n    for(uint i = 0U; i < clipping.numPlanes; i++) {\r\n        highp vec4 plane = clipping.planes[i];\r\n        highp vec3 normal = plane.xyz;\r\n        highp float offset = plane.w;\r\n        highp float denom = dot(dir, normal);\r\n        if(abs(denom) > 0.f) {\r\n            float t = -offset / denom;\r\n            if(denom * s > 0.f) {\r\n                // back facing\r\n                if(rangeT[0] < t) {\r\n                    rangeT[0] = t;\r\n                    idx[0] = i;\r\n                }\r\n            } else {\r\n                // front facing\r\n                if(rangeT[1] > t) {\r\n                    rangeT[1] = t;\r\n                    idx[1] = i;\r\n                }\r\n            }\r\n        }\r\n    }\r\n    lowp uint i = clipping.mode == 0U ? 1U : 0U;\r\n    if(idx[i] == undefinedIndex || rangeT[1] < rangeT[0])\r\n        discard;\r\n    highp vec4 posVS = vec4(dir * rangeT[i], 1.f);\r\n    highp vec4 posCS = camera.viewClipMatrix * posVS;\r\n    highp float ndcDepth = (posCS.z / posCS.w);\r\n    gl_FragDepth = (gl_DepthRange.diff * ndcDepth + gl_DepthRange.near + gl_DepthRange.far) / 2.f;\r\n    mediump vec4 rgba = visualization.colors[idx[i]];\r\n    highp uint objectId = clippingId + idx[i];\r\n    if(rgba.a == 0.f)\r\n        discard;\r\n    fragColor = rgba;\r\n    mediump vec3 normal = camera.viewLocalMatrixNormal * clipping.planes[idx[i]].xyz;\r\n    highp float linearDepth = -posVS.z;\r\n    fragPick = uvec4(objectId, packNormal(normal), floatBitsToUint(linearDepth));\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/clipping/shaders/index.ts
var shaders3 = {
  render: {
    vertexShader: shader_default3,
    fragmentShader: shader_default4
  }
};
var shaders_default2 = shaders3;

// /projects/Novorender/ts/dist/core3d/modules/cube/shaders/render.vert
var render_default = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Clipping {\r\n    ClippingUniforms clipping;\r\n};\r\n\r\nlayout(std140) uniform Cube {\r\n    CubeUniforms cube;\r\n};\r\n\r\nout CubeVaryings varyings;\r\n\r\nlayout(location = 0) in vec4 vertexPosition;\r\nlayout(location = 1) in vec3 vertexNormal;\r\nlayout(location = 2) in vec3 vertexColor;\r\n\r\nvoid main() {\r\n    vec4 posVS = camera.localViewMatrix * cube.modelLocalMatrix * vertexPosition;\r\n    gl_Position = camera.viewClipMatrix * posVS;\r\n    varyings.posVS = posVS.xyz;\r\n    varyings.normal = vertexNormal;\r\n    varyings.color = vertexColor;\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/cube/shaders/render.frag
var render_default2 = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Clipping {\r\n    ClippingUniforms clipping;\r\n};\r\n\r\nlayout(std140) uniform Cube {\r\n    CubeUniforms cube;\r\n};\r\n\r\nin CubeVaryings varyings;\r\n\r\n#if !defined(PICK)\r\nlayout(location = 0) out mediump vec4 fragColor;\r\n#else\r\nlayout(location = 1) out highp uvec4 fragPick;\r\n#endif\r\n\r\nvoid main() {\r\n    float linearDepth = -varyings.posVS.z;\r\n    if(linearDepth < camera.near || clip(varyings.posVS, clipping))\r\n        discard;\r\n#if !defined(PICK)\r\n    fragColor = vec4(gl_FrontFacing ? varyings.color : vec3(.25f), 1);\r\n#else\r\n    fragPick = uvec4(cubeId, packNormal(normalize(varyings.normal).xyz), floatBitsToUint(linearDepth));\r\n#endif\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/cube/shaders/line.vert
var line_default = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Clipping {\r\n    ClippingUniforms clipping;\r\n};\r\n\r\nlayout(std140) uniform Cube {\r\n    CubeUniforms cube;\r\n};\r\n\r\nlayout(std140) uniform Outline {\r\n    OutlineUniforms outline;\r\n};\r\n\r\nlayout(location = 0) in vec4 vertexPositions;\r\nlayout(location = 1) in float vertexOpacity;\r\n\r\nout struct {\r\n    vec3 positionVS;\r\n    float opacity;\r\n} varyings;\r\n\r\nvoid main() {\r\n    vec2 pos = gl_VertexID % 2 == 0 ? vertexPositions.xy : vertexPositions.zw;\r\n    vec3 posVS = (camera.localViewMatrix * outline.planeLocalMatrix * vec4(pos, 0, 1)).xyz;\r\n    varyings.positionVS = posVS;\r\n    varyings.opacity = vertexOpacity;\r\n    gl_Position = camera.viewClipMatrix * vec4(posVS, 1);\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/cube/shaders/line.frag
var line_default2 = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Clipping {\r\n    ClippingUniforms clipping;\r\n};\r\n\r\nlayout(std140) uniform Cube {\r\n    CubeUniforms cube;\r\n};\r\n\r\nlayout(std140) uniform Outline {\r\n    OutlineUniforms outline;\r\n};\r\n\r\nin struct {\r\n    vec3 positionVS;\r\n    float opacity;\r\n} varyings;\r\n\r\nlayout(location = 0) out vec4 fragColor;\r\n\r\nvoid main() {\r\n    if(clipOutlines(varyings.positionVS, clipping))\r\n        discard;\r\n    fragColor = vec4(outline.color, varyings.opacity);\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/cube/shaders/intersect.vert
var intersect_default = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Clipping {\r\n    ClippingUniforms clipping;\r\n};\r\n\r\nlayout(std140) uniform Cube {\r\n    CubeUniforms cube;\r\n};\r\n\r\nlayout(std140) uniform Outline {\r\n    OutlineUniforms outline;\r\n};\r\n\r\nvec2 intersectEdge(vec3 p0, vec3 p1) {\r\n    float t = -p0.z / (p1.z - p0.z);\r\n    return mix(p0.xy, p1.xy, t);\r\n}\r\n\r\nlayout(location = 0) in vec4 vertexPos0;\r\nlayout(location = 1) in vec4 vertexPos1;\r\nlayout(location = 2) in vec4 vertexPos2;\r\n\r\nflat out uvec2 line_vertices;\r\nout float opacity;\r\n\r\nvoid main() {\r\n    vec3 pos0 = (outline.localPlaneMatrix * cube.modelLocalMatrix * vertexPos0).xyz;\r\n    vec3 pos1 = (outline.localPlaneMatrix * cube.modelLocalMatrix * vertexPos1).xyz;\r\n    vec3 pos2 = (outline.localPlaneMatrix * cube.modelLocalMatrix * vertexPos2).xyz;\r\n    vec3 ab = pos1 - pos0;\r\n    vec3 ac = pos2 - pos0;\r\n    vec3 normal = normalize(cross(ab, ac));\r\n    vec3 z = vec3(pos0.z, pos1.z, pos2.z);\r\n    bvec3 gt = greaterThan(z, vec3(0));\r\n    bvec3 lt = lessThan(z, vec3(0));\r\n    int i = 0;\r\n    vec2 line[3];\r\n    // does triangle straddle clipping plane?\r\n    if(any(gt) && any(lt)) {\r\n        // find intersecting edges\r\n        if(any(gt.xy) && any(lt.xy)) {\r\n            line[i++] = intersectEdge(pos0, pos1);\r\n        }\r\n        if(any(gt.yz) && any(lt.yz)) {\r\n            line[i++] = intersectEdge(pos1, pos2);\r\n        }\r\n        if(any(gt.zx) && any(lt.zx)) {\r\n            line[i++] = intersectEdge(pos2, pos0);\r\n        }\r\n    }\r\n    if(i == 2) {\r\n        line_vertices = uvec2(packHalf2x16(line[0]), packHalf2x16(line[1]));\r\n    } else {\r\n        line_vertices = uvec2(0);\r\n    }\r\n    opacity = 1. - abs(normal.z);\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/cube/shaders/index.ts
var shaders4 = {
  render: {
    vertexShader: render_default,
    fragmentShader: render_default2
  },
  line: {
    vertexShader: line_default,
    fragmentShader: line_default2
  },
  intersect: {
    vertexShader: intersect_default
  }
};
var shaders_default3 = shaders4;

// /projects/Novorender/ts/dist/core3d/modules/dynamic/shaders/shader.vert
var shader_default5 = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Material {\r\n    MaterialUniforms material;\r\n};\r\n\r\nlayout(std140) uniform Object {\r\n    ObjectUniforms object;\r\n};\r\n\r\nuniform DynamicTextures textures;\r\n\r\nout DynamicVaryings varyings;\r\nflat out DynamicVaryingsFlat varyingsFlat;\r\n\r\nlayout(location = 0) in vec4 vertexPosition;\r\nlayout(location = 1) in mediump vec3 vertexNormal;\r\nlayout(location = 2) in mediump vec4 vertexTangent;\r\nlayout(location = 3) in mediump vec4 vertexColor0;\r\nlayout(location = 4) in vec2 vertexTexCoord0;\r\nlayout(location = 5) in vec2 vertexTexCoord1;\r\nlayout(location = 6) in mat4x3 vertexInstanceMatrix;\r\n\r\nvoid main() {\r\n    mat4 instanceMatrix = mat4(vertexInstanceMatrix);\r\n    mat3 instanceMatrixNormal = mat3(instanceMatrix); // TODO: normalize?\r\n    vec4 posVS = camera.localViewMatrix * instanceMatrix * vertexPosition;\r\n    gl_Position = camera.viewClipMatrix * posVS;\r\n    gl_PointSize = 1.f;\r\n    vec3 normalLS = instanceMatrixNormal * vertexNormal;\r\n    vec3 tangentLS = instanceMatrixNormal * vertexTangent.xyz;\r\n    vec3 cameraPosLS = camera.viewLocalMatrix[3].xyz;\r\n    vec3 vertexPosLS = (instanceMatrix * vertexPosition).xyz;\r\n    vec3 bitangentLS = cross(normalLS, tangentLS.xyz) * vertexTangent.w;\r\n    varyings.tbn = mat3(tangentLS, bitangentLS, normalLS);\r\n\r\n    varyings.positionVS = posVS.xyz;\r\n    varyings.toCamera = cameraPosLS - vertexPosLS;\r\n    varyings.texCoord0 = vertexTexCoord0;\r\n    varyings.texCoord1 = vertexTexCoord1;\r\n    varyings.color0 = vertexColor0;\r\n    varyings.linearDepth = -posVS.z;\r\n    highp uint objId = object.baseObjectId != 0xffffU ? object.baseObjectId + uint(gl_InstanceID) : object.baseObjectId;\r\n#if defined (ADRENO600)\r\n    varyingsFlat.objectId_high = objId >> 16u;\r\n    varyingsFlat.objectId_low = objId & 0xffffu;\r\n#else\r\n    varyingsFlat.objectId = objId;\r\n#endif\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/dynamic/shaders/shader.frag
var shader_default6 = `layout(std140) uniform Camera {\r
    CameraUniforms camera;\r
};\r
\r
layout(std140) uniform Material {\r
    MaterialUniforms material;\r
};\r
\r
layout(std140) uniform Object {\r
    ObjectUniforms object;\r
};\r
\r
uniform DynamicTextures textures;\r
\r
in DynamicVaryings varyings;\r
flat in DynamicVaryingsFlat varyingsFlat;\r
\r
layout(location = 0) out mediump vec4 fragColor;\r
layout(location = 1) out highp uvec4 fragPick;\r
\r
float clampedDot(vec3 x, vec3 y) {\r
    return clamp(dot(x, y), 0.0f, 1.0f);\r
}\r
\r
struct NormalInfo {\r
    vec3 ng;   // Geometric normal\r
    vec3 n;    // Pertubed normal\r
    vec3 t;    // Pertubed tangent\r
    vec3 b;    // Pertubed bitangent\r
};\r
\r
// Get normal, tangent and bitangent vectors.\r
NormalInfo getNormalInfo(vec3 v) {\r
    vec2 UV = material.normalUVSet == 0 ? varyings.texCoord0 : varyings.texCoord1;\r
    vec3 uv_dx = dFdx(vec3(UV, 0));\r
    vec3 uv_dy = dFdy(vec3(UV, 0));\r
\r
    if(length(uv_dx) + length(uv_dy) <= 1e-6f) {\r
        uv_dx = vec3(1.0f, 0.0f, 0.0f);\r
        uv_dy = vec3(0.0f, 1.0f, 0.0f);\r
    }\r
\r
    vec3 t_ = (uv_dy.t * dFdx(v) - uv_dx.t * dFdy(v)) / (uv_dx.s * uv_dy.t - uv_dy.s * uv_dx.t);\r
\r
    vec3 n, t, b, ng;\r
\r
    vec3 axisX = dFdx(varyings.positionVS);\r
    vec3 axisY = dFdy(varyings.positionVS);\r
    vec3 geometricNormalVS = normalize(cross(axisX, axisY));\r
\r
    vec3 nrm = varyings.tbn[2];\r
    if(dot(nrm, nrm) < 0.5f)\r
        nrm = camera.viewLocalMatrixNormal * geometricNormalVS;\r
    ng = normalize(nrm);\r
    // ng = normalize(varyings.tbn[2]);\r
    t = normalize(t_ - ng * dot(ng, t_));\r
    b = cross(ng, t);\r
\r
    // // Normalize eigenvectors as matrix is linearly interpolated.\r
    // t = normalize(varyings.tbn[0]);\r
    // b = normalize(vTvaryings.tbnBN[1]);\r
    // ng = normalize(varyings.tbn[2]);\r
\r
    // For a back-facing surface, the tangential basis vectors are negated.\r
    float facing = step(0.f, dot(v, ng)) * 2.f - 1.f;\r
    t *= facing;\r
    b *= facing;\r
    ng *= facing;\r
\r
    // Compute pertubed normals:\r
    if(material.normalUVSet >= 0) {\r
        n = texture(textures.normal, UV).rgb * 2.f - vec3(1.f);\r
        n *= vec3(material.normalScale, material.normalScale, 1.f);\r
        n = mat3(t, b, ng) * normalize(n);\r
    } else {\r
        n = ng;\r
    }\r
\r
    NormalInfo info;\r
    info.ng = ng;\r
    info.t = t;\r
    info.b = b;\r
    info.n = n;\r
    return info;\r
}\r
\r
struct MaterialInfo {\r
    mediump float perceptualRoughness;      // roughness value, as authored by the model creator (input to shader)\r
    mediump vec3 f0;                        // full reflectance color (n incidence angle)\r
\r
    mediump float alphaRoughness;           // roughness mapped to a more linear change in the roughness (proposed by [2])\r
    mediump vec3 albedoColor;\r
\r
    mediump vec3 f90;                       // reflectance color at grazing angle\r
    mediump float metallic;\r
\r
    mediump vec3 n;\r
    mediump vec3 baseColor; // getBaseColor()\r
};\r
\r
MaterialInfo getMetallicRoughnessInfo(MaterialInfo info, mediump float f0_ior) {\r
    info.metallic = material.metallicFactor;\r
    info.perceptualRoughness = material.roughnessFactor;\r
\r
    if(material.metallicRoughnessUVSet >= 0) {\r
        vec2 uv = material.metallicRoughnessUVSet == 0 ? varyings.texCoord0 : varyings.texCoord1;\r
        // Roughness is stored in the 'g' channel, metallic is stored in the 'b' channel.\r
        // This layout intentionally reserves the 'r' channel for (optional) occlusion map data\r
        vec4 mrSample = texture(textures.metallic_roughness, uv);\r
        info.perceptualRoughness *= mrSample.g;\r
        info.metallic *= mrSample.b;\r
    }\r
\r
    // Achromatic f0 based on IOR.\r
    vec3 f0 = vec3(f0_ior);\r
\r
    info.albedoColor = mix(info.baseColor.rgb * (vec3(1.0f) - f0), vec3(0), info.metallic);\r
    info.f0 = mix(f0, info.baseColor.rgb, info.metallic);\r
\r
    return info;\r
}\r
\r
mediump vec3 getIBLRadianceGGX(mediump vec3 n, vec3 v, mediump float perceptualRoughness, mediump vec3 specularColor) {\r
    float NdotV = clampedDot(n, v);\r
    vec3 reflection = normalize(reflect(-v, n));\r
    vec2 brdfSamplePoint = clamp(vec2(NdotV, perceptualRoughness), vec2(0.0f, 0.0f), vec2(1.0f, 1.0f));\r
    mediump vec2 brdf = texture(textures.lut_ggx, brdfSamplePoint).rg;\r
    mediump float lod = clamp(perceptualRoughness * float(material.radianceMipCount), 0.0f, float(material.radianceMipCount));\r
    mediump vec4 specularSample = textureLod(textures.ibl.specular, reflection, lod);\r
    mediump vec3 specularLight = specularSample.rgb;\r
    return specularLight * (specularColor * brdf.x + brdf.y);\r
}\r
\r
mediump vec3 getIBLRadianceLambertian(mediump vec3 n, mediump vec3 diffuseColor) {\r
    vec3 diffuseLight = texture(textures.ibl.diffuse, n).rgb;\r
    return diffuseLight * diffuseColor;\r
}\r
\r
void main() {\r
    mediump vec4 baseColor = material.baseColorFactor * varyings.color0;\r
\r
    if(material.baseColorUVSet >= 0) {\r
        vec2 uv = material.baseColorUVSet < 1 ? varyings.texCoord0 : varyings.texCoord1;\r
        mediump vec4 bc = texture(textures.base_color, uv);\r
        baseColor *= vec4(sRGBToLinear(bc.rgb), bc.a);\r
    }\r
    if(baseColor.a < material.alphaCutoff)\r
        discard;\r
\r
    mediump vec3 v = normalize(varyings.toCamera);\r
    NormalInfo normalInfo = getNormalInfo(v);\r
    vec3 n = normalInfo.n;\r
    vec3 normal = normalInfo.n;\r
    // vec3 l = normalize(uSunDir);   // Direction from surface point to light\r
    // vec3 h = normalize(l + v);     // Direction of the vector between l and v, called halfway vector\r
\r
    mediump vec4 outColor;\r
\r
#if defined(PBR_METALLIC_ROUGHNESS)\r
\r
    MaterialInfo materialInfo;\r
    materialInfo.baseColor = baseColor.rgb;\r
\r
    // The default index of refraction of 1.5 yields a dielectric normal incidence reflectance of 0.04.\r
    mediump float ior = 1.5f;\r
    mediump float f0_ior = 0.04f;\r
\r
    materialInfo = getMetallicRoughnessInfo(materialInfo, f0_ior);\r
\r
    materialInfo.perceptualRoughness = clamp(materialInfo.perceptualRoughness, 0.0f, 1.0f);\r
    materialInfo.metallic = clamp(materialInfo.metallic, 0.0f, 1.0f);\r
\r
    // Roughness is authored as perceptual roughness; as is convention,\r
    // convert to material roughness by squaring the perceptual roughness.\r
    materialInfo.alphaRoughness = materialInfo.perceptualRoughness * materialInfo.perceptualRoughness;\r
\r
    // Compute reflectance.\r
    mediump float reflectance = max(max(materialInfo.f0.r, materialInfo.f0.g), materialInfo.f0.b);\r
\r
    // Anything less than 2% is physically impossible and is instead considered to be shadowing. Compare to "Real-Time-Rendering" 4th editon on page 325.\r
    materialInfo.f90 = vec3(clamp(reflectance * 50.0f, 0.0f, 1.0f));\r
\r
    materialInfo.n = n;\r
\r
    // LIGHTING\r
    mediump vec3 f_specular = vec3(0.0f);\r
    mediump vec3 f_diffuse = vec3(0.0f);\r
    mediump vec3 f_emissive = vec3(0.0f);\r
\r
    f_specular += getIBLRadianceGGX(n, v, materialInfo.perceptualRoughness, materialInfo.f0);\r
    f_diffuse += getIBLRadianceLambertian(n, materialInfo.albedoColor);\r
\r
    // float NdotL = clampedDot(n, l);\r
    // float NdotV = clampedDot(n, v);\r
    // float NdotH = clampedDot(n, h);\r
    // float LdotH = clampedDot(l, h);\r
    // float VdotH = clampedDot(v, h);\r
\r
    // vec3 intensity = vec3(uSunBrightness);\r
\r
    // if(NdotL > 0.0 || NdotV > 0.0) {\r
    //     // Calculation of analytical light\r
    //     //https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#acknowledgments AppendixB\r
    //     f_specular += intensity * NdotL * BRDF_specularGGX(materialInfo.f0, materialInfo.f90, materialInfo.alphaRoughness, VdotH, NdotL, NdotV, NdotH);\r
    //     f_diffuse += intensity * NdotL * BRDF_lambertian(materialInfo.f0, materialInfo.f90, materialInfo.albedoColor, VdotH);\r
    // }\r
\r
    f_emissive = material.emissiveFactor;\r
    if(material.emissiveUVSet >= 0) {\r
        vec2 uv = material.emissiveUVSet == 0 ? varyings.texCoord0 : varyings.texCoord1;\r
        f_emissive *= sRGBToLinear(texture(textures.emissive, uv).rgb);\r
    }\r
\r
    mediump vec3 color = (f_emissive + f_diffuse + f_specular) + ambientLight * materialInfo.albedoColor;\r
\r
    // Apply optional PBR terms for additional (optional) shading\r
    if(material.occlusionUVSet >= 0) {\r
        vec2 uv = material.occlusionUVSet == 0 ? varyings.texCoord0 : varyings.texCoord1;\r
        mediump float ao = texture(textures.occlusion, uv).r;\r
        color = mix(color, color * ao, material.occlusionStrength);\r
    }\r
\r
    outColor.rgb = color;\r
    outColor.a = baseColor.a;\r
\r
#else\r
\r
    outColor = baseColor;\r
\r
#endif\r
\r
    fragColor = outColor;\r
    // only write to pick buffers for opaque triangles (for devices without OES_draw_buffers_indexed support)\r
    if(outColor.a >= 0.99f) {\r
#if defined (ADRENO600)\r
        fragPick = uvec4(combineMediumP(varyingsFlat.objectId_high, varyingsFlat.objectId_low), packNormal(normal), floatBitsToUint(varyings.linearDepth));\r
#else\r
        fragPick = uvec4(varyingsFlat.objectId, packNormal(normal), floatBitsToUint(varyings.linearDepth));\r
#endif\r
    }\r
}\r
`;

// /projects/Novorender/ts/dist/core3d/modules/dynamic/shaders/index.ts
var shaders5 = {
  render: {
    vertexShader: shader_default5,
    fragmentShader: shader_default6
  }
};
var shaders_default4 = shaders5;

// /projects/Novorender/ts/dist/core3d/modules/grid/shaders/shader.vert
var shader_default7 = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Grid {\r\n    GridUniforms grid;\r\n};\r\n\r\nout GridVaryings varyings;\r\n\r\nvoid main() {\r\n    vec3 cameraPosLS = camera.viewLocalMatrix[3].xyz;\r\n    vec2 posOS = (vec2(gl_VertexID % 2, gl_VertexID / 2) * 2. - 1.) * grid.distance;\r\n    posOS += vec2(dot(cameraPosLS - grid.origin, grid.axisX), dot(cameraPosLS - grid.origin, grid.axisY));\r\n    vec3 posLS = grid.origin + grid.axisX * posOS.x + grid.axisY * posOS.y;\r\n    varyings.posOS = posOS;\r\n    varyings.posLS = posLS;\r\n    gl_Position = camera.viewClipMatrix * camera.localViewMatrix * vec4(posLS, 1);\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/grid/shaders/shader.frag
var shader_default8 = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Grid {\r\n    GridUniforms grid;\r\n};\r\n\r\nin GridVaryings varyings;\r\n\r\nlayout(location = 0) out mediump vec4 fragColor;\r\n\r\nfloat getGrid(vec2 r) {\r\n    vec2 grid = abs(fract(r - 0.5f) - 0.5f) / fwidth(r);\r\n    float line = min(grid.x, grid.y);\r\n    return 1.0f - min(line, 1.0f);\r\n}\r\n\r\nvoid main() {\r\n    highp vec3 cameraPosLS = camera.viewLocalMatrix[3].xyz;\r\n    highp float d = 1.0f - min(distance(cameraPosLS, varyings.posLS) / grid.distance, 1.0f);\r\n    mediump float g1 = getGrid(varyings.posOS / grid.size1);\r\n    mediump float g2 = getGrid(varyings.posOS / grid.size2);\r\n    fragColor = vec4(g2 > 0.001f ? grid.color2 : grid.color1, max(g2, g1) * pow(d, 3.0f));\r\n    fragColor.a = mix(0.5f * fragColor.a, fragColor.a, g2) * 1.5f;\r\n    if(fragColor.a <= 0.0f)\r\n        discard;\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/grid/shaders/index.ts
var shaders6 = {
  render: {
    vertexShader: shader_default7,
    fragmentShader: shader_default8
  }
};
var shaders_default5 = shaders6;

// /projects/Novorender/ts/dist/core3d/modules/octree/shaders/render.vert
var render_default3 = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Clipping {\r\n    ClippingUniforms clipping;\r\n};\r\n\r\nlayout(std140) uniform Scene {\r\n    SceneUniforms scene;\r\n};\r\n\r\nlayout(std140) uniform Node {\r\n    NodeUniforms node;\r\n};\r\n\r\nuniform OctreeTextures textures;\r\n\r\nout OctreeVaryings varyings;\r\nflat out OctreeVaryingsFlat varyingsFlat;\r\n\r\nlayout(location = 0) in vec4 vertexPosition;\r\n#if (PASS != PASS_PRE)\r\nlayout(location = 1) in vec3 vertexNormal;\r\nlayout(location = 2) in uint vertexMaterial;\r\nlayout(location = 3) in uint vertexObjectId;\r\nlayout(location = 4) in vec2 vertexTexCoord0;\r\nlayout(location = 5) in vec4 vertexColor0;\r\nlayout(location = 6) in vec4 vertexProjectedPos;\r\nlayout(location = 7) in vec4 vertexDeviations;\r\nlayout(location = 8) in uint vertexHighlight;\r\n#else\r\nconst vec3 vertexNormal = vec3(0);\r\nconst uint vertexMaterial = 0U;\r\nconst uint vertexObjectId = 0U;\r\nconst vec2 vertexTexCoord0 = vec2(0);\r\nconst vec4 vertexColor0 = vec4(1);\r\nconst vec4 vertexProjectedPos = vec4(0);\r\nconst vec4 vertexDeviations = vec4(0);\r\nconst uint vertexHighlight = 0U;\r\n#endif\r\n\r\nvoid main() {\r\n    vec4 vertPos = vertexPosition;\r\n    bool isDefined = dot(vertexProjectedPos.xyz, vertexProjectedPos.xyz) != 0.f;\r\n    if(scene.useProjectedPosition && vertexProjectedPos.w != 0.f && isDefined) {\r\n        vertPos = vertexProjectedPos;\r\n    }\r\n    vec4 posLS = node.modelLocalMatrix * vertPos;\r\n    vec4 posVS = camera.localViewMatrix * posLS;\r\n    gl_Position = camera.viewClipMatrix * posVS;\r\n\r\n    vec4 color = vertexMaterial == 0xffU ? vertexColor0 : texture(textures.materials, vec2((float(vertexMaterial) + .5f) / 256.f, .5f));\r\n    float deviation = 0.f;\r\n\r\n#if (MODE == MODE_POINTS)\r\n    deviation = vertexDeviations[scene.deviationIndex];\r\n    if(scene.deviationFactor > 0.f) {\r\n        if(deviation == 0.f) { //undefined\r\n            if(dot(scene.deviationUndefinedColor, scene.deviationUndefinedColor) != 0.f) {\r\n                color = scene.deviationUndefinedColor;\r\n            }\r\n        } else {\r\n            vec4 gradientColor = getGradientColor(textures.gradients, deviation, deviationV, scene.deviationRange);\r\n            color = mix(vertexColor0, gradientColor, scene.deviationFactor);\r\n        }\r\n    }\r\n\r\n    // compute point size\r\n    mediump float linearSize = scene.metricSize + node.tolerance * scene.toleranceFactor;\r\n    mediump float projectedSize = max(0.f, camera.viewClipMatrix[1][1] * linearSize * float(camera.viewSize.y) * 0.5f / gl_Position.w);\r\n    gl_PointSize = min(scene.maxPixelSize, max(1.0f, scene.pixelSize + projectedSize));\r\n\r\n    // Convert position to window coordinates\r\n    vec2 halfsize = camera.viewSize * 0.5f;\r\n    varyings.screenPos = halfsize + ((gl_Position.xy / gl_Position.w) * halfsize);\r\n\r\n    // Convert radius to window coordinates\r\n    varyings.radius = max(1.0f, gl_PointSize * 0.5f);\r\n#elif defined (HIGHLIGHT)\r\n    if(vertexHighlight >= 0xFEU) {\r\n        gl_Position = vec4(0); // hide 0xfe/0xff groups by outputting degenerate triangles/lines\r\n    }\r\n#endif\r\n\r\n    varyings.positionVS = posVS.xyz;\r\n    varyings.normalVS = normalize(camera.localViewMatrixNormal * vertexNormal);\r\n    varyings.texCoord0 = vertexTexCoord0;\r\n    varyings.deviation = deviation;\r\n    varyings.elevation = posLS.y;\r\n    varyingsFlat.color = color;\r\n#if defined (ADRENO600)\r\n    varyingsFlat.objectId_high = vertexObjectId >> 16u;\r\n    varyingsFlat.objectId_low = vertexObjectId & 0xffffu;\r\n#else\r\n    varyingsFlat.objectId = vertexObjectId;\r\n#endif\r\n    varyingsFlat.highlight = vertexHighlight;\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/octree/shaders/render.frag
var render_default4 = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Clipping {\r\n    ClippingUniforms clipping;\r\n};\r\n\r\nlayout(std140) uniform Scene {\r\n    SceneUniforms scene;\r\n};\r\n\r\nlayout(std140) uniform Node {\r\n    NodeUniforms node;\r\n};\r\n\r\nuniform OctreeTextures textures;\r\n\r\nin OctreeVaryings varyings;\r\nflat in OctreeVaryingsFlat varyingsFlat;\r\n\r\nlayout(location = 0) out vec4 fragColor;\r\nlayout(location = 1) out uvec4 fragPick;\r\n\r\nvoid main() {\r\n    highp float linearDepth = -varyings.positionVS.z;\r\n#if defined(CLIP)\r\n    if(linearDepth < camera.near)\r\n        discard;\r\n\r\n    lowp float s = clipping.mode == clippingModeIntersection ? -1.f : 1.f;\r\n    bool inside = clipping.mode == clippingModeIntersection ? clipping.numPlanes > 0U : true;\r\n    for(lowp uint i = 0U; i < clipping.numPlanes; i++) {\r\n        inside = inside && dot(vec4(varyings.positionVS, 1), clipping.planes[i]) * s < 0.f;\r\n    }\r\n    if(clipping.mode == clippingModeIntersection ? inside : !inside) {\r\n        discard;\r\n    }\r\n#endif\r\n\r\n    mediump vec4 baseColor;\r\n    highp uint objectId;\r\n    lowp uint highlight;\r\n    baseColor = varyingsFlat.color;\r\n#if defined (ADRENO600)\r\n    objectId = combineMediumP(varyingsFlat.objectId_high, varyingsFlat.objectId_low);\r\n#else\r\n    objectId = varyingsFlat.objectId;\r\n#endif\r\n\r\n    highlight = varyingsFlat.highlight;\r\n\r\n    mediump vec3 normalVS = normalize(varyings.normalVS);\r\n    // compute geometric/flat normal from derivatives\r\n    highp vec3 axisX = dFdx(varyings.positionVS); // adreno GPU doesn't like this to be mediump, for some reason, so we use highp instead\r\n    highp vec3 axisY = dFdy(varyings.positionVS); // ditto\r\n    mediump vec3 geometricNormalVS = normalize(cross(axisX, axisY));\r\n\r\n    // ensure that vertex normal points in same direction as geometric normal (which always faces camera)\r\n    if(dot(normalVS, normalVS) < 0.1f || dot(normalVS, geometricNormalVS) < 0.f) {\r\n        normalVS = geometricNormalVS;\r\n    }\r\n    mediump vec3 normalWS = normalize(camera.viewLocalMatrixNormal * normalVS);\r\n    mediump vec3 geometricNormalWS = normalize(camera.viewLocalMatrixNormal * geometricNormalVS);\r\n\r\n    mediump vec4 rgba = vec4(0);\r\n#if (MODE == MODE_POINTS)\r\n    rgba = baseColor;\r\n#elif (MODE == MODE_TERRAIN)\r\n    rgba = baseColor = getGradientColor(textures.gradients, varyings.elevation, elevationV, scene.elevationRange); //Modify base color to get \r\n#elif (MODE == MODE_TRIANGLES)\r\n    if(baseColor == vec4(0)) {\r\n        rgba = texture(textures.base_color, varyings.texCoord0);\r\n    } else {\r\n        rgba = baseColor;\r\n    }\r\n#endif\r\n\r\n#if defined (HIGHLIGHT)\r\n    if(highlight == 254U) {\r\n        discard;\r\n    }\r\n    if(highlight != 0U || scene.applyDefaultHighlight) {\r\n        mediump float u = (float(highlight) + 0.5f) / float(maxHighlights);\r\n        mediump mat4 colorTransform;\r\n        colorTransform[0] = texture(textures.highlights, vec2(u, 0.5f / 6.0f));\r\n        colorTransform[1] = texture(textures.highlights, vec2(u, 1.5f / 6.0f));\r\n        colorTransform[2] = texture(textures.highlights, vec2(u, 2.5f / 6.0f));\r\n        colorTransform[3] = texture(textures.highlights, vec2(u, 3.5f / 6.0f));\r\n        mediump vec4 colorTranslation = texture(textures.highlights, vec2(u, 4.5f / 6.0f));\r\n        rgba = colorTransform * rgba + colorTranslation;\r\n    }\r\n#endif\r\n\r\n#if (PASS != PASS_PICK && MODE != MODE_POINTS)\r\n    if(baseColor != vec4(0)) {\r\n        mediump vec4 diffuseOpacity = rgba;\r\n        diffuseOpacity.rgb = sRGBToLinear(diffuseOpacity.rgb);\r\n\r\n        mediump vec4 specularShininess = vec4(mix(0.4f, 0.1f, baseColor.a)); // TODO: get from varyings instead\r\n        specularShininess.rgb = sRGBToLinear(specularShininess.rgb);\r\n\r\n        mediump vec3 V = camera.viewLocalMatrixNormal * normalize(varyings.positionVS);\r\n        mediump vec3 N = normalize(normalWS);\r\n\r\n        mediump vec3 irradiance = texture(textures.ibl.diffuse, N).rgb;\r\n        mediump float perceptualRoughness = clamp((1.0f - specularShininess.a), 0.0f, 1.0f);\r\n        perceptualRoughness *= perceptualRoughness;\r\n        mediump float lod = perceptualRoughness * (scene.iblMipCount - 1.0f);\r\n        mediump vec3 reflection = textureLod(textures.ibl.specular, reflect(V, N), lod).rgb;\r\n\r\n        mediump vec3 rgb = diffuseOpacity.rgb * irradiance + specularShininess.rgb * reflection;\r\n        rgba = vec4(rgb, rgba.a);\r\n    }\r\n\r\n#endif\r\n\r\n#if (PASS == PASS_PICK)\r\n#if defined (IOS_INTERPOLATION_BUG)\r\n    float a = round(rgba.a * 256.f) / 256.f; // older ipad/IOS devices don't use flat mode on float varyings and thus introduces interpolation noise that we need to round off.\r\n#else\r\n    float a = rgba.a;\r\n#endif\r\n    if(a < scene.pickOpacityThreshold)\r\n        discard;\r\n#endif\r\n\r\n    // we put discards here (late) to avoid problems with derivative functions\r\n#if (MODE == MODE_POINTS)\r\n    if(distance(gl_FragCoord.xy, varyings.screenPos) > varyings.radius)\r\n        discard;\r\n#endif\r\n\r\n#if (PASS == PASS_PRE)\r\n    if(rgba.a < 1.f)\r\n        discard;\r\n#elif (PASS != PASS_PICK)\r\n    if(rgba.a <= 0.f)\r\n        discard;\r\n#endif\r\n\r\n#if defined (DITHER) && (PASS == PASS_COLOR)\r\n    if((rgba.a - 0.5f / 16.0f) < dither(gl_FragCoord.xy))\r\n        discard;\r\n#endif\r\n\r\n#if (PASS != PASS_PICK)\r\n    fragColor = rgba;\r\n#else\r\n#if defined (ADRENO600)\r\n    fragPick = uvec4(objectId, 0u, 0u, floatBitsToUint(linearDepth));\r\n#else\r\n    fragPick = uvec4(objectId, packNormalAndDeviation(geometricNormalWS, varyings.deviation), floatBitsToUint(linearDepth));\r\n#endif\r\n#endif\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/octree/shaders/line.vert
var line_default3 = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Clipping {\r\n    ClippingUniforms clipping;\r\n};\r\n\r\nlayout(std140) uniform Outline {\r\n    OutlineUniforms outline;\r\n};\r\n\r\nlayout(std140) uniform Node {\r\n    NodeUniforms node;\r\n};\r\n\r\nlayout(location = 0) in vec4 vertexPositions;\r\nlayout(location = 1) in mediump vec4 color;\r\nlayout(location = 2) in uint vertexObjectId;\r\n\r\nout struct {\r\n    highp vec3 positionVS;\r\n    mediump vec4 color;\r\n} varyings;\r\n\r\n#if defined (ADRENO600)\r\nflat out struct {\r\n    mediump uint objectId_low;\r\n    mediump uint objectId_high;\r\n} varyingsFlat;\r\n#else\r\nflat out struct {\r\n    highp uint objectId;\r\n} varyingsFlat;\r\n#endif\r\n\r\nvoid main() {\r\n    vec2 pos = gl_VertexID % 2 == 0 ? vertexPositions.xy : vertexPositions.zw;\r\n    vec3 posVS = (camera.localViewMatrix * outline.planeLocalMatrix * vec4(pos, 0, 1)).xyz;\r\n    varyings.positionVS = posVS;\r\n    varyings.color = color;\r\n#if defined (ADRENO600)\r\n    varyingsFlat.objectId_high = vertexObjectId >> 16u;\r\n    varyingsFlat.objectId_low = vertexObjectId & 0xffffu;\r\n#else\r\n    varyingsFlat.objectId = vertexObjectId;\r\n#endif\r\n    gl_Position = camera.viewClipMatrix * vec4(posVS, 1);\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/octree/shaders/line.frag
var line_default4 = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Clipping {\r\n    ClippingUniforms clipping;\r\n};\r\n\r\nlayout(std140) uniform Outline {\r\n    OutlineUniforms outline;\r\n};\r\n\r\nlayout(std140) uniform Node {\r\n    NodeUniforms node;\r\n};\r\n\r\nin struct {\r\n    highp vec3 positionVS;\r\n    mediump vec4 color;\r\n} varyings;\r\n\r\nflat in struct {\r\n#if defined (ADRENO600)\r\n    mediump uint objectId_low;\r\n    mediump uint objectId_high;\r\n#else\r\n    highp uint objectId;\r\n#endif\r\n} varyingsFlat;\r\n\r\nlayout(location = 0) out mediump vec4 fragColor;\r\nlayout(location = 1) out highp uvec4 fragPick;\r\n\r\nvoid main() {\r\n    lowp float s = clipping.mode == clippingModeIntersection ? -1.f : 1.f;\r\n    bool inside = clipping.mode == clippingModeIntersection ? (clipping.numPlanes + (outline.planeIndex >= 0 ? 1u : 0u)) > 0U : true;\r\n    for(lowp uint i = 0u; i < clipping.numPlanes; i++) {\r\n        if(int(i) == outline.planeIndex) {\r\n            inside = inside && clipping.mode != clippingModeIntersection;\r\n        } else {\r\n            inside = inside && dot(vec4(varyings.positionVS, 1), clipping.planes[i]) * s < 0.f;\r\n        }\r\n    }\r\n    if(clipping.mode == clippingModeIntersection ? inside : !inside) {\r\n        discard;\r\n    }\r\n\r\n    fragColor = varyings.color;\r\n    float linearDepth = -varyings.positionVS.z;\r\n#if defined (ADRENO600)\r\n    highp uint objectId = combineMediumP(varyingsFlat.objectId_high, varyingsFlat.objectId_low) | (1u << 31);\r\n    fragPick = uvec4(objectId, 0, 0, floatBitsToUint(linearDepth));\r\n#else\r\n    uint lineObjectId = varyingsFlat.objectId | (1u << 31);\r\n    fragPick = uvec4(lineObjectId, packNormalAndDeviation(vec3(0), 0.f), floatBitsToUint(linearDepth));\r\n#endif\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/octree/shaders/intersect.vert
var intersect_default2 = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Clipping {\r\n    ClippingUniforms clipping;\r\n};\r\n\r\nlayout(std140) uniform Outline {\r\n    OutlineUniforms outline;\r\n};\r\n\r\nlayout(std140) uniform Node {\r\n    NodeUniforms node;\r\n};\r\n\r\nvec2 intersectEdge(vec3 p0, vec3 p1) {\r\n    float t = -p0.z / (p1.z - p0.z);\r\n    return mix(p0.xy, p1.xy, t);\r\n}\r\nuniform OctreeTextures textures;\r\n\r\nlayout(location = 0) in vec4 vertexPos0;\r\nlayout(location = 1) in vec4 vertexPos1;\r\nlayout(location = 2) in vec4 vertexPos2;\r\nlayout(location = 3) in uint vertexObjectId;\r\nlayout(location = 4) in uint vertexHighlight;\r\nflat out vec4 line_vertices;\r\nflat out mediump vec4 color;\r\nflat out uint object_id;\r\n\r\nvoid main() {\r\n    vec3 pos0 = (outline.localPlaneMatrix * node.modelLocalMatrix * vertexPos0).xyz;\r\n    vec3 pos1 = (outline.localPlaneMatrix * node.modelLocalMatrix * vertexPos1).xyz;\r\n    vec3 pos2 = (outline.localPlaneMatrix * node.modelLocalMatrix * vertexPos2).xyz;\r\n    vec3 ab = pos1 - pos0;\r\n    vec3 ac = pos2 - pos0;\r\n    mediump vec3 normal = normalize(cross(ab, ac));\r\n    vec3 z = vec3(pos0.z, pos1.z, pos2.z);\r\n    bvec3 gt = greaterThan(z, vec3(0));\r\n    bvec3 lt = lessThan(z, vec3(0));\r\n    int i = 0;\r\n    vec2 line[3];\r\n    // does triangle straddle clipping plane?\r\n    if(any(gt) && any(lt) && vertexHighlight < 0xfeU) {\r\n        // find intersecting edges\r\n        if(any(gt.xy) && any(lt.xy)) {\r\n            line[i++] = intersectEdge(pos0, pos1);\r\n        }\r\n        if(any(gt.yz) && any(lt.yz)) {\r\n            line[i++] = intersectEdge(pos1, pos2);\r\n        }\r\n        if(any(gt.zx) && any(lt.zx)) {\r\n            line[i++] = intersectEdge(pos2, pos0);\r\n        }\r\n    }\r\n    if(i == 2) {\r\n        line_vertices = vec4(line[0], line[1]);\r\n    } else {\r\n        line_vertices = vec4(0);\r\n    }\r\n\r\n    vec3 rgb = outline.color;\r\n\r\n    if(vertexHighlight != 0U) {\r\n        float u = (float(vertexHighlight) + 0.5f) / float(maxHighlights);\r\n        vec4 colorTranslation = texture(textures.highlights, vec2(u, 5.5f / 6.0f));\r\n        if(colorTranslation.a == 1.f) {\r\n            rgb = colorTranslation.rgb;\r\n        }\r\n    }\r\n\r\n    color = vec4(rgb, 1.f - abs(normal.z));\r\n    object_id = vertexObjectId;\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/octree/shaders/debug.vert
var debug_default = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Clipping {\r\n    ClippingUniforms clipping;\r\n};\r\n\r\nlayout(std140) uniform Scene {\r\n    SceneUniforms scene;\r\n};\r\n\r\nlayout(std140) uniform Node {\r\n    NodeUniforms node;\r\n};\r\n\r\nuniform OctreeTextures textures;\r\n\r\nstruct VaryingsFlat {\r\n    vec4 color;\r\n};\r\nflat out VaryingsFlat varyingsFlat;\r\n\r\nconst lowp int ccwIndices[12] = int[12](0, 1, 2, 0, 2, 3, 0, 3, 1, 1, 3, 2);\r\nconst lowp int cwIndices[12] = int[12](0, 2, 1, 0, 3, 2, 0, 1, 3, 1, 2, 3);\r\nconst lowp vec3 corners[8] = vec3[8](vec3(-1, -1, -1), vec3(-1, 1, 1), vec3(1, -1, 1), vec3(1, 1, -1), vec3(-1, -1, 1), vec3(-1, 1, -1), vec3(1, -1, -1), vec3(1, 1, 1));\r\n\r\nvoid main() {\r\n    lowp vec3 corner = corners[gl_VertexID / 12];\r\n    highp vec3 pos = corner;\r\n    pos = (pos + 1.f) / 2.f;\r\n    pos = mix(node.min, node.max, pos);\r\n    lowp int idx = (gl_VertexID / 12) < 4 ? cwIndices[gl_VertexID % 12] : ccwIndices[gl_VertexID % 12];\r\n    varyingsFlat.color = node.debugColor;\r\n    if(idx > 0) {\r\n        vec3 extents = abs(node.max - node.min);\r\n        float minExtent = min(extents[0], min(extents[1], extents[2]));\r\n        pos[idx - 1] -= corner[idx - 1] * minExtent * .1f;\r\n        varyingsFlat.color.rgb *= 0.75f;\r\n    }\r\n    vec4 posVS = camera.localViewMatrix * vec4(pos, 1);\r\n    gl_Position = camera.viewClipMatrix * posVS;\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/octree/shaders/debug.frag
var debug_default2 = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\nlayout(std140) uniform Clipping {\r\n    ClippingUniforms clipping;\r\n};\r\n\r\nlayout(std140) uniform Scene {\r\n    SceneUniforms scene;\r\n};\r\n\r\nlayout(std140) uniform Node {\r\n    NodeUniforms node;\r\n};\r\n\r\nuniform OctreeTextures textures;\r\n\r\nstruct VaryingsFlat {\r\n    vec4 color;\r\n};\r\nflat in VaryingsFlat varyingsFlat;\r\n\r\nlayout(location = 0) out mediump vec4 color;\r\n\r\nvoid main() {\r\n    color = varyingsFlat.color;\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/octree/shaders/index.ts
var shaders7 = {
  render: {
    vertexShader: render_default3,
    fragmentShader: render_default4
  },
  line: {
    vertexShader: line_default3,
    fragmentShader: line_default4
  },
  intersect: {
    vertexShader: intersect_default2
  },
  debug: {
    vertexShader: debug_default,
    fragmentShader: debug_default2
  }
};
var shaders_default6 = shaders7;

// /projects/Novorender/ts/dist/core3d/modules/tonemap/shaders/shader.vert
var shader_default9 = "layout(std140) uniform Tonemapping {\r\n    TonemappingUniforms tonemapping;\r\n};\r\n\r\nuniform TonemappingTextures textures;\r\n\r\nout TonemappingVaryings varyings;\r\n\r\nvoid main() {\r\n    varyings.uv = vec2(gl_VertexID % 2, gl_VertexID / 2);\r\n    gl_Position = vec4(varyings.uv * 2.0 - 1.0, 0, 1);\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/tonemap/shaders/shader.frag
var shader_default10 = "layout(std140) uniform Tonemapping {\r\n    TonemappingUniforms tonemapping;\r\n};\r\n\r\nuniform TonemappingTextures textures;\r\n\r\nin TonemappingVaryings varyings;\r\n\r\nlayout(location = 0) out lowp vec4 fragColor;\r\n\r\nuint hash(uint x) {\r\n    x += (x << 10u);\r\n    x ^= (x >> 6u);\r\n    x += (x << 3u);\r\n    x ^= (x >> 11u);\r\n    x += (x << 15u);\r\n    return x;\r\n}\r\n\r\n// ACES tone map (faster approximation)\r\n// see: https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/\r\nmediump vec3 toneMapACES_Narkowicz(mediump vec3 color) {\r\n    const mediump float A = 2.51f;\r\n    const mediump float B = 0.03f;\r\n    const mediump float C = 2.43f;\r\n    const mediump float D = 0.59f;\r\n    const mediump float E = 0.14f;\r\n    return clamp((color * (A * color + B)) / (color * (C * color + D) + E), 0.0f, 1.0f);\r\n}\r\n\r\n// ACES filmic tone map approximation\r\n// see https://github.com/TheRealMJP/BakingLab/blob/master/BakingLab/ACES.hlsl\r\nmediump vec3 RRTAndODTFit(mediump vec3 color) {\r\n    mediump vec3 a = color * (color + 0.0245786f) - 0.000090537f;\r\n    mediump vec3 b = color * (0.983729f * color + 0.4329510f) + 0.238081f;\r\n    return a / b;\r\n}\r\n\r\nvoid main() {\r\n    mediump vec4 color = vec4(1, 0, 0, 1);\r\n    switch(tonemapping.mode) {\r\n        case tonemapModeColor: {\r\n            color = texture(textures.color, varyings.uv);\r\n            color.rgb = RRTAndODTFit(color.rgb * tonemapping.exposure);\r\n            color.rgb = linearTosRGB(color.rgb);\r\n            break;\r\n        }\r\n        case tonemapModeNormal: {\r\n            vec3 xyz = unpackNormalAndDeviation(texture(textures.pick, varyings.uv).yz).xyz;\r\n            if(any(isnan(xyz))) {\r\n                color.rgb = vec3(0);\r\n            } else {\r\n                color.rgb = xyz * .5f + .5f;\r\n            }\r\n            break;\r\n        }\r\n        case tonemapModeDepth: {\r\n            float linearDepth = uintBitsToFloat(texture(textures.pick, varyings.uv).w);\r\n            if(isinf(linearDepth)) {\r\n                color.rgb = vec3(0, 0, 0.25f);\r\n            } else {\r\n                float i = (linearDepth / tonemapping.maxLinearDepth);\r\n                color.rgb = vec3(pow(i, 0.5f));\r\n            }\r\n            break;\r\n        }\r\n        case tonemapModeObjectId: {\r\n            uint objectId = texture(textures.pick, varyings.uv).x;\r\n            if(objectId == 0xffffffffU) {\r\n                color.rgb = vec3(0);\r\n            } else {\r\n                // color.rgb = vec3(0,1,1);\r\n                uint rgba = hash(~objectId);\r\n                float r = float((rgba >> 16U) & 0xffU) / 255.f;\r\n                float g = float((rgba >> 8U) & 0xffU) / 255.f;\r\n                float b = float((rgba >> 0U) & 0xffU) / 255.f;\r\n                color.rgb = vec3(r, g, b);\r\n            }\r\n            break;\r\n        }\r\n        case tonemapModeDeviation: {\r\n            float deviation = unpackNormalAndDeviation(texture(textures.pick, varyings.uv).yz).w;\r\n            color.rgb = deviation > 0.f ? vec3(0, deviation / tonemapMaxDeviation, 0) : vec3(-deviation / tonemapMaxDeviation, 0, 0);\r\n            break;\r\n        }\r\n        case tonemapModeZbuffer: {\r\n            float z = texture(textures.zbuffer, varyings.uv).x;\r\n            color.rgb = vec3(z);\r\n            break;\r\n        }\r\n    }\r\n    fragColor = color;\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/tonemap/shaders/index.ts
var shaders8 = {
  render: {
    vertexShader: shader_default9,
    fragmentShader: shader_default10
  }
};
var shaders_default7 = shaders8;

// /projects/Novorender/ts/dist/core3d/modules/toon_outline/shaders/shader.vert
var shader_default11 = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\n// layout(std140) uniform ToonOutline {\r\n//     ToonOutlineUniforms toonOutline;\r\n// };\r\n\r\nout highp vec2 uv;\r\n\r\nvoid main() {\r\n    uv = vec2(gl_VertexID % 2, gl_VertexID / 2);\r\n    gl_Position = vec4(uv * 2.0f - 1.0f, 0, 1);\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/toon_outline/shaders/shader.frag
var shader_default12 = "layout(std140) uniform Camera {\r\n    CameraUniforms camera;\r\n};\r\n\r\n// layout(std140) uniform ToonOutline {\r\n//     ToonOutlineUniforms toonOutline;\r\n// };\r\n\r\nuniform TonemappingTextures textures;\r\n\r\nin highp vec2 uv;\r\nlayout(location = 0) out mediump vec4 fragColor;\r\n\r\nconst mediump float horizontalSobel[5 * 5] = float[]( //\r\n1.f, 1.f, 2.f, 1.f, 1.f, // \r\n2.f, 2.f, 4.f, 2.f, 2.f, //\r\n0.f, 0.f, 0.f, 0.f, 0.f, //\r\n-2.f, -2.f, -4.f, -2.f, -2.f, //\r\n-1.f, -1.f, -2.f, -1.f, -1.f);\r\n\r\nconst mediump float verticalSobel[5 * 5] = float[]( //\r\n1.f, 2.f, 0.f, -2.f, -1.f, //\r\n1.f, 2.f, 0.f, -2.f, -1.f, //\r\n2.f, 4.f, 0.f, -4.f, -2.f, //\r\n1.f, 2.f, 0.f, -2.f, -1.f, //\r\n1.f, 2.f, 0.f, -2.f, -1.f);\r\n\r\nbool objectTest(uint objectId, vec2 bl, vec2 tr, vec2 br, vec2 tl) {\r\n    uint obj0 = texture(textures.pick, bl).x;\r\n    if(obj0 != objectId) {\r\n        return true;\r\n    }\r\n    uint obj1 = texture(textures.pick, tr).x;\r\n    if(obj1 != objectId) {\r\n        return true;\r\n    }\r\n    uint obj2 = texture(textures.pick, br).x;\r\n    if(obj2 != objectId) {\r\n        return true;\r\n    }\r\n    uint obj3 = texture(textures.pick, tl).x;\r\n    if(obj3 != objectId) {\r\n        return true;\r\n    }\r\n    return false;\r\n}\r\n\r\nfloat getPixelOffset(int index, float pixelSize) {\r\n    return float(index - 2) * pixelSize;\r\n}\r\n\r\nvec2 getUvCoord(int i, int j, vec2 uv, float pixelSizeX, float pixelSizeY) {\r\n    return uv + vec2(getPixelOffset(i, pixelSizeX), getPixelOffset(j, pixelSizeY));\r\n}\r\n\r\nfloat depthTest2(float centerDepth, vec2 uv, float pixelSizeX, float pixelSizeY) {\r\n    const float threshold = 0.02f;\r\n    float horizontal = 0.f;\r\n    float vertical = 0.f;\r\n    for(int i = 0; i < 5; ++i) {\r\n        for(int j = 0; j < 5; ++j) {\r\n            int idx = i * 5 + j;\r\n            if(idx == 12) {\r\n                continue;\r\n            }\r\n            vec2 uvCoord = getUvCoord(i, j, uv, pixelSizeX, pixelSizeY);\r\n            if(uvCoord.x < 0.f || uvCoord.y < 0.f) {\r\n                return 0.f;\r\n            }\r\n            float sobelFactorH = horizontalSobel[idx];\r\n            float sobelFactorV = verticalSobel[idx];\r\n            float val = abs(centerDepth - uintBitsToFloat(texture(textures.pick, uvCoord).w)) / centerDepth > threshold ? 1.f : 0.f;\r\n            horizontal += sobelFactorH * val;\r\n            vertical += sobelFactorV * val;\r\n        }\r\n    }\r\n    return sqrt(pow(horizontal, 2.f) + pow(vertical, 2.f)) / 35.f; // use 25 instead of 35?\r\n}\r\n\r\nfloat normalTest2(vec3 centerNormal, vec2 uv, float pixelSizeX, float pixelSizeY) {\r\n    const float threshold = 0.05f;\r\n    float horizontal = 0.f;\r\n    float vertical = 0.f;\r\n    for(int i = 0; i < 5; ++i) {\r\n        for(int j = 0; j < 5; ++j) {\r\n            int idx = i * 5 + j;\r\n            if(idx == 12) {\r\n                continue;\r\n            }\r\n            vec2 uvCoord = getUvCoord(i, j, uv, pixelSizeX, pixelSizeY);\r\n            if(uvCoord.x < 0.f || uvCoord.y < 0.f) {\r\n                return 0.f;\r\n            }\r\n            float sobelFactorH = horizontalSobel[idx];\r\n            float sobelFactorV = verticalSobel[idx];\r\n            float val = dot(centerNormal, unpackNormalAndDeviation(texture(textures.pick, uvCoord).yz).xyz) < threshold ? 1.f : 0.f;\r\n            horizontal += sobelFactorH * val;\r\n            vertical += sobelFactorV * val;\r\n        }\r\n    }\r\n\r\n    return sqrt(pow(horizontal, 2.f) + pow(vertical, 2.f)) / 25.f;\r\n}\r\n\r\nvoid main() {\r\n    float pixelSizeX = 1.f / camera.viewSize.x;\r\n    float pixelSizeY = 1.f / camera.viewSize.y;\r\n\r\n    //uint objectId = texture(textures.pick, uv).x;\r\n    float centerDepth = uintBitsToFloat(texture(textures.pick, uv).w);\r\n    vec3 centerNormal = unpackNormalAndDeviation(texture(textures.pick, uv).yz).xyz;\r\n\r\n    float normalEdge = 0.f;\r\n    float depthEdge = depthTest2(centerDepth, uv, pixelSizeX, pixelSizeY);\r\n    if(depthEdge < 0.8f) {\r\n        normalEdge = normalTest2(centerNormal, uv, pixelSizeX, pixelSizeY);\r\n    }\r\n    float edge = min(0.8f, max(depthEdge, normalEdge));\r\n\r\n    if(edge < 0.3f) {\r\n        discard;\r\n    }\r\n    fragColor = vec4(0, 0, 0, 1) * edge;\r\n    //fragColor = vec4(toonOutline.color, 1) * edge;\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/toon_outline/shaders/index.ts
var shaders9 = {
  render: {
    vertexShader: shader_default11,
    fragmentShader: shader_default12
  }
};
var shaders_default8 = shaders9;

// /projects/Novorender/ts/dist/core3d/modules/watermark/shaders/shader.vert
var shader_default13 = "layout(std140) uniform Watermark {\r\n    WatermarkUniforms watermark;\r\n};\r\n\r\nout WatermarkVaryings varyings;\r\n\r\nlayout(location = 0) in vec3 vertexPosition;\r\n\r\nvoid main() {\r\n    vec4 p = watermark.modelClipMatrix * vec4(vertexPosition, 1.0);\r\n    varyings.elevation = p.z;\r\n    gl_Position = vec4(p.xy, 0.0, 1.0);\r\n}\r\n";

// /projects/Novorender/ts/dist/core3d/modules/watermark/shaders/shader.frag
var shader_default14 = "layout(std140) uniform Watermark {\r\n    WatermarkUniforms watermark;\r\n};\r\n\r\nin WatermarkVaryings varyings;\r\n\r\nlayout(location = 0) out mediump vec4 fragColor;\r\n\r\nvoid main() {\r\n    float a = clamp(varyings.elevation, 0.0f, 1.0f);\r\n    fragColor = vec4(watermark.color.rgb, a);\r\n}";

// /projects/Novorender/ts/dist/core3d/modules/watermark/shaders/index.ts
var shaders10 = {
  render: {
    vertexShader: shader_default13,
    fragmentShader: shader_default14
  }
};
var shaders_default9 = shaders10;

// /projects/Novorender/ts/dist/core3d/modules/shaders.ts
var moduleShaders = {
  background: shaders_default,
  clipping: shaders_default2,
  cube: shaders_default3,
  dynamic: shaders_default4,
  grid: shaders_default5,
  octree: shaders_default6,
  tonemap: shaders_default7,
  toon: shaders_default8,
  watermark: shaders_default9
};

// /projects/Novorender/ts/dist/core3d/shaders.ts
var shaders11 = {
  common: common_default,
  benchmark: shaders,
  ...moduleShaders
};
export {
  shaders11 as shaders
};
//# sourceMappingURL=shaders.js.map
