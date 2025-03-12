# OpenGL-Photorealistic-Scene

## Project Overview

This project showcases a stunning photorealistic scene rendered using OpenGL, blending industrial-era machinery with futuristic technology, all set against a beautiful and sunny landscape. The scene is interactive, offering users the ability to explore the environment using keyboard controls. It includes lighting effects, and dynamic shadows for a truly immersive experience.

## Key Features

- **Free Navigation:** Move around the scene freely with the W, A, S, D, Z, X keys
- **Interactive Objects:** Interact with objects and adjust environmental settings such as lighting and fog
- **Customizable Options:** Switch between night mode, view shadow maps, and adjust fog density with easy keyboard shortcuts.

## System Architecture

The **SceneProject** is organized into several modules, each responsible for specific tasks in the 3D rendering pipeline:

- **Main Application (`main.cpp`)**: This file serves as the entry point, initializing the window, setting up the event loop, and starting the rendering process.
- **Mesh Handling (`Mesh.cpp`, `Mesh.hpp`)**: Manages 3D mesh loading, preparation, and rendering.
- **3D Models (`Model3D.cpp`, `Model3D.hpp`)**: Deals with the management of complex models made of multiple meshes.
- **Camera Control (`Camera.cpp`, `Camera.hpp`)**: Provides movement and perspective management for the camera.
- **SkyBox (`SkyBox.cpp`, `SkyBox.hpp`)**: Renders the surrounding environment using cube mapping techniques.
- **Shader Management (`Shader.cpp`, `Shader.hpp`)**: Handles shader compilation and applies vertex/fragment shaders for rendering.
- **Additional Utilities**:
  - `stb_image.h/cpp`: A lightweight library for loading textures.
  - `tiny_obj_loader.h/cpp`: A minimal OBJ loader for importing mesh data.

## Rendering Process

This project leverages **OpenGL** for rendering, using **GLSL** shaders to execute real-time graphics operations. The rendering pipeline includes:

1. **Model Importing**: 3D models in the OBJ format are loaded using `tiny_obj_loader` and converted into mesh data.
2. **Texture Application**: Textures are mapped onto meshes using UV coordinates, and `stb_image` is used for loading image files.
3. **Shader Handling**: Vertex and fragment shaders in the `shaders` directory are used to process geometry and apply effects like lighting based on the camera’s position.
4. **Main Loop**: The application’s event loop is responsible for processing input, updating the camera, and executing draw calls.

## User Guide

### Movement Controls

| Key(s)       | Action                                          |
|--------------|-------------------------------------------------|
| W, A, S, D   | Move Forward/Backward/Left/Right                |
| Z, X         | Move Up/Down                                    |
| ESC          | Exit the application                            |

### Additional Interaction Shortcuts

| Key(s)       | Action                                          |
|--------------|-------------------------------------------------|
| M            | Toggle shadow mapping display                   |
| N, M         | Enable/disable night mode                       |
| Q, E         | Rotate Camera Left/Right                        |
| J, L         | Rotate light cube Left/Right                    |
| 1, 2, 3, 4   | Switch between viewing modes (Wireframe/Point/Normal/Smooth) |
| C, V         | Adjust fog density                              |
| O, P         | Activate/deactivate point light                |

These hotkeys allow for dynamic interaction, offering a fully immersive experience. Feel free to explore the scene and adjust settings for different visual effects.

## Future Work and Improvements

This project demonstrates OpenGL’s potential for creating photorealistic environments. Future developments may include introducing third-person character controls and expanding interactive capabilities within the scene.

## Note

The Github repository is only a 'framework' of the project. You have to include your own Blender scene and adjust the code in (`main.cpp`).
