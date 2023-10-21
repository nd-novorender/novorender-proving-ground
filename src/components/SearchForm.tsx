import { FormEvent, useCallback, useRef } from "react";
import styles from "./SearchForm.module.css";
import { RenderStateHighlightGroups, View, createNeutralHighlight } from "@novorender/api";
import { SceneData } from "@novorender/data-js-api";

export function SearchForm(props: { view: View; sceneData: SceneData }) {
  const abortControllerRef = useRef<AbortController>();
  const { view, sceneData } = props;

  const submit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const term = e.currentTarget.querySelector("input")!.value;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      await searchObjectsByTerm(view, sceneData, abortControllerRef.current.signal, term);
      abortControllerRef.current = undefined;
    },
    [view, sceneData]
  );

  return (
    <form className={styles.form} onSubmit={submit}>
      <div>
        <input type="search" name="search" />
      </div>
      <button type="submit">Search</button>
    </form>
  );
}

async function searchObjectsByTerm(
  view: View,
  sceneData: SceneData,
  abortSignal: AbortSignal,
  term: string
) {
  const { db } = sceneData;
  if (db) {
    const iterator = db.search({ searchPattern: term }, abortSignal);

    const result: number[] = [];
    for await (const object of iterator) {
      result.push(object.id);
    }

    const renderStateHighlightGroups: RenderStateHighlightGroups = {
      defaultAction: result.length > 0 ? "hide" : undefined,
      groups: [{ action: createNeutralHighlight(), objectIds: result }],
    };

    // Finally, modify the renderState
    view.modifyRenderState({ highlights: renderStateHighlightGroups });
  }
}
