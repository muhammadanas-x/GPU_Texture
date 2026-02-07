// =======================================================================
// Constants
// =======================================================================

static const float c_pi = 3.14159265359f;
static const float c_twopi = 2.0f * c_pi;
static const float KEY_SPACE = 32.5/256.0;

// =======================================================================
// Parameters
// =======================================================================

// camera parameters
//static const float3 c_cameraAt = float3(0.0f, 0.0f, 0.0f);
//static const float c_cameraDistance = 80.0f;
//static const float c_apertureRadius = 0.4f;  // in world units. 0 for pinhole camera.
//static const float c_focalPlaneDistance = 80.0f; // in world units. How far from the camera things are in focus at.
//static const float c_minCameraAngle = c_pi / 2.0f - 0.125f;
//static const float c_maxCameraAngle = (c_pi - 0.01f);
//static const float c_exposure = 2.0f;  // +1 fstops of exposure
//static const float c_FOV = 90.0f; // in degrees

// the place to put the mouse if it hasn't moved yet (aka the default view)
//static const float2 c_defaultMousePos = float2(140.0f / 800.0f, 40.0f / 450.0f);  // viewing the dark sun
//const float2 c_defaultMousePos = float2(300.0f / 800.0f, 30.0f / 450.0f);  // viewing saturn

// bloom parameters
static const float3 c_bloomMin = float3(1.0f, 1.0f, 1.0f);
// The array below is a 1d gaussian which starts at index 0.
// A nice gaussian calculator is at http://dev.theomader.com/gaussian-kernel-calculator/
// Just calculate a kernel that is (c_radius * 2 + 1) large and use the second half of the result (including the center).
// That should give you an array that is (c_radius+1) items large.
//const int c_bloomRadius = 3;
//const float c_bloomKernel[c_bloomRadius+1] = float[c_bloomRadius+1](0.383103, 0.241843, 0.060626, 0.00598); // sigma 1.0
static const int c_bloomRadius = 5;
//const float c_bloomKernel[c_bloomRadius+1] = float[c_bloomRadius+1](0.382925, 0.24173, 0.060598, 0.005977, 0.000229, 0.000003); // sigma 1.0
static const float c_bloomKernel[c_bloomRadius+1] = {0.163053, 0.150677, 0.118904, 0.080127, 0.046108, 0.022657}; // sigma 2.5
//const float c_bloomKernel[c_bloomRadius+1] = float[c_bloomRadius+1](0.109317, 0.107159, 0.100939, 0.091364, 0.079465, 0.066414); // sigma 5.0    

// scene parameters
//static const float c_skyboxMultiplier = 0.0f; // for the cube map, if visible.

// ray tracing parameters
//static const int c_numBounces = 4;
static const float c_minimumRayHitTime = 0.1f;
static const float c_superFar = 10000.0f;

// ray marching parameters
//static const int c_numSteps = 256;
//static const float c_minStepDistance = 0.1f;

// other parameters
static const float c_rayPosNormalNudge = 0.01f; // after a hit, it moves the ray this far along the normal away from a surface

// =======================================================================
// Display Adaptation Functions
// =======================================================================


// ACES tone mapping curve fit to go from HDR to LDR
//https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/
float3 ACESFilm(float3 x)
{
    float a = 2.51f;
    float b = 0.03f;
    float c = 2.43f;
    float d = 0.59f;
    float e = 0.14f;
    return clamp((x*(a*x + b)) / (x*(c*x + d) + e), 0.0f, 1.0f);
}

// =======================================================================
// Bloom Functions
// =======================================================================

float3 BloomPass1(in float2 pixelPos, in Texture2D<float4> linearImage)
{
    // horizontal & conditional
    float3 sum = float3(0.0f, 0.0f, 0.0f);
    for (int ix = -c_bloomRadius; ix <= c_bloomRadius; ++ix)
    {
        float3 pixelColor = linearImage[pixelPos + float2(ix, 0)].rgb;
        float3 bloomColor = clamp(pixelColor - c_bloomMin, 0.0f, 1.0f);
        
        bloomColor = (dot(bloomColor, c_bloomMin) > 0.0f ? bloomColor : float3(0.0f, 0.0f, 0.0f));

        float weight = c_bloomKernel[abs(ix)];
        sum += bloomColor * weight;
    }
    
    return sum;
}

float3 BloomPass2(in float2 pixelPos, in Texture2D<float4> bloomImage)
{
    // vertical
    float3 sum = float3(0.0f, 0.0f, 0.0f);
    for (int iy = -c_bloomRadius; iy <= c_bloomRadius; ++iy)
    {
        float3 bloomColor = bloomImage[pixelPos + float2(0, iy)].rgb;
        float weight = c_bloomKernel[abs(iy)];
        sum += bloomColor * weight;
    }
    
    return sum;
}

// =======================================================================
// RNG Functions
// =======================================================================

// from "Hash without Sine" https://www.shadertoy.com/view/4djSRW
float hash11(float p)
{
    p = frac(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return frac(p);
}
float hash12(float2 p)
{
	float3 p3  = frac(float3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return frac((p3.x + p3.y) * p3.z);
}
float2 hash22(float2 p)
{
	float3 p3 = frac(float3(p.xyx) * float3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx+33.33);
    return frac((p3.xx+p3.yz)*p3.zy);

}

uint wang_hash(inout uint seed)
{
    seed = uint(seed ^ uint(61)) ^ uint(seed >> uint(16));
    seed *= uint(9);
    seed = seed ^ (seed >> 4);
    seed *= uint(0x27d4eb2d);
    seed = seed ^ (seed >> 15);
    return seed;
}

float RandomFloat01(inout uint state)
{
    return float(wang_hash(state)) / 4294967296.0;
}

float3 RandomUnitVector(inout uint state)
{
    float z = RandomFloat01(state) * 2.0f - 1.0f;
    float a = RandomFloat01(state) * c_twopi;
    float r = sqrt(1.0f - z * z);
    float x = r * cos(a);
    float y = r * sin(a);
    return float3(x, y, z);
}

// =======================================================================
// Misc Functions
// =======================================================================

float MaxComp(float3 v)
{
    return max(v.x, max(v.y, v.z));
}

int MaxCompIndex(float3 v)
{
    if (v.x > v.y)
    {
        if (v.x > v.z)
            return 0;
        else
            return 2;
    }
    else
    {
        if (v.y > v.z)
            return 1;
        else
            return 2;
    }
}

float Bias(float x, float bias)
{
  return (x / ((((1.0f/bias) - 2.0f)*(1.0f - x))+1.0f));
}

float dot2(in float3 v ) { return dot(v,v); }

// =======================================================================
// Distance Functions 2D
// https://iquilezles.org/articles/distfunctions2d
// =======================================================================

float sdEquilateralTriangle( in float2 p )
{
    const float k = sqrt(3.0);
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if( p.x+k*p.y>0.0 ) p = float2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0, 0.0 );
    return -length(p)*sign(p.y);
}

float sdRoundedX( in float2 p, in float w, in float r )
{
    p = abs(p);
    return length(p-min(p.x+p.y,w)*0.5) - r;
}

float mod(float x, float y)
{
	return x - y * floor(x/y);
}

float sdStar(in float2 p, in float r, in int n, in float m)
{
    // next 4 lines can be precomputed for a given shape
    float an = 3.141593/float(n);
    float en = 3.141593/m;  // m is between 2 and n
    float2  acs = float2(cos(an),sin(an));
    float2  ecs = float2(cos(en),sin(en)); // ecs=float2(0,1) for regular polygon,

    float bn = mod(atan2(p.x,p.y),2.0*an) - an;
    p = length(p)*float2(cos(bn),abs(sin(bn)));
    p -= r*acs;
    p += ecs*clamp( -dot(p,ecs), 0.0, r*acs.y/ecs.y);
    return length(p)*sign(p.x);
}

float sdCircle( float2 p, float r )
{
  return length(p) - r;
}

// =======================================================================
// Distance Functions 3D
// https://iquilezles.org/articles/distfunctions
// =======================================================================

float SphereDistance(in float4 sphere, in float3 p)
{
    return length(p - sphere.xyz) - sphere.w;
}

float PlaneDistance(in float4 plane, in float3 p)
{
    return (dot(plane.xyz, p) - plane.w) / dot(plane.xyz, plane.xyz);
}

float BoxDistance(in float3 boxPos, in float3 boxRadius, in float width, in float3 p)
{
    p -= boxPos;
    width = max(width, 0.01f);  // fix for a problem i didn't investigate :P
    
    // from https://www.youtube.com/watch?reload=9&v=62-pRVZuS5c
    // rounding the box from https://www.youtube.com/watch?v=s5NGeUV2EyU
    float3 q = abs(p) - boxRadius;
    return length(max(q,float3(0.0f,0.0f,0.0f))) + min(MaxComp(q), 0.0f) - width;
}

float LineDistance(in float3 A, in float3 B, float width, in float3 p, out float3 normal)
{
	float3 AP = p - A;
    float3 AB = B - A;
    
    // from https://www.youtube.com/watch?v=PMltMdi1Wzg
    // added normal calculation though
    float h = min(1.0f, max(0.0f, dot(AP, AB) / dot(AB, AB)));
    float3 closestPoint = A + h * AB;
    normal = normalize(p - closestPoint);
    return length(p - closestPoint) - width;
}

float BezierDistance( in float3 pos, in float3 A, in float3 B, in float3 C, in float width)
{    
    float3 a = B - A;
    float3 b = A - 2.0*B + C;
    float3 c = a * 2.0;
    float3 d = A - pos;
    float kk = 1.0/dot(b,b);
    float kx = kk * dot(a,b);
    float ky = kk * (2.0*dot(a,a)+dot(d,b)) / 3.0;
    float kz = kk * dot(d,a);      
    float res = 0.0;
    float p = ky - kx*kx;
    float p3 = p*p*p;
    float q = kx*(2.0*kx*kx-3.0*ky) + kz;
    float h = q*q + 4.0*p3;
    if( h >= 0.0) 
    { 
        h = sqrt(h);
        float2 x = (float2(h,-h)-q)/2.0;
        float2 uv = sign(x)*pow(abs(x), 1.0/3.0);
        float t = clamp( uv.x+uv.y-kx, 0.0, 1.0 );
        res = dot2(d + (c + b*t)*t);
    }
    else
    {
        float z = sqrt(-p);
        float v = acos( q/(p*z*2.0) ) / 3.0;
        float m = cos(v);
        float n = sin(v)*1.732050808;
        float3  t = clamp(float3(m+m,-n-m,n-m)*z-kx,0.0,1.0);
        res = min( dot2(d+(c+b*t.x)*t.x),
                   dot2(d+(c+b*t.y)*t.y) );
        // the third root cannot be the closest
        // res = min(res,dot2(d+(c+b*t.z)*t.z));
    }
    return sqrt( res ) - width;
}

// =======================================================================
// Object Intersection Helpers for Ray Marching
// =======================================================================

struct SMaterial
{
    float3 diffuse;
    float3 specular;
	float roughness;
    float3 emissive;    
};

struct SRayHitInfo
{
    bool hitAnObject;
    bool rayMarchedObject;
    float dist;
    float3 normal;
    SMaterial material;
};
    
void TestSphereMarch(in float3 rayPos, inout SRayHitInfo info, in float4 sphere, in SMaterial material)
{
    float dist = SphereDistance(sphere, rayPos);
    if (dist < info.dist)
    {
        info.rayMarchedObject = true;
        info.dist = dist;        
        info.normal = normalize(rayPos - sphere.xyz);
        info.material = material;
    }    
}

void TestPlaneMarch(in float3 rayPos, inout SRayHitInfo info, in float4 plane, in SMaterial material)
{
    float dist = PlaneDistance(plane, rayPos);
    if (dist < info.dist)
    {
        info.rayMarchedObject = true;
        info.dist = dist;        
        info.normal = plane.xyz;
        info.material = material;
    }    
}

void TestBoxMarch(in float3 rayPos, inout SRayHitInfo info, in float3 boxPos, in float3 boxRadius, in float width, in SMaterial material)
{
    float dist = BoxDistance(boxPos, boxRadius, width, rayPos);
    if (dist < info.dist)
    {
        info.rayMarchedObject = true;
        info.dist = dist;
        
        float3 relPos = max(abs(rayPos - boxPos) - boxRadius, 0.0f);
        int maxIndex = MaxCompIndex(relPos);
        if (maxIndex == 0)
        {
            info.normal = (rayPos.x < boxPos.x) ? float3(-1.0f, 0.0f, 0.0f) : float3(1.0f, 0.0f, 0.0f);
        }
        else if(maxIndex == 1)
        {
            info.normal = (rayPos.y < boxPos.y) ? float3(0.0f, -1.0f, 0.0f) : float3(0.0f, 1.0f, 0.0f);
        }
        else
        {
            info.normal = (rayPos.z < boxPos.z) ? float3(0.0f, 0.0f, -1.0f) : float3(0.0f, 0.0f, 1.0f);
        }
        
        info.material = material;
    }    
}

void TestLineMarch(in float3 rayPos, inout SRayHitInfo info, in float3 A, in float3 B, in float width, in SMaterial material)
{   
    float3 normal;
    float dist = LineDistance(A, B, width, rayPos, normal);
    if (dist < info.dist)
    {
        info.rayMarchedObject = true;
        info.dist = dist;        
        info.normal = normal;
        info.material = material;
    }    
}

void TestBezierMarch(in float3 rayPos, inout SRayHitInfo info, in float3 A, in float3 B, in float3 C, in float width, in SMaterial material)
{
    float dist = BezierDistance(rayPos, A, B, C, width);
    if (dist < info.dist)
    {
        info.rayMarchedObject = true;
        info.dist = dist;    
        info.normal = float3(1.0f, 0.0f, 0.0f); // TODO: normal, if you ever need it!
        info.material = material;
    }    
}

// =======================================================================
// Object Intersection Helpers for Ray Tracing
// =======================================================================

bool TestPlaneTrace(in float3 rayPos, in float3 rayDir, inout SRayHitInfo info, in float4 plane, in SMaterial material)
{
    float dist = -1.0f;
    float denom = dot(plane.xyz, rayDir);
    if (abs(denom) > 0.001f)
    {
        dist = (plane.w - dot(plane.xyz, rayPos)) / denom;
    
        if (dist > c_minimumRayHitTime && dist < info.dist)
        {
            info.hitAnObject = true;
            info.rayMarchedObject = false;
            info.dist = dist;        
            info.normal = plane.xyz;
            info.material = material;
            return true;
        }
    }
    return false;
}

bool TestSphereTrace(in float3 rayPos, in float3 rayDir, inout SRayHitInfo info, in float4 sphere, in SMaterial material)
{
	//get the vector from the center of this sphere to where the ray begins.
	float3 m = rayPos - sphere.xyz;

    //get the dot product of the above vector and the ray's vector
	float b = dot(m, rayDir);

	float c = dot(m, m) - sphere.w * sphere.w;

	//exit if r's origin outside s (c > 0) and r pointing away from s (b > 0)
	if(c > 0.0 && b > 0.0)
		return false;

	//calculate discriminant
	float discr = b * b - c;

	//a negative discriminant corresponds to ray missing sphere
	if(discr < 0.0)
		return false;
    
	//ray now found to intersect sphere, compute smallest t value of intersection
    bool fromInside = false;
	float dist = -b - sqrt(discr);
    if (dist < 0.0f)
    {
        fromInside = true;
        dist = -b + sqrt(discr);
    }
    
	if (dist > c_minimumRayHitTime && dist < info.dist)
    {
        info.hitAnObject = true;
        info.rayMarchedObject = false;
        info.dist = dist;        
        info.normal = normalize((rayPos+rayDir*dist) - sphere.xyz) * (fromInside ? -1.0f : 1.0f);
		info.material = material;        
        return true;
    }
    
    return false;
}

// Tests against a vertical cylinder without caps
// Derived from the sphere function and not super optimal but whatever.
bool TestCylinderTrace(in float3 rayPos_, in float3 rayDir_, inout SRayHitInfo info, in float3 pos, in float radius, in float height, in SMaterial material)
{
    float3 relativeRayPos = rayPos_ - pos;
    float3 projectedRayPos = float3(relativeRayPos.x, 0.0f, relativeRayPos.z);
    float3 projectedRayDir = float3(rayDir_.x, 0.0f, rayDir_.z);
    
    float lengthCorrection = length(projectedRayDir);
    projectedRayDir /= lengthCorrection;
    
	//get the vector from the center of this circle to where the ray begins.
	float3 m = projectedRayPos;

    //get the dot product of the above vector and the ray's vector
	float b = dot(m, projectedRayDir);

	float c = dot(m, m) - radius * radius;

	//exit if r's origin outside s (c > 0) and r pointing away from s (b > 0)
	if(c > 0.0 && b > 0.0)
		return false;

	//calculate discriminant
	float discr = b * b - c;

	//a negative discriminant corresponds to ray missing sphere
	if(discr < 0.0)
		return false;
    
	//ray now found to intersect sphere, compute smallest t value of intersection
    bool fromInside = false;
	float dist = -b - sqrt(discr);
    if (dist < 0.0f)
    {
        fromInside = true;
        dist = -b + sqrt(discr);
    }

    // adjust distance
    dist /= lengthCorrection;

    // enforce height - note we may be invalid height for the first distance but not the second.
    float3 relativeHitPos = relativeRayPos + rayDir_ * dist;
    if (relativeHitPos.y < 0.0f || relativeHitPos.y > height)
    {
        dist = -b + sqrt(discr);
        dist /= lengthCorrection;
        relativeHitPos = relativeRayPos + rayDir_ * dist;
        if (relativeHitPos.y < 0.0f || relativeHitPos.y > height)
      		return false;
    }
        
	if (dist > c_minimumRayHitTime && dist < info.dist)
    {
        info.hitAnObject = true;
        info.rayMarchedObject = false;
        info.dist = dist;        
        info.normal = normalize(float3(relativeHitPos.x, 0.0f, relativeHitPos.z)) * (fromInside ? -1.0f : 1.0f);
		info.material = material;        
        return true;
    }
    
    return false;
}

// =======================================================================
// Scene Descriptions - both ray tracing and ray marched objects
// =======================================================================

void RayTraceMountainCylinders(in float3 rayPos, in float3 rayDir, inout SRayHitInfo hitInfo, in float seed, in float radius, in float maxMountainHeight)
{
    SMaterial material;
    material.diffuse = float3(1.0f, 1.0f, 1.0f);
    material.specular = float3(0.0f, 0.0f, 0.0f);
    material.roughness = 0.025f;
    material.emissive = float3(0.0f, 0.0f, 0.0f);

    SRayHitInfo oldHitInfo = hitInfo;

    if (TestCylinderTrace(rayPos, rayDir, hitInfo, float3(0.0f, -15.0f, 0.0f), radius, maxMountainHeight, material))
    {
        float3 hitPos = rayPos + rayDir * hitInfo.dist;
        float azimuthPercent = clamp((atan2(hitPos.z, hitPos.x) + c_pi) / c_twopi, 0.0f, 1.0f);
        float heightPercent = (hitPos.y + 15.0f) / maxMountainHeight;

        float thisHeightIndex = floor(azimuthPercent * 20.0f);
        float nextHeightIndex = mod(thisHeightIndex + 1.0f, 20.0f);
        float thisHeightIndexFraction = frac(azimuthPercent * 20.0f);

        float thisHeight = hash12(float2(thisHeightIndex, seed)) * 0.75f + 0.25f;
        float nextHeight = hash12(float2(nextHeightIndex, seed)) * 0.75f + 0.25f;

        float mountainHeight = lerp(thisHeight, nextHeight, thisHeightIndexFraction);

        if (heightPercent > mountainHeight)
        {
            hitInfo = oldHitInfo;
        }
        else
        {
            float3 brightPink = pow(float3(0.99f, 0.04f, 0.98f), float3(2.2f, 2.2f, 2.2f)) * 5.0f;

            float borderSize = 0.25f / maxMountainHeight;

            hitInfo.material.emissive = brightPink * smoothstep(mountainHeight - borderSize, mountainHeight, heightPercent);
        }
    }
}

void RayTraceScene(in float3 rayPos, in float3 rayDir, inout SRayHitInfo hitInfo)
{
    // floor
    {
        SMaterial material;
        material.diffuse = float3(0.1f, 0.1f, 0.1f);
        material.specular = float3(0.0f, 0.0f, 0.0f);
        material.roughness = 0.02f;
        material.emissive = float3(0.0f, 0.0f, 0.0f);
        if (TestPlaneTrace(rayPos, rayDir, hitInfo, float4(normalize(float3(0.0f, 1.0f, 0.0f)), -5.0f), material))
        {
            float3 intersectPos = rayPos + rayDir * hitInfo.dist;
            float2 uv = intersectPos.xz;

            uv = frac(uv / 75.0f);

            float dist = min(abs(uv.x - 0.5), abs(uv.y - 0.5));
            dist = step(dist, 0.005f);

            float len2d = (cos(intersectPos.x * 0.01530f + intersectPos.y * 0.06320f) + 1.0f) / 2.5f;

            float3 brightPurple = pow(float3(0.73f, 0.06f, 0.99f), float3(2.2f, 2.2f, 2.2f));
            brightPurple = lerp(brightPurple, float3(0.0625f, 0.0f, 1.0f), len2d);

            float3 darkPurple = pow(float3(0.12f, 0.02f, 0.09f), float3(2.2f, 2.2f, 2.2f));

            hitInfo.material.emissive = lerp(darkPurple, brightPurple, dist);
            hitInfo.material.specular = lerp(float3(0.33f, 0.33f, 0.33f), float3(0.0f, 0.0f, 0.0f), dist);
        }
    }

    // reflective balls
    {
        SMaterial material;
        material.diffuse = float3(0.5f, 0.5f, 0.5f);
        material.specular = float3(1.0f, 1.0f, 1.0f);
        material.roughness = 0.035f;
        material.emissive = float3(0.0f, 0.0f, 0.0f);
        TestSphereTrace(rayPos, rayDir, hitInfo, float4(20.0f, 5.0f, -20.0f, 10.0f), material);

        TestSphereTrace(rayPos, rayDir, hitInfo, float4(-60.0f, 0.0f, 20.0f, 10.0f), material);

        TestSphereTrace(rayPos, rayDir, hitInfo, float4(0.0f, 5.0f, -65.0f, 10.0f), material);

        TestSphereTrace(rayPos, rayDir, hitInfo, float4(15.0f, -3.0f, 65.0f, 2.0f), material);
    }

    // Cylinders with mountain cutouts - draw front to back
    {
        RayTraceMountainCylinders(rayPos, rayDir, hitInfo, 284.0f, 700.0f, 50.0f);
        RayTraceMountainCylinders(rayPos, rayDir, hitInfo, 1337.0f, 800.0f, 150.0f);
        RayTraceMountainCylinders(rayPos, rayDir, hitInfo, 1932.0f, 900.0f, 250.0f);
    }

    // dark sun with gradient
    {
        SMaterial material;
        material.diffuse = float3(0.0f, 0.0f, 0.0f);
        material.specular = float3(0.0f, 0.0f, 0.0f);
        material.roughness = 0.0f;
        material.emissive = float3(0.0f, 0.0f, 0.0f);

        SRayHitInfo oldHitInfo = hitInfo;

        if (TestPlaneTrace(rayPos, rayDir, hitInfo, float4(normalize(float3(0.0f, 0.0f, -1.0f)), -1000.0f), material))
        {
            float3 intersectPos = rayPos + rayDir * hitInfo.dist;
            float2 uv = intersectPos.xy;

            int stripe = int((-uv.y + 500.0f) / 50.0f);
            if (stripe > 1)
                stripe = (stripe - 1) % 2;
            else
                stripe = 0;

            if (length(uv) > 500.0f)
            {
                hitInfo = oldHitInfo;
            }
            else if (stripe == 1)
            {
                hitInfo.material.emissive = pow(float3(0.29f, 0.03f, 0.42f) * 0.55f, float3(2.2f, 2.2f, 2.2f));
            }
            else
            {
                float3 topColor = pow(float3(0.99f, 0.04f, 0.98f), float3(2.2f, 2.2f, 2.2f));
                float3 bottomColor = pow(float3(0.12f, 0.02f, 0.09f), float3(2.2f, 2.2f, 2.2f));

                float lerpAmount = clamp((uv.y - 100.0f) / 400.0f, 0.0f, 1.0f);
                lerpAmount = Bias(lerpAmount, 0.05);
                hitInfo.material.emissive = lerp(bottomColor, topColor, lerpAmount);
            }
        }
    }

    // ringed planet
    {
        // planet
        {
            SMaterial material;
            material.diffuse = float3(0.0f, 0.0f, 0.0f);
            material.specular = float3(0.0f, 0.0f, 0.0f);
            material.roughness = 0.0f;
            material.emissive = float3(0.0f, 0.0f, 0.0f);
            if (TestSphereTrace(rayPos, rayDir, hitInfo, float4(0.0f, 500.0f, -1200.0f, 200.0f), material))
            {
                // TODO: gradient: yellow to red, then red to purple?
                float3 intersectPos = rayPos + rayDir * hitInfo.dist;

                float lerpTop = clamp((intersectPos.y - 500.0f) / 200.0f, 0.0f, 1.0f);
                float lerpMiddle = 1.0f - clamp((intersectPos.y - 500.0f) / 200.0f, 0.0f, 1.0f);
                float lerpBottom = clamp((intersectPos.y - 500.0f) / -200.0f, 0.0f, 1.0f);

                lerpTop = Bias(lerpTop, 0.1f);
                lerpMiddle = Bias(lerpMiddle, 0.9f);
                lerpBottom = Bias(lerpBottom, 0.1f);

                float3 color = float3(1.0f, 1.0f, 0.0f) * lerpTop;
                color += float3(1.0f, 0.0f, 0.0f) * lerpMiddle;
                color += float3(1.0f, 0.0f, 1.0f) * lerpBottom;

                hitInfo.material.emissive = color;
            }
        }

        // ring
        {
            SMaterial material;
            material.diffuse = float3(0.0f, 0.0f, 0.0f);
            material.specular = float3(0.0f, 0.0f, 0.0f);
            material.roughness = 0.0f;
            material.emissive = float3(0.8f, 0.0f, 1.0f); // * 2.0f;// * 0.1f;

            TestCylinderTrace(rayPos, rayDir, hitInfo, float3(0.0f, 460.0f, -1200.0f), 300.0f, 10.0f, material);
            TestCylinderTrace(rayPos, rayDir, hitInfo, float3(0.0f, 460.0f, -1200.0f), 350.0f, 10.0f, material);
            TestCylinderTrace(rayPos, rayDir, hitInfo, float3(0.0f, 460.0f, -1200.0f), 375.0f, 10.0f, material);
        }
    }

    // sky dome
    {
        SMaterial material;
        material.diffuse = float3(0.0f, 0.0f, 0.0f);
        material.specular = float3(0.0f, 0.0f, 0.0f);
        material.roughness = 0.0f;
        material.emissive = pow(float3(0.29f, 0.03f, 0.42f) * 0.55f, float3(2.2f, 2.2f, 2.2f));
        if (TestSphereTrace(rayPos, rayDir, hitInfo, float4(0.0f, 0.0f, 0.0f, 2000.0f), material))
        {
            const float c_skyStarCells = 45.0f;

            // convert the hit position to polar, but percentages from 0 to 1.
            // make the pole at the horizon to hide the distortion that would be in the sky otherwise.
            float3 hitPos = (rayPos + rayDir * hitInfo.dist).yzx;
            float theta = (atan2(hitPos.y, hitPos.x) + c_pi) / c_twopi;
            float phi = (atan2(sqrt(hitPos.x * hitPos.x + hitPos.y * hitPos.y), hitPos.z) + c_pi) / c_twopi;

            // figure out what cell we are in and the offset in that cell
            float2 cellIndex = float2(floor(theta * c_skyStarCells), floor(phi * c_skyStarCells));
            float2 cellUV = float2(frac(theta * c_skyStarCells), frac(phi * c_skyStarCells));

            // make a star at a random place in the cell
            float starRadius = hash12(cellIndex) * 0.1f + 0.07f;
            float2 starPos = hash22(cellIndex) * (1.0f - starRadius * 2.0f) + starRadius;
            float dist = sdStar(starPos - cellUV, starRadius, 4, 3.75f);

            dist *= pow(length(starPos - cellUV) / starRadius, 10.0f);

            float value = step(dist, 0.0f);
            value *= pow(1.0f - clamp(length(starPos - cellUV) / starRadius, 0.0f, 1.0f), 3.0f);

            hitInfo.material.emissive = lerp(material.emissive, float3(1.0f, 1.0f, 1.0f), value);
        }
    }
}

SRayHitInfo TestSceneMarch(in float3 rayPos)
{
    SRayHitInfo hitInfo;
    hitInfo.hitAnObject = false;
    hitInfo.dist = c_superFar;

    // glowing triangles
    {

        float3 A = float3(0.0f, 0.0f, 0.0f);
        float3 B = float3(1.5f, 3.0f, 0.0f);
        float3 C = float3(3.0f, 0.0f, 0.0f);
        float lineWidth = 0.1f;

        float3 center = (A + B + C) / 3.0f;
        A -= center;
        B -= center;
        C -= center;

        A *= 3.0f;
        B *= 3.0f;
        C *= 3.0f;

        // foreground purple one
        SMaterial material;
        material.diffuse = float3(0.0f, 0.0f, 0.0f);
        material.specular = float3(0.0f, 0.0f, 0.0f);
        material.roughness = 0.0f;
        material.emissive = pow(float3(0.73f, 0.06f, 0.99f), float3(2.2f, 2.2f, 2.2f)) * 10.0f;

        TestLineMarch(rayPos, hitInfo, A, B, lineWidth, material);
        TestLineMarch(rayPos, hitInfo, B, C, lineWidth, material);
        TestLineMarch(rayPos, hitInfo, C, A, lineWidth, material);

        // blue one slightly behind
        material.emissive = pow(float3(0.3f, 0.15f, 1.0f), float3(2.2f, 2.2f, 2.2f)) * 10.0f;
        A += float3(0.0f, 0.0f, 5.0f);
        B += float3(0.0f, 0.0f, 5.0f);
        C += float3(0.0f, 0.0f, 5.0f);
        TestLineMarch(rayPos, hitInfo, A, B, lineWidth, material);
        TestLineMarch(rayPos, hitInfo, B, C, lineWidth, material);
        TestLineMarch(rayPos, hitInfo, C, A, lineWidth, material);

        // red one behind more
        material.emissive = pow(float3(1.0f, 0.15f, 0.3f), float3(2.2f, 2.2f, 2.2f)) * 10.0f;
        A += float3(0.0f, 0.0f, 5.0f);
        B += float3(0.0f, 0.0f, 5.0f);
        C += float3(0.0f, 0.0f, 5.0f);
        TestLineMarch(rayPos, hitInfo, A, B, lineWidth, material);
        TestLineMarch(rayPos, hitInfo, B, C, lineWidth, material);
        TestLineMarch(rayPos, hitInfo, C, A, lineWidth, material);
    }

    // a neon cactus
    {
        SMaterial material;
        material.diffuse = float3(0.0f, 0.0f, 0.0f);
        material.specular = float3(0.0f, 0.0f, 0.0f);
        material.roughness = 0.0f;
        material.emissive = pow(float3(0.73f, 0.06f, 0.99f), float3(2.2f, 2.2f, 2.2f)) * 10.0f;

        float3 cactusOffset = float3(0.0f, 0.0f, 50.0f);

        // main body section
        {
            float3 A = float3(-40.0f, -10.0f, 0.0f) + cactusOffset;
            float3 B = float3(-40.0f, 5.0f, 1.0f) + cactusOffset;
            float3 C = float3(-40.0f, 20.0f, 0.0f) + cactusOffset;
            TestBezierMarch(rayPos, hitInfo, A, B, C, 2.0f, material);
        }

        // Arm going to left
        {
            float3 A = float3(-40.0f, 5.0f, 1.0f) + cactusOffset;
            float3 B = float3(-32.5f, 10.0f, 0.0f) + cactusOffset;
            float3 C = float3(-32.5f, 15.0f, -1.0f) + cactusOffset;
            TestBezierMarch(rayPos, hitInfo, A, B, C, 1.0f, material);
        }

        // Arm going to right
        {
            float3 A = float3(-40.0f, 2.0f, 1.0f) + cactusOffset;
            float3 B = float3(-47.5f, 7.0f, 2.0f) + cactusOffset;
            float3 C = float3(-47.5f, 13.0f, 4.0f) + cactusOffset;
            TestBezierMarch(rayPos, hitInfo, A, B, C, 1.0f, material);
        }
    }

    return hitInfo;
}

// =======================================================================
// Ray Marching
// =======================================================================

void RayMarchScene(in float3 startingRayPos, in float3 rayDir, inout SRayHitInfo oldHitInfo, uint rayMarchSteps, float minStepDistance)
{
    SMaterial dummyMaterial = (SMaterial)0;

    float rayDistance = c_minimumRayHitTime;
    float lastRayDistance = c_minimumRayHitTime;

    float lastHitInfoDist = 0.0f;

    SRayHitInfo newHitInfo = oldHitInfo;
    newHitInfo.hitAnObject = false;

    for (int stepIndex = 0; stepIndex < rayMarchSteps; ++stepIndex)
    {
        float3 rayPos = startingRayPos + rayDistance * rayDir;

        newHitInfo = TestSceneMarch(rayPos);

        // these two lines are so that the material code goes away when the test functions are inlines
        newHitInfo.normal = float3(0.0f, 0.0f, 0.0f);
        newHitInfo.material = dummyMaterial;

        newHitInfo.hitAnObject = newHitInfo.dist < 0.0f;
        if (newHitInfo.hitAnObject)
            break;

        lastRayDistance = rayDistance;
        rayDistance += max(newHitInfo.dist, minStepDistance);

        lastHitInfoDist = newHitInfo.dist;

        if (rayDistance > oldHitInfo.dist)
            break;
    }

    if (newHitInfo.hitAnObject)
    {
        float refinedHitPercent = lastHitInfoDist / (lastHitInfoDist - newHitInfo.dist);
        newHitInfo.dist = lerp(lastRayDistance, rayDistance, refinedHitPercent);

        if (newHitInfo.dist < oldHitInfo.dist)
            oldHitInfo = newHitInfo;
    }
}

// =======================================================================
// Iterative bounce ray tracing
// =======================================================================

float3 GetColorForRay(in float3 startRayPos, in float3 startRayDir, inout uint rngState, int numBounces, uint rayMarchSteps, float minStepDistance)
{
    float3 ret = float3(0.0f, 0.0f, 0.0f);
    float3 colorMultiplier = float3(1.0f, 1.0f, 1.0f);

    float3 rayPos = startRayPos;
    float3 rayDir = startRayDir;

    for (int i = 0; i <= numBounces; ++i)
    {
        SRayHitInfo hitInfo;
        hitInfo.hitAnObject = false;
        hitInfo.dist = c_superFar;

        // ray trace first, which also gives a maximum distance for ray marching
        RayTraceScene(rayPos, rayDir, hitInfo);
        RayMarchScene(rayPos, rayDir, hitInfo, rayMarchSteps, minStepDistance);

        if (!hitInfo.hitAnObject)
        {
            // handle ray misses
            break;
        }

        // update the ray position
        rayPos += rayDir * hitInfo.dist;

        // get the material info if it was a ray marched object
        if (hitInfo.rayMarchedObject)
            hitInfo = TestSceneMarch(rayPos);

        // add in emissive lighting
        ret += hitInfo.material.emissive * colorMultiplier;

        // figure out whether we are going to shoot out a specular or diffuse ray.
        // If neither, exit
        float diffuseLength = length(hitInfo.material.diffuse);
        float specularLength = length(hitInfo.material.specular);
        if (diffuseLength + specularLength == 0.0f)
            break;
        float specularWeight = specularLength / (diffuseLength + specularLength);
        float doSpecular = float(RandomFloat01(rngState) < specularWeight);

        // set up the next ray direction
        float roughness = lerp(1.0f, hitInfo.material.roughness, doSpecular);
        float3 reflectDir = reflect(rayDir, hitInfo.normal);
        float3 randomDir = RandomUnitVector(rngState);
        rayDir = normalize(lerp(reflectDir, randomDir, roughness));

        if (dot(rayDir, hitInfo.normal) < 0.0f)
            rayDir *= -1.0f;

        // move the ray away from the surface it hit a little bit
        rayPos += hitInfo.normal * c_rayPosNormalNudge;

        // Make all future light affected be modulated by either the diffuse or specular reflection color
        // depending on which we are doing.
        // Attenuate diffuse by the dot product of the outgoing ray and the normal (aka multiply diffuse by cosine theta or N dot L)
        float NdotL = dot(hitInfo.normal, rayDir);
        colorMultiplier *= lerp(hitInfo.material.diffuse * NdotL, hitInfo.material.specular, doSpecular);

        if (/*$(Variable:ColorGrade)*/ == ColorGradeTimings::EveryRay)
            ColorGrade(ret);
    }

    return ret;
}

