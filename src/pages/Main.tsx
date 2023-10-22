import { createAPI, type SceneData } from "@novorender/data-js-api";
import { getDeviceProfile, View } from "@novorender/api";
import styles from "./Main.module.css";
import { useEffect, useRef, useState } from "react";
import { SearchForm } from "../components/SearchForm";
import { CameraStateSlotList } from "../components/CameraStateSlotList";

const baseUrl = new URL(
  `${import.meta.env.BASE_URL || ""}/novorender/api/`,
  window.location.origin
);
const gpuTier = 2;
const deviceProfile = getDeviceProfile(gpuTier);

interface ViewData {
  view: View;
  sceneData: SceneData;
}

export function Main() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewData, setViewData] = useState<ViewData>();
  const view = viewData?.view;
  const sceneData = viewData?.sceneData;

  useEffect(() => {
    let newView: View | null = null;

    const init = async () => {
      const imports = await View.downloadImports({ baseUrl });
      newView = new View(canvasRef.current!, deviceProfile, imports);
      const loadDataResult = await loadData(newView);
      await newView.switchCameraController("flight");
      newView.modifyRenderState({ grid: { enabled: true } });
      newView.run();
      setViewData({ view: newView, sceneData: loadDataResult.sceneData });
    };

    init();

    return () => newView?.dispose();
  }, []);

  return (
    <div>
      <canvas className={styles.main} ref={canvasRef} id="canvas"></canvas>

      {view ? <CameraStateSlotList view={view} /> : null}

      {view ? <SearchForm view={view} sceneData={sceneData!} /> : null}
    </div>
  );
}

async function loadData(view: View) {
  console.log("loadData");

  // Initialize the data API with the Novorender data server service
  const dataApi = createAPI({
    serviceUrl: "https://data.novorender.com/api",
  });

  // Load scene metadata
  // Condos scene ID, but can be changed to any public scene ID
  const sceneData = await dataApi.loadScene("95a89d20dd084d9486e383e131242c4c");
  // Destructure relevant properties into variables
  const { url } = sceneData as SceneData;
  // load the scene using URL gotten from `sceneData`
  const config = await view.loadSceneFromURL(new URL(url));
  const { center, radius } = config.boundingSphere;
  view.activeController.autoFit(center, radius);

  return { sceneData: sceneData as SceneData };
}
