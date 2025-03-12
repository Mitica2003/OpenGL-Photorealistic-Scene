#version 410 core

uniform vec3 baseColor;

// Lighting uniforms
uniform vec3 lightDir;
uniform vec3 lightColor;

// Fragment shader inputs (de la vertex shader)
in vec3 fragPosition;
in vec3 fragNormal;

out vec4 fColor;

// Iluminare Phong
float ambientStrength = 0.2f;
float specularStrength = 0.5f;

void main()
{   
    // Normalize light direction
    vec3 lightDirN = normalize(lightDir);

    // Normalize normalul interpolat
    vec3 normal = normalize(fragNormal);

    // Compute view direction (originea este la observator in coordonate de spatiu ocular)
    vec3 viewDir = normalize(-fragPosition);

    // Ambient
    vec3 ambient = ambientStrength * lightColor;

    // Diffuse
    float diff = max(dot(normal, lightDirN), 0.0f);
    vec3 diffuse = diff * lightColor;

    // Specular
    vec3 reflectDir = reflect(-lightDirN, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0f), 32);
    vec3 specular = specularStrength * spec * lightColor;

    // Culorea finală pe pixel
    vec3 finalColor = min((ambient + diffuse) * baseColor + specular, vec3(1.0f));
    fColor = vec4(finalColor, 1.0f);
}
