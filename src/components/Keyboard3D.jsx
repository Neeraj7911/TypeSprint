import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

const Key = ({ position, letter }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  useFrame(() => {
    if (hovered) {
      meshRef.current.scale.setScalar(1.1);
    } else {
      meshRef.current.scale.setScalar(1);
    }
    if (pressed) {
      meshRef.current.position.y = -0.1;
    } else {
      meshRef.current.position.y = 0;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
    >
      <boxGeometry args={[0.8, 0.8, 0.2]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "white"} />
      <Text
        position={[0, 0, 0.11]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {letter}
      </Text>
    </mesh>
  );
};

const Keyboard3D = () => {
  const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.x = Math.sin(t / 4) / 8;
    groupRef.current.rotation.y = Math.sin(t / 2) / 8;
  });

  return (
    <group ref={groupRef}>
      {keys.map((key, index) => (
        <Key
          key={key}
          position={[
            (index % 10) * 1 - 4.5,
            Math.floor(index / 10) * -1 + 1,
            0,
          ]}
          letter={key}
        />
      ))}
    </group>
  );
};

export default Keyboard3D;
