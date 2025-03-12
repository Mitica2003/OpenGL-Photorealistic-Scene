#version 330 core

layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec3 inNormal;

out vec3 FragPos;    // Position of the fragment
out vec3 Normal;     // Normal at the fragment

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform mat3 normalMatrix; // Transposed inverse of the model-view matrix

void main()
{
    // Calculate fragment position in world coordinates
    FragPos = vec3(model * vec4(inPosition, 1.0));
    
    // Pass interpolated normal
    Normal = normalize(normalMatrix * inNormal);
    
    // Transform the vertex position
    gl_Position = projection * view * model * vec4(inPosition, 1.0);
}
