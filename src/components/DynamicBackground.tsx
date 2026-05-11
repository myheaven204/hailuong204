import { useEffect, useRef, useCallback } from 'react';

interface DynamicBackgroundProps {
  className?: string;
  scrollProgress?: number;
}

export default function DynamicBackground({ className = '', scrollProgress = 0 }: DynamicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) return null;

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_scroll;

      #define PI 3.14159265359

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        vec2 stCopy = st;

        st = st * 2.0 - 1.0;
        st.x *= u_resolution.x / u_resolution.y;

        vec2 mouse = u_mouse / u_resolution;
        mouse = mouse * 2.0 - 1.0;
        mouse.x *= u_resolution.x / u_resolution.y;
        float mouseDist = length(st - mouse);
        float mouseInfluence = smoothstep(0.8, 0.0, mouseDist) * 0.2;

        float scrollFade = 1.0 - u_scroll * 0.3;
        float t = u_time * 0.1;

        vec2 q = vec2(0.0);
        q.x = fbm(st + t * 0.5);
        q.y = fbm(st + vec2(1.0) + t * 0.3);

        vec2 r = vec2(0.0);
        r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
        r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);

        float f = fbm(st + r + mouseInfluence * 0.5);
        f = f * f * f + 0.6 * f * f + 0.5 * f;

        vec3 color = vec3(0.0, 0.0, 0.0);
        vec3 accentGold = vec3(0.91, 0.64, 0.0);
        vec3 accentCyan = vec3(0.0, 0.83, 1.0);

        float colorMix = sin(t * 0.5) * 0.5 + 0.5;
        vec3 paletteColor = mix(accentGold, accentCyan, colorMix * 0.3);

        color = mix(color, paletteColor * 0.04, smoothstep(0.0, 0.8, f));
        color = mix(color, accentGold * 0.03, mouseInfluence);

        float radialDist = length(stCopy - 0.5);
        float radial = 1.0 - smoothstep(0.0, 0.7, radialDist);
        color += accentGold * radial * 0.02 * (sin(t) * 0.3 + 0.7);

        float vignette = 1.0 - smoothstep(0.3, 1.2, length(stCopy - 0.5));
        color *= vignette * 1.2;
        color *= scrollFade;

        color = clamp(color, 0.0, 1.0);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return null;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      time: gl.getUniformLocation(program, 'u_time'),
      mouse: gl.getUniformLocation(program, 'u_mouse'),
      scroll: gl.getUniformLocation(program, 'u_scroll'),
    };

    return { gl, program, uniforms };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    const { gl, program, uniforms } = initWebGL() || {};
    if (!gl || !program || !uniforms) return;

    const animate = () => {
      timeRef.current += 0.016;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, timeRef.current);
      gl.uniform2f(uniforms.mouse, mouseRef.current.x, canvas.height - mouseRef.current.y);
      gl.uniform1f(uniforms.scroll, Math.min(scrollProgress, 1));

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [initWebGL, scrollProgress]);

  return (
    <div className={`fixed inset-0 -z-30 pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
}
