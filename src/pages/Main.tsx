import { createAPI, type SceneData } from "@novorender/data-js-api";
import { getDeviceProfile, View } from "@novorender/api";
import styles from "./Main.module.css";
import { useEffect, useRef } from "react";

const baseUrl = new URL(`/novorender/api/`, window.location.origin);
const gpuTier = 2;
const deviceProfile = getDeviceProfile(gpuTier);

export function Main({ projectId }: { projectId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let newView: View | null = null;

    const init = async () => {
      const imports = await View.downloadImports({ baseUrl });
      newView = new View(canvasRef.current!, deviceProfile, imports);
      await loadData(newView, projectId);
      await newView.switchCameraController("flight");
      newView.modifyRenderState({ grid: { enabled: true } });
      newView.run();
    };

    init();

    return () => newView?.dispose();
  }, [projectId]);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <canvas className={styles.main} ref={canvasRef} id="canvas"></canvas>
    </div>
  );
}

async function loadData(view: View, projectId: string) {
  const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
  const dataApi = createAPI({
    serviceUrl: "https://data.novorender.com/api",
    authHeader: async () => ({
      header: "Authorization",
      value: `Bearer ${accessToken}`,
    }),
  });

  // Load scene metadata
  // Condos scene ID, but can be changed to any public scene ID
  const sceneData = await dataApi.loadScene(projectId);
  // Destructure relevant properties into variables
  const { url: _url } = sceneData as SceneData;
  const url = new URL(_url);
  const parentSceneId = url.pathname.replace(/\//g, "");
  url.pathname = "";
  // load the scene using URL gotten from `sceneData`
  const config = await view.loadScene(url, parentSceneId, "index.json");
  const { center, radius } = config.boundingSphere;
  view.activeController.autoFit(center, radius);

  return { sceneData: sceneData as SceneData };
}
