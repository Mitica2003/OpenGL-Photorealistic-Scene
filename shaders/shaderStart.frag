#version 410 core

in vec3 fNormal;
in vec4 fPosEye;
in vec2 fTexCoords;
in vec4 fragPosLightSpace;

out vec4 fColor;

// Lighting
uniform vec3 lightDir;
uniform vec3 lightColor;

// Texture
uniform sampler2D diffuseTexture;
uniform sampler2D specularTexture;
uniform sampler2D shadowMap;

// Light components
vec3 ambient;
float ambientStrength = 0.2f;
vec3 diffuse;
vec3 specular;
float specularStrength = 0.5f;
float shininess = 32.0f;

// Light constants
float constant = 1.0f;
float linear = 0.09f;
float quadratic = 0.1;

// Night Mode
uniform bool nightMode;

// Fog
uniform float fog;

// Point light
uniform bool point;
uniform vec3 lightPointPositon;

// Point Light constants
float ambient_point = 0.5f;
float specular_point = 0.5f;
float shininess_point = 32.0f;

uniform mat4 view;

vec3 computeLightComponents() {

    vec3 cameraPosEye = vec3(0.0f);  // In eye coordinates, the viewer is situated at the origin
    
    // Transform normal
    vec3 normalEye = normalize(fNormal);
    
	// Compute light direction    
    vec3 lightDirN = normalize(lightDir);
    
	// Compute view direction 
    vec3 viewDirN = normalize(cameraPosEye - fPosEye.xyz);
    vec3 halfVector = normalize(lightDirN + viewDirN);

    // Compute ambient light
    ambient = ambientStrength * lightColor;
    
    // Compute diffuse light
    diffuse = max(dot(normalEye, lightDirN), 0.0f) * lightColor;
    
    // Compute specular light
    float specCoeff = pow(max(dot(halfVector, normalEye), 0.0f), shininess);
    specular = specularStrength * specCoeff * lightColor;

    // In case night mode is active
    if (nightMode) {
        ambient = ambient * 0.1;
        diffuse = diffuse * 0.2;
        specular = specular * 0.3;
    }
    
    return (ambient + diffuse + specular);
}

float computeFog() {

    float fragmentDistance = length(fPosEye);
    float fogFactor = exp(-pow(fragmentDistance * fog, 2));

    return clamp(fogFactor, 0.0f, 1.0f);
}

float computeShadow() {

	// Perform perspective divide
    vec3 normalizedCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
	
    // Transform to [0,1] range
    normalizedCoords = normalizedCoords * 0.5f + 0.5f;

	// Get closest depth value from light's perspective
    float closestDepth = texture(shadowMap, normalizedCoords.xy).r;

    // Get depth of current fragment from light's perspective
    float currentDepth = normalizedCoords.z;

    // Check whether current frag pos is in shadow
    float bias = 0.0005f;
    float shadow = currentDepth - bias > closestDepth ? 1.0f : 0.0f;
    if (normalizedCoords.z > 1.0f) return 0.0f;

    return shadow;
}

vec3 pointLight(vec4 lightPosEye) {

    // Define camera position in eye space
    vec3 eyeSpaceCameraPos = vec3(0.0f);

    // Calculate normal in eye space
    vec3 normalizedNormal = normalize(fNormal);

    // Compute light direction and view direction
    vec3 lightDirection = normalize(lightPosEye.xyz - fPosEye.xyz);
    vec3 viewDirection = normalize(eyeSpaceCameraPos - fPosEye.xyz);

    // Compute ambient component
    vec3 ambientComponent = ambient_point * lightColor;

    // Compute diffuse component
    vec3 diffuseComponent = max(dot(normalizedNormal, lightDirection), 0.0f) * lightColor;

    // Compute specular component
    vec3 halfwayVector = normalize(lightDirection + viewDirection);
    vec3 specularComponent = specular_point * pow(max(dot(normalizedNormal, halfwayVector), 0.0f), shininess_point) * lightColor;

    // Calculate attenuation
    float distanceToLight = length(lightPosEye.xyz - fPosEye.xyz);
    float attenuation = 1.0f / (constant + linear * distanceToLight + quadratic * distanceToLight * distanceToLight);

    return (ambientComponent + diffuseComponent + specularComponent) * attenuation;
}

void main() {

    // Compute lighting components
    vec3 lightingComponents = computeLightComponents();

    // Sample base color from diffuse texture
    vec3 diffuseColor = texture(diffuseTexture, fTexCoords).rgb;

    // Modulate lighting components with textures
    vec3 ambientLight = ambient * diffuseColor;
    vec3 diffuseLight = diffuse * diffuseColor;
    vec3 specularLight = specular * texture(specularTexture, fTexCoords).rgb;

    // Calculate shadow factor
    float shadowFactor = computeShadow();

    // Point light contribution
    if (point) {
        vec4 transformedPointLightPos = view * vec4(lightPointPositon, 1.0f);
        lightingComponents += pointLight(transformedPointLightPos);
    }

    // Combine lighting components with shadow
    vec3 finalLighting = ambientLight + (1.0f - shadowFactor) * (diffuseLight + specularLight);
    vec3 colorWithLighting = min(finalLighting, vec3(1.0f));

    // Fog effect calculation
    float fogIntensity = computeFog();
    vec4 fogColor = vec4(0.6, 0.6, 0.6, 1.0); // Default fog color for day

    // Adjust fog color for night mode
    if (nightMode) {
        fogColor = vec4(0.05, 0.05, 0.1, 1.0); // Darker fog for night
    }

    // Blend final color with fog
    vec4 litColor = vec4(colorWithLighting, 1.0f);
    vec4 blendedColor = mix(fogColor, min(litColor * vec4(lightingComponents, 1.0f), 1.0f), fogIntensity);

    fColor = blendedColor;
}
