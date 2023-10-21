import type { ReadonlyVec3, ReadonlyQuat } from "gl-matrix";
import styles from "./CameraStateSlotList.module.css";
import { useCallback, useState, type MouseEvent, type ReactNode, memo } from "react";
import { View } from "@novorender/api";
import { useShiftPressed } from "../hooks/useShiftPressed";

interface CameraState {
  position: ReadonlyVec3;
  rotation: ReadonlyQuat;
}

function CameraStateSlotListInner(props: { view: View }) {
  const [cameraStates, setCameraStates] = useState<(CameraState | null)[]>([null, null, null]);
  const isShiftPressed = useShiftPressed();
  const { view } = props;

  const onClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const index = Number(e.currentTarget.dataset.index);
      if (e.shiftKey) {
        // Save
        const newState: CameraState = {
          position: view.renderState.camera.position,
          rotation: view.renderState.camera.rotation,
        };
        setCameraStates((states) => states.map((state, i) => (i === index ? newState : state)));
      } else {
        // Restore
        const state = cameraStates[index];
        if (!state) return;
        view!.activeController.moveTo(state.position, undefined, state.rotation);
      }
    },
    [cameraStates, view]
  );

  return (
    <div className={styles.container}>
      {cameraStates.map((cameraState, i) => {
        let content: ReactNode;
        if (isShiftPressed) {
          content = "Save camera state";
        } else if (!cameraState) {
          content = (
            <div className={styles.empty}>
              Empty
              <div className={styles.secondary}>Shift+Click to save</div>
            </div>
          );
        } else {
          content = "Go to saved state";
        }

        return (
          <button key={i} className={styles.btn} onClick={onClick} data-index={i}>
            {content}
          </button>
        );
      })}
    </div>
  );
}

export const CameraStateSlotList = memo(CameraStateSlotListInner);
