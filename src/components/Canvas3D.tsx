import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls, GizmoHelper, GizmoViewcube } from '@react-three/drei';
import { useSelector, useDispatch } from 'react-redux';
import { Group, Mesh, BoxGeometry, MeshStandardMaterial } from 'three';
import { ModelProvider } from './ModelContext';
import { ModelMetadata, updateModelTransform } from '../store/slices/modelSlice';

interface Canvas3DProps {
  selectedModel: Group | null;
}

const Canvas3D: React.FC<Canvas3DProps> = ({ selectedModel }) => {
  const modelsMetadata = useSelector((state: any) => state.models.models) as ModelMetadata[];
  const selectedModelId = useSelector((state: any) => state.models.selectedModelId);
  const activeTool = useSelector((state: any) => state.ui.activeTool);
  const dispatch = useDispatch();

  const [models, setModels] = useState<{ [id: string]: Group }>({});

  useEffect(() => {
    const newModels: { [id: string]: Group } = {};
    modelsMetadata.forEach((meta: ModelMetadata) => {
      const geometry = new BoxGeometry(1, 1, 1);
      const material = new MeshStandardMaterial({ color: 0x00ff00 });
      const mesh = new Mesh(geometry, material);
      const group = new Group();
      group.add(mesh);
      group.position.set(...meta.position);
      group.rotation.set(...meta.rotation);
      group.scale.set(...meta.scale);
      newModels[meta.id] = group;
    });
    setModels(newModels);
  }, [modelsMetadata]);

  const handleTransformChange = (object: Group) => {
    if (selectedModelId && object) {
      const position = object.position.toArray() as [number, number, number];
      const rotation = object.rotation.toArray().slice(0, 3) as [number, number, number];
      const scale = object.scale.toArray() as [number, number, number];
      dispatch(updateModelTransform({ id: selectedModelId, position, rotation, scale }));
    }
  };

  return (
    <Canvas>
      <ModelProvider selectedModel={selectedModel}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        
        {selectedModel && (
          <TransformControls
            object={selectedModel}
            mode={activeTool as any}  // 'translate', 'rotate', or 'scale'
            onObjectChange={() => handleTransformChange(selectedModel)}
          />
        )}

        {Object.values(models).map((model, index) => (
          <primitive object={model} key={index} />
        ))}

        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewcube />
        </GizmoHelper>
      </ModelProvider>
    </Canvas>
  );
};

export default Canvas3D;
