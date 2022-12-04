import React from 'react';
import { NoteNumber } from '../models';
import { AlphaTabApi } from '@coderline/alphatab';

type Props = {
  highlightLines: NoteNumber[];
}
export function Score({}: Props) {
  const containerRef = React.useRef(null);
  React.useEffect(() => {
    if (containerRef.current !== null) {
      const api = new AlphaTabApi(containerRef.current, {
        file: "https://www.alphatab.net/files/canon.gp",
      });
      api.scoreLoaded.on((score: any) => {
        console.log('Score was loaded!', score);
      });
    }
  }, [containerRef]);

  return (
    <div>
      <div ref={containerRef}></div>
    </div>
  );
}
