import * as THREE from "three";
import * as React from "react";
import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useSpring, a } from "@react-spring/three";
import { useGesture } from "react-use-gesture";
import { useSetRecoilState } from "recoil";
import { cardState, mainFolderState } from "@/atoms/state";
import { useDrop } from "react-dnd";

function Object() {
  const setMainFolder = useSetRecoilState(mainFolderState);
  const ref = useRef<THREE.Mesh>(null!);
  const gltf = useLoader(GLTFLoader, "/models/mailbox/scene.gltf");
  const [spring, set] = useSpring(() => ({
    scale: [1.25, 1.1, 1.25],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    config: { friction: 10 },
  }));
  const bind = useGesture({
    onHover: ({ hovering }) => {
      const targetRotation = hovering ? [-0.4, 0, 0] : [0, 0, 0];
      set.start({ rotation: targetRotation });
    },
  });
  return (
    <a.mesh
      ref={ref}
      {...spring as any}
      {...bind()}
      onClick={() => {
        setMainFolder("shared");
      }}
    >
      <primitive object={gltf.scene} />
    </a.mesh>
  );
}

export default function Mailbox() {
  const setCardState = useSetRecoilState(cardState);
  const [{ isOver }, drop] = useDrop({
    accept: "object",
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    hover: (item, monitor) => {
      const object: {
        id: number | null | undefined;
        key: string | null | undefined;
        url: string | null | undefined;
      } = item as {
        id: number | null | undefined;
        key: string | null | undefined;
        url: string | null | undefined;
      };
      console.log(object);
      if (!object.id) {
        setCardState({
          name: "Share",
          shown: true,
          folderId: null,
          filekey: object.key,
          newName: null,
          url: object.url,
          sharedfiledelete: false,
        });
      }
    },
  });
  return (
    <div ref={drop} className="md:h-36 h-28">
      <Canvas camera={{ position: [1, 2, 2] }}>
        <ambientLight intensity={1.2} />
        <directionalLight
          castShadow
          position={[1, -2, 1]}
          shadow-mapSize={[1024, 1024]}
        >
          <orthographicCamera attach="shadow-camera" args={[-1, 1, 1, -1]} />
        </directionalLight>
        <Object />
      </Canvas>
    </div>
  );
}
